import sys
import os

if sys.platform == 'win32':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')

sys.path.append('./')
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from PIL import Image
import gradio as gr
import torch

device = 'cpu'
print(f"✨ [AuraFit CPU Engine] Using device: {device}")

from src.tryon_pipeline import StableDiffusionXLInpaintPipeline as TryonPipeline
from src.unet_hacked_garmnet import UNet2DConditionModel as UNet2DConditionModel_ref
from src.unet_hacked_tryon import UNet2DConditionModel
from transformers import (
    CLIPImageProcessor,
    CLIPVisionModelWithProjection,
    CLIPTextModel,
    CLIPTextModelWithProjection,
)
from diffusers import DDPMScheduler, AutoencoderKL
from typing import List
from transformers import AutoTokenizer
import numpy as np
from utils_mask import get_mask_location
from torchvision import transforms
import apply_net
from preprocess.humanparsing.run_parsing import Parsing
from preprocess.openpose.run_openpose import OpenPose
from detectron2.data.detection_utils import convert_PIL_to_numpy, _apply_exif_orientation
from torchvision.transforms.functional import to_pil_image

custom_css = """
.gradio-container {
    background: linear-gradient(135deg, #0d1b3e, #1a0a2e) !important;
    color: #e0e0e0 !important;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif !important;
}
#main-container {
    max-width: 1250px;
    margin: 0 auto 25px auto;
    padding: 28px;
    background: rgba(26, 10, 46, 0.65);
    border: 1px solid rgba(212, 168, 67, 0.3);
    border-radius: 20px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    text-align: center;
}
#title {
    font-size: 2.6rem;
    font-weight: 700;
    text-align: center;
    color: #d4a843;
    text-shadow: 0 2px 20px rgba(212, 168, 67, 0.35);
    margin-bottom: 8px;
    letter-spacing: 0.5px;
}
#subtitle {
    font-size: 1.2rem;
    text-align: center;
    color: #ffffffcc;
    margin-bottom: 0px;
}
.section-card {
    background: rgba(13, 27, 62, 0.45) !important;
    border: 1px solid rgba(212, 168, 67, 0.2) !important;
    border-radius: 14px !important;
    padding: 16px !important;
}
.section-title {
    font-size: 1.15rem !important;
    font-weight: 600 !important;
    color: #d4a843 !important;
    margin-bottom: 10px !important;
}
#try-on-btn {
    background: linear-gradient(135deg, #d4a843, #b8922f) !important;
    color: #0d1b3e !important;
    font-weight: 700 !important;
    border: none !important;
    padding: 14px 40px !important;
    border-radius: 30px !important;
    font-size: 18px !important;
    cursor: pointer !important;
    box-shadow: 0 4px 20px rgba(212, 168, 67, 0.35) !important;
    margin: 15px auto !important;
    display: block !important;
    transition: all 0.3s ease !important;
}
#try-on-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 26px rgba(212, 168, 67, 0.5) !important;
}
.footer {
    text-align: center;
    color: #ffffff66;
    padding: 24px 10px 10px 10px;
    font-size: 0.9rem;
}
"""

def pil_to_binary_mask(pil_image, threshold=0):
    np_image = np.array(pil_image)
    grayscale_image = Image.fromarray(np_image).convert("L")
    binary_mask = np.array(grayscale_image) > threshold
    mask = np.zeros(binary_mask.shape, dtype=np.uint8)
    for i in range(binary_mask.shape[0]):
        for j in range(binary_mask.shape[1]):
            if binary_mask[i, j] == True:
                mask[i, j] = 1
    mask = (mask * 255).astype(np.uint8)
    output_mask = Image.fromarray(mask)
    return output_mask

base_path = '../Model' if os.path.exists('../Model') else ('./Model' if os.path.exists('./Model') else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Model')))
example_path = os.path.join(os.path.dirname(__file__), 'example') if os.path.exists(os.path.join(os.path.dirname(__file__), 'example')) else os.path.join(os.path.dirname(__file__), '..', 'gradio_demo', 'example')

configs_path = os.path.join(os.path.dirname(__file__), '..', 'configs', 'densepose_rcnn_R_50_FPN_s1x.yaml') if not os.path.exists('./configs/densepose_rcnn_R_50_FPN_s1x.yaml') else './configs/densepose_rcnn_R_50_FPN_s1x.yaml'
ckpt_path = os.path.join(os.path.dirname(__file__), '..', 'ckpt', 'densepose', 'model_final_162be9.pkl') if not os.path.exists('./ckpt/densepose/model_final_162be9.pkl') else './ckpt/densepose/model_final_162be9.pkl'

print(f"📥 [AuraFit] Loading AI models from: {base_path}...")
unet = UNet2DConditionModel.from_pretrained(
    base_path,
    subfolder="unet",
)
unet.requires_grad_(False)

tokenizer_one = AutoTokenizer.from_pretrained(
    base_path,
    subfolder="tokenizer",
    revision=None,
    use_fast=False,
)
tokenizer_two = AutoTokenizer.from_pretrained(
    base_path,
    subfolder="tokenizer_2",
    revision=None,
    use_fast=False,
)
noise_scheduler = DDPMScheduler.from_pretrained(base_path, subfolder="scheduler")

text_encoder_one = CLIPTextModel.from_pretrained(
    base_path,
    subfolder="text_encoder",
)
text_encoder_two = CLIPTextModelWithProjection.from_pretrained(
    base_path,
    subfolder="text_encoder_2",
)
image_encoder = CLIPVisionModelWithProjection.from_pretrained(
    base_path,
    subfolder="image_encoder",
)
vae = AutoencoderKL.from_pretrained(
    base_path,
    subfolder="vae",
)

UNet_Encoder = UNet2DConditionModel_ref.from_pretrained(
    base_path,
    subfolder="unet_encoder",
)

parsing_model = Parsing(0)
openpose_model = OpenPose(0)
openpose_model.preprocessor.body_estimation.model.to(device)

UNet_Encoder.requires_grad_(False)
image_encoder.requires_grad_(False)
vae.requires_grad_(False)
unet.requires_grad_(False)
text_encoder_one.requires_grad_(False)
text_encoder_two.requires_grad_(False)

tensor_transfrom = transforms.Compose(
    [
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5]),
    ]
)

pipe = TryonPipeline.from_pretrained(
    base_path,
    unet=unet,
    vae=vae,
    feature_extractor=CLIPImageProcessor(),
    text_encoder=text_encoder_one,
    text_encoder_2=text_encoder_two,
    tokenizer=tokenizer_one,
    tokenizer_2=tokenizer_two,
    scheduler=noise_scheduler,
    image_encoder=image_encoder,
)
pipe.unet_encoder = UNet_Encoder

print("📥 [AuraFit] Optimizing neural pipelines for CPU...")
pipe.to(device)
pipe.unet_encoder.to(device)
print("✅ [AuraFit] AI Engine loaded and ready on CPU")

def start_tryon(dict, garm_img, garment_des, is_checked, is_checked_crop, denoise_steps, seed):
    """
    Main virtual try-on inference function
    """
    pipe.to(device)
    pipe.unet_encoder.to(device)
    openpose_model.preprocessor.body_estimation.model.to(device)
    
    print("🔄 [AuraFit] Processing virtual try-on request...")
    
    try:
        if garm_img is None:
            print("❌ [AuraFit] No garment image provided")
            return None, None
        
        garm_img = garm_img.convert("RGB").resize((768, 1024))
        
        if dict is None or "background" not in dict:
            print("❌ [AuraFit] No human image provided")
            return None, None
            
        human_img_orig = dict["background"].convert("RGB")
        
        if is_checked_crop:
            width, height = human_img_orig.size
            target_width = int(min(width, height * (3 / 4)))
            target_height = int(min(height, width * (4 / 3)))
            left = (width - target_width) / 2
            top = (height - target_height) / 2
            right = (width + target_width) / 2
            bottom = (height + target_height) / 2
            cropped_img = human_img_orig.crop((left, top, right, bottom))
            crop_size = cropped_img.size
            human_img = cropped_img.resize((768, 1024))
        else:
            human_img = human_img_orig.resize((768, 1024))
        
        if is_checked:
            keypoints = openpose_model(human_img.resize((384, 512)))
            model_parse, _ = parsing_model(human_img.resize((384, 512)))
            mask, mask_gray = get_mask_location('hd', "upper_body", model_parse, keypoints)
            mask = mask.resize((768, 1024))
        else:
            if dict.get('layers') is None or len(dict['layers']) == 0:
                print("❌ [AuraFit] No mask layers provided")
                return None, None
            mask = pil_to_binary_mask(dict['layers'][0].convert("RGB").resize((768, 1024)))
        
        mask_gray = (1 - transforms.ToTensor()(mask)) * tensor_transfrom(human_img)
        mask_gray = to_pil_image((mask_gray + 1.0) / 2.0)
        
        human_img_arg = _apply_exif_orientation(human_img.resize((384, 512)))
        human_img_arg = convert_PIL_to_numpy(human_img_arg, format="BGR")
        
        args = apply_net.create_argument_parser().parse_args(
            ('show', configs_path, ckpt_path, 'dp_segm', '-v', '--opts', 'MODEL.DEVICE', 'cpu')
        )
        pose_img = args.func(args, human_img_arg)
        pose_img = pose_img[:, :, ::-1]
        pose_img = Image.fromarray(pose_img).resize((768, 1024))
        
        print("🔄 [AuraFit] Generating photorealistic garment draping...")
        with torch.no_grad():
            prompt = "model is wearing " + garment_des
            negative_prompt = "monochrome, lowres, bad anatomy, worst quality, low quality"
            
            with torch.inference_mode():
                (
                    prompt_embeds,
                    negative_prompt_embeds,
                    pooled_prompt_embeds,
                    negative_pooled_prompt_embeds,
                ) = pipe.encode_prompt(
                    prompt,
                    num_images_per_prompt=1,
                    do_classifier_free_guidance=True,
                    negative_prompt=negative_prompt,
                )
                
                prompt = "a photo of " + garment_des
                negative_prompt = "monochrome, lowres, bad anatomy, worst quality, low quality"
                if not isinstance(prompt, List):
                    prompt = [prompt] * 1
                if not isinstance(negative_prompt, List):
                    negative_prompt = [negative_prompt] * 1
                
                with torch.inference_mode():
                    (
                        prompt_embeds_c,
                        _,
                        _,
                        _,
                    ) = pipe.encode_prompt(
                        prompt,
                        num_images_per_prompt=1,
                        do_classifier_free_guidance=False,
                        negative_prompt=negative_prompt,
                    )
                
                pose_img_tensor = tensor_transfrom(pose_img).unsqueeze(0).to(device)
                garm_tensor = tensor_transfrom(garm_img).unsqueeze(0).to(device)
                generator = torch.Generator(device).manual_seed(int(seed)) if seed is not None and seed >= 0 else None
                
                images = pipe(
                    prompt_embeds=prompt_embeds.to(device),
                    negative_prompt_embeds=negative_prompt_embeds.to(device),
                    pooled_prompt_embeds=pooled_prompt_embeds.to(device),
                    negative_pooled_prompt_embeds=negative_pooled_prompt_embeds.to(device),
                    num_inference_steps=int(denoise_steps),
                    generator=generator,
                    strength=1.0,
                    pose_img=pose_img_tensor.to(device),
                    text_embeds_cloth=prompt_embeds_c.to(device),
                    cloth=garm_tensor.to(device),
                    mask_image=mask,
                    image=human_img,
                    height=1024,
                    width=768,
                    ip_adapter_image=garm_img.resize((768, 1024)),
                    guidance_scale=2.0,
                )[0]
        
        print("✅ [AuraFit] Try-on completed successfully!")
        
        if is_checked_crop:
            out_img = images[0].resize(crop_size)
            human_img_orig.paste(out_img, (int(left), int(top)))
            return human_img_orig, mask_gray
        else:
            return images[0], mask_gray
            
    except Exception as e:
        print(f"❌ [AuraFit] Error in try-on execution: {e}")
        import traceback
        traceback.print_exc()
        return None, None

cloth_dir = os.path.join(example_path, "cloth")
garm_list_path = [os.path.join(cloth_dir, garm) for garm in os.listdir(cloth_dir)] if os.path.exists(cloth_dir) else []

human_dir = os.path.join(example_path, "human")
human_list_path = [os.path.join(human_dir, human) for human in os.listdir(human_dir)] if os.path.exists(human_dir) else []

human_ex_list = []
for ex_human in human_list_path:
    ex_dict = {
        'background': ex_human,
        'layers': None,
        'composite': None
    }
    human_ex_list.append(ex_dict)

with gr.Blocks(css=custom_css, title="✨ AuraFit - AI Virtual Try-On") as image_blocks:
    gr.HTML("""
    <div id="main-container">
        <h1 id="title">✨ AuraFit - AI Virtual Try-On</h1>
        <p id="subtitle">Experience your style before you buy</p>
    </div>
    """)
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### 📸 1. Model / Person")
            imgs = gr.ImageEditor(
                sources=['upload', 'webcam'],
                type="pil",
                label='Human photo (Use pen to mask or toggle Auto-mask)',
                interactive=True,
                height=350
            )
            with gr.Row():
                is_checked = gr.Checkbox(label="Auto-mask", info="Intelligent garment area detection", value=True)
                is_checked_crop = gr.Checkbox(label="Auto-crop", info="Auto-crop & ratio alignment", value=False)
            
            if human_ex_list:
                gr.Markdown("### 👥 Sample Models")
                example_human = gr.Examples(
                    inputs=imgs,
                    examples_per_page=8,
                    examples=human_ex_list
                )
        
        with gr.Column(scale=1):
            gr.Markdown("### 👔 2. Garment Selection")
            garm_img = gr.Image(
                label="Garment Image",
                sources=['upload'],
                type="pil",
                height=300
            )
            prompt = gr.Textbox(
                label="Garment Description",
                placeholder="e.g. Elegant silk blouse, short sleeve cotton shirt",
                value=""
            )
            
            if garm_list_path:
                gr.Markdown("### 👗 Sample Garments")
                example_garm = gr.Examples(
                    inputs=garm_img,
                    examples_per_page=8,
                    examples=garm_list_path
                )
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### 💎 AuraFit Result")
            image_out = gr.Image(label="Try-On Output", height=380, show_share_button=False)
        with gr.Column(scale=1):
            gr.Markdown("### 🎯 Garment Mask Preview")
            masked_img = gr.Image(label="Masked Output", height=380, show_share_button=False)
    
    with gr.Row():
        try_button = gr.Button("🔥 Experience AuraFit Try-On", elem_id="try-on-btn")
        
    with gr.Accordion(label="⚙️ Advanced Settings", open=False):
        with gr.Row():
            denoise_steps = gr.Number(label="Denoising Steps", minimum=20, maximum=40, value=30, step=1)
            seed = gr.Number(label="Seed (-1 for random)", minimum=-1, maximum=2147483647, step=1, value=42)
    
    gr.HTML("""
    <div class="footer">
        <p>© 2026 AuraFit. All rights reserved.</p>
    </div>
    """)

    try_button.click(
        fn=start_tryon,
        inputs=[imgs, garm_img, prompt, is_checked, is_checked_crop, denoise_steps, seed],
        outputs=[image_out, masked_img],
        api_name='tryon'
    )

if __name__ == "__main__":
    image_blocks.launch(server_name="127.0.0.1", server_port=7860)
