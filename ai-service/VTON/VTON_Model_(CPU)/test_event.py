import gradio as gr

def start_tryon(dict, garm_img, garment_des, is_checked, is_checked_crop, denoise_steps, seed):
    return None, None

with gr.Blocks() as app:
    imgs = gr.ImageEditor(sources=["upload", "webcam"], type="pil")
    is_checked = gr.Checkbox(label="Auto-mask", value=True)
    is_checked_crop = gr.Checkbox(label="Auto-crop", value=False)
    garm_img = gr.Image(label="Garment Image", sources=["upload"], type="pil")
    prompt = gr.Textbox(label="Garment Description", value="")
    image_out = gr.Image(label="Try-On Output", height=380, show_share_button=False)
    masked_img = gr.Image(label="Masked Output", height=380, show_share_button=False)
    denoise_steps = gr.Number(label="Denoising Steps", minimum=20, maximum=40, value=30, step=1)
    seed = gr.Number(label="Seed", minimum=-1, maximum=2147483647, step=1, value=42)

    try_button = gr.Button("Try-On")

    try_button.click(
        fn=start_tryon,
        inputs=[imgs, garm_img, prompt, is_checked, is_checked_crop, denoise_steps, seed],
        outputs=[image_out, masked_img],
        api_name="tryon"
    )

print("Event created OK")
print("Testing API schema...")
print(app.get_config_file())
