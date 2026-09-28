from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Virtual Try-On Service")


class TryOnRequest(BaseModel):
    user_photo: str
    product_image: str


@app.get("/")
def home():
    return {
        "service": "AI Virtual Try-On",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/try-on")
def try_on(request: TryOnRequest):
    return {
        "status": "received",
        "user_photo": request.user_photo,
        "product_image": request.product_image,
        "result": "AI model integration pending"
    }