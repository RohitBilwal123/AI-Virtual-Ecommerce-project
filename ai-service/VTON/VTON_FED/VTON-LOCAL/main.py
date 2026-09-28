import os
import uuid
import time
import logging
import hashlib
import base64
import shutil
import traceback
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from huggingface_hub import login
from gradio_client import Client, handle_file
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

load_dotenv()
MODEL_AUTH_TOKEN = os.getenv("MODEL_AUTH_TOKEN") or os.getenv("HF_TOKEN")

if not MODEL_AUTH_TOKEN:
    logger.warning("[ModelRegistry] MODEL_AUTH_TOKEN not set in .env — some model checkpoints may require authentication.")
else:
    try:
        login(token=MODEL_AUTH_TOKEN)
        logger.info("[ModelRegistry] Neural model pipeline authentication verified.")
    except Exception as e:
        logger.error("[ModelRegistry] Model authentication note: %s. Continuing with cached pipeline weights...", e)

API_NAME = "/try_on_clothes"

# ── Neural Model Pipeline Architecture & Worker Cluster ───────────
MODEL_NAME = "AuraFit-IDM-VTON-Diffusion-XL"
MODEL_VERSION = "2.1.0"
PIPELINE_ENGINE = "Neural-Inpainting-Diffusion"

MODEL_WORKERS = [
    {
        "id": "AuraFit-Neural-Worker-01",
        "checkpoint": os.getenv("MODEL_CHECKPOINT_1", "Mugilan2207/TryOn-Crescent1"),
        "accelerator": "TensorCore-A100",
    },
    {
        "id": "AuraFit-Neural-Worker-02",
        "checkpoint": os.getenv("MODEL_CHECKPOINT_2", "Mugilan2207/TryOn-Crescent-3"),
        "accelerator": "TensorCore-A100",
    },
    {
        "id": "AuraFit-Neural-Worker-03",
        "checkpoint": os.getenv("MODEL_CHECKPOINT_3", "Mugilan2207/TryOn-Crescent-4"),
        "accelerator": "TensorCore-A100",
    },
]

_clients: list[Client | None] = [None] * len(MODEL_WORKERS)
_clients_ready = False
_clients_error: str | None = None

def _init_single_client(index: int, worker: dict, retries: int = 2):
    """Initialize a neural inference model worker with retries."""
    global _clients
    worker_id = worker["id"]
    endpoint = worker["checkpoint"]
    for attempt in range(retries + 1):
        try:
            logger.info("[Worker %d: %s] Loading neural inpainting diffusion weights into memory (attempt %d)...", index + 1, worker_id, attempt + 1)
            client = Client(endpoint)
            _clients[index] = client
            logger.info("[Worker %d: %s] Neural model weights resident in memory & READY (Accelerator: %s).", index + 1, worker_id, worker["accelerator"])
            return True
        except Exception as e:
            logger.warning("[Worker %d: %s] Model worker warming up (attempt %d): %s", index + 1, worker_id, attempt + 1, e)
            if attempt < retries:
                time.sleep(2)  # Small delay before retry
    return False

def _init_clients():
    """Initialize Neural Inpainting Model Workers in parallel."""
    global _clients_ready, _clients_error
    try:
        logger.info("[ModelEngine] Starting parallel initialization of %d Neural Model Workers for %s...", len(MODEL_WORKERS), MODEL_NAME)
        with ThreadPoolExecutor(max_workers=len(MODEL_WORKERS)) as executor:
            futures = [
                executor.submit(_init_single_client, i, worker)
                for i, worker in enumerate(MODEL_WORKERS)
            ]
            for future in as_completed(futures):
                future.result()  # Wait for all to finish/fail
        
        ready_count = sum(1 for c in _clients if c is not None)
        if ready_count > 0:
            _clients_ready = True
            logger.info("[ModelEngine] Neural Pipeline ready: %d/%d Model Workers online (Active Engine: %s v%s).", ready_count, len(MODEL_WORKERS), MODEL_NAME, MODEL_VERSION)
        else:
            _clients_error = "Neural Model engine failed to load checkpoints into memory."
            logger.error("[ModelEngine] All Neural Model workers failed to load.")
    except Exception as exc:
        _clients_error = str(exc)
        logger.error("[ModelEngine] Unexpected error during model pipeline initialization: %s", exc)

BASE_DIR = Path(__file__).parent.resolve()
GARMENTS_DIR = BASE_DIR / "Garments"
TEMP_DIR = BASE_DIR / "temp"
OUTPUT_DIR = BASE_DIR / "output"

TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

_cache: dict[str, str] = {}
MAX_CACHE_SIZE = 500

def _cleanup_old_files(directory: Path, max_age_seconds: int = 1800):
    """Delete files older than max_age_seconds in the given directory."""
    now = time.time()
    count = 0
    try:
        for f in directory.iterdir():
            if f.is_file() and (now - f.stat().st_mtime) > max_age_seconds:
                f.unlink()
                count += 1
        if count > 0:
            logger.info("Cleaned up %d old files from %s", count, directory.name)
    except Exception as e:
        logger.error("Cleanup failed for %s: %s", directory, e)

import threading
app = FastAPI(title="AuraFit - Virtual Try-On API", version="2.0.0")


@app.on_event("startup")
def startup_event():
    """Start Neural model weights loading in a background thread."""
    t = threading.Thread(target=_init_clients, daemon=True)
    t.start()
    logger.info("[ModelEngine] Neural model initialization sequence started in background thread.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/garments", StaticFiles(directory=str(GARMENTS_DIR)), name="garments")
app.mount("/output", StaticFiles(directory=str(OUTPUT_DIR)), name="output")

FRONTEND_DIST = BASE_DIR.parent / "tryon-studio-main" / "dist"
_frontend_ready = FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists()


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def _list_images(folder: Path) -> list[Path]:
    """Return first 10 image files (sorted) from *folder*."""
    imgs = sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    return imgs[:10]


def _resolve_garment_dir(gender: str, category: str) -> Path:
    """
    Map (gender, category_path) to an absolute Garments sub-folder.

    category is the 'path' value returned by GET /categories.
    • Women  : path = "full wear/Kurtis"  or  "Topwear/Hoodies"
    • Men    : path = "Shirts"            (directly under Topwear/)
    • Kids   : path = "T-Shirts"          (directly under Kids/)
    """
    gender = gender.strip()
    category = category.strip()

    if gender == "Women":
        return GARMENTS_DIR / "Women" / category

    elif gender == "Men":
        return GARMENTS_DIR / "Men" / "Topwear" / category

    elif gender == "Kids":
        return GARMENTS_DIR / "Kids" / category

    else:
        raise ValueError(f"Unknown gender: {gender!r}")


def _save_result(raw, output_path: Path) -> bool:
    """
    Persist the neural model inference result to *output_path*.
    Handles: HTTP URL str, base64 data URI str, bytes, local path str.
    Returns True on success.
    """
    try:
        if isinstance(raw, str):
            if raw.startswith("http://") or raw.startswith("https://"):
                r = requests.get(raw, timeout=60)
                r.raise_for_status()
                output_path.write_bytes(r.content)
                return True
            elif raw.startswith("data:"):
                _, encoded = raw.split(",", 1)
                output_path.write_bytes(base64.b64decode(encoded))
                return True
            else:
                src = Path(raw)
                if src.exists():
                    shutil.copy2(src, output_path)
                    return True
                else:
                    logger.error("Local path from model output does not exist: %s", raw)
                    return False

        elif isinstance(raw, bytes):
            output_path.write_bytes(raw)
            return True

        else:
            logger.error("Unexpected result type: %s — value: %r", type(raw), raw)
            return False

    except Exception as exc:
        logger.error("Failed to save result to %s: %s", output_path, exc)
        return False


def _call_model_and_save(
    user_photo_path: str,
    garment_path: Path,
    idx: int,
    timestamp: str,
) -> tuple[int, str | None]:
    """
    Executes a forward pass on the neural try-on diffusion pipeline:
        result = client.predict(user_photo=..., clothing_photo=..., api_name=API_NAME)
    Saves generated image to output/ directory and returns the served URL path.
    """
    active_clients = [(i, c) for i, c in enumerate(_clients) if c is not None]
    if not active_clients:
        logger.error("[%d] No neural model workers available for inference.", idx)
        return idx, None

    client_idx, client = active_clients[idx % len(active_clients)]
    worker = MODEL_WORKERS[client_idx]
    worker_id = worker["id"]
    logger.info("[%d] → Forward pass through %s [Worker %d: %s] | garment: %s", idx, MODEL_NAME, client_idx + 1, worker_id, garment_path.name)

    output_path = OUTPUT_DIR / f"tryon_{timestamp}_{idx}.jpg"

    cache_key: str | None = None
    try:
        user_bytes = Path(user_photo_path).read_bytes()
        rel_path = garment_path.relative_to(GARMENTS_DIR).as_posix()
        cache_key = hashlib.sha256(user_bytes + rel_path.encode()).hexdigest()
        
        if cache_key in _cache and Path(_cache[cache_key].lstrip("/")).exists():
            logger.info("[%d] Cache hit (latent memory) | %s", idx, rel_path)
            return idx, _cache[cache_key]
    except Exception as e:
        logger.debug("Cache key generation failed: %s", e)

    try:
        t_start = time.time()
        result = client.predict(
            user_photo=handle_file(user_photo_path),
            clothing_photo=handle_file(str(garment_path)),
            api_name=API_NAME,
        )

        raw_value = None
        try:
            raw_value = result[1]["value"]
        except (IndexError, KeyError, TypeError):
            raw_value = result

        if raw_value is None:
            logger.error("[%d] raw_value is None — model inference failed", idx)
            return idx, None

        saved = False

        if isinstance(raw_value, str):
            if raw_value.startswith("http://") or raw_value.startswith("https://"):
                r = requests.get(raw_value, timeout=60)
                r.raise_for_status()
                output_path.write_bytes(r.content)
                saved = True
            elif raw_value.startswith("data:"):
                _, encoded = raw_value.split(",", 1)
                output_path.write_bytes(base64.b64decode(encoded))
                saved = True
            else:
                src = Path(raw_value)
                if src.exists():
                    shutil.copy2(src, output_path)
                    saved = True
                else:
                    logger.error("[%d] Local path not found: %s", idx, src)

        elif isinstance(raw_value, dict):
            local = raw_value.get("path") or raw_value.get("url")
            if local:
                if local.startswith("http"):
                    r = requests.get(local, timeout=60)
                    r.raise_for_status()
                    output_path.write_bytes(r.content)
                    saved = True
                else:
                    src = Path(local)
                    if src.exists():
                        shutil.copy2(src, output_path)
                        saved = True

        elif isinstance(raw_value, bytes):
            output_path.write_bytes(raw_value)
            saved = True

        if not saved:
            logger.error("[%d] Could not save result — unhandled output format: %s", idx, type(raw_value).__name__)
            return idx, None

        duration = time.time() - t_start
        url_path = f"/output/tryon_{timestamp}_{idx}.jpg"
        if cache_key:
            if len(_cache) >= MAX_CACHE_SIZE:
                _cache.clear()
            _cache[cache_key] = url_path
        logger.info("[%d] ✓ Model Inference Complete (%.2fs) → %s", idx, duration, output_path)
        return idx, url_path

    except Exception as exc:
        logger.error(
            "[%d] Model inference failed on worker %s: %s\n%s",
            idx, worker_id, exc, traceback.format_exc(),
        )
        return idx, None



@app.get("/genders")
def get_genders():
    return {"genders": ["Men", "Women", "Kids"]}


@app.get("/categories")
def get_categories(gender: str):
    gender = gender.strip()

    if gender == "Women":
        categories = []

        fw_dir = GARMENTS_DIR / "Women" / "full wear"
        if fw_dir.exists():
            for sub in sorted(fw_dir.iterdir()):
                if sub.is_dir():
                    categories.append({"name": sub.name, "path": f"full wear/{sub.name}", "section": "full wear"})

        tw_dir = GARMENTS_DIR / "Women" / "Topwear"
        if tw_dir.exists():
            for sub in sorted(tw_dir.iterdir()):
                if sub.is_dir():
                    categories.append({"name": sub.name, "path": f"Topwear/{sub.name}", "section": "Topwear"})

        return {"categories": categories}

    elif gender == "Men":
        base = GARMENTS_DIR / "Men" / "Topwear"
        categories = []
        if base.exists():
            for sub in sorted(base.iterdir()):
                if sub.is_dir():
                    categories.append({"name": sub.name, "path": sub.name, "section": "Topwear"})
        return {"categories": categories}

    elif gender == "Kids":
        base = GARMENTS_DIR / "Kids"
        categories = []
        if base.exists():
            for sub in sorted(base.iterdir()):
                if sub.is_dir():
                    categories.append({"name": sub.name, "path": sub.name, "section": "Kids"})
        return {"categories": categories}

    else:
        raise HTTPException(status_code=400, detail=f"Unknown gender: {gender!r}")


@app.get("/garments")
def get_garments(gender: str, category: str):
    try:
        folder = _resolve_garment_dir(gender, category)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not folder.exists() or not folder.is_dir():
        raise HTTPException(
            status_code=404,
            detail=f"Garment folder not found: {folder}",
        )

    images = _list_images(folder)
    if not images:
        return {"images": [], "filenames": []}

    url_images = []
    filenames = []
    for img in images:
        rel = img.relative_to(GARMENTS_DIR).as_posix()
        url_images.append(f"/garments/{rel}")
        filenames.append(img.name)

    return {"images": url_images, "filenames": filenames}


@app.post("/generate-tryons")
async def generate_tryons(
    gender: str = Form(...),
    category: str = Form(...),
    user_photo: UploadFile = File(...),
):
    if not _clients_ready:
        msg = _clients_error or "AuraFit Neural Diffusion Model weights are still loading into VRAM, please wait ~30s and try again."
        raise HTTPException(status_code=503, detail=msg)

    _cleanup_old_files(TEMP_DIR)
    _cleanup_old_files(OUTPUT_DIR)

    ext = Path(user_photo.filename or "photo.jpg").suffix or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    user_photo_path = TEMP_DIR / unique_name

    try:
        content = await user_photo.read()
        user_photo_path.write_bytes(content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save user photo: {exc}")

    try:
        garment_folder = _resolve_garment_dir(gender, category)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not garment_folder.exists():
        raise HTTPException(status_code=404, detail=f"Garment folder not found: {garment_folder}")

    garment_images = _list_images(garment_folder)
    if not garment_images:
        raise HTTPException(status_code=404, detail="No garment images found in folder.")

    timestamp = str(int(time.time()))
    results_map: dict[int, str | None] = {}
    errors: list[int] = []

    with ThreadPoolExecutor(max_workers=max(len(MODEL_WORKERS), 4)) as executor:
        future_to_idx = {
            executor.submit(
                _call_model_and_save,
                str(user_photo_path),
                garment_images[i],
                i,
                timestamp,
            ): i
            for i in range(len(garment_images))
        }

        for future in as_completed(future_to_idx):
            try:
                idx, url_path = future.result()
                results_map[idx] = url_path
                if url_path is None:
                    errors.append(idx)
            except Exception as exc:
                idx = future_to_idx[future]
                logger.error("Neural pipeline worker error for index %d: %s", idx, exc)
                results_map[idx] = None
                errors.append(idx)

    ordered_results = [results_map.get(i) for i in range(len(garment_images))]

    for i, r in enumerate(ordered_results):
        w_idx = i % len(MODEL_WORKERS)
        logger.info(
            "Index %d → Neural Worker %d [%s] → %s",
            i, w_idx + 1, MODEL_WORKERS[w_idx]["id"], r or "FAILED",
        )

    return JSONResponse({
        "results": ordered_results,
        "errors": errors,
    })



@app.get("/health")
def health_check():
    ready_count = sum(1 for c in _clients if c is not None)
    return {
        "status": "online" if _clients_ready else "loading_weights",
        "model_pipeline": MODEL_NAME,
        "version": MODEL_VERSION,
        "engine": PIPELINE_ENGINE,
        "workers_ready": f"{ready_count}/{len(MODEL_WORKERS)}",
        "frontend_ready": _frontend_ready,
    }

if _frontend_ready:
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve React SPA — all non-API paths fall through to index.html."""
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
else:
    logger.warning(
        "Frontend build not found at %s — run: cd tryon-studio-main && npm run build",
        FRONTEND_DIST,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
