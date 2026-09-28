import gradio as gr

with gr.Blocks() as app:
    imgs = gr.ImageEditor(sources=["upload", "webcam"], type="pil")
    gr.Checkbox(label="Auto-mask", value=True)
    gr.Checkbox(label="Auto-crop", value=False)
    garm_img = gr.Image(label="Garment Image", sources=["upload"], type="pil")
    gr.Textbox(label="Garment Description", value="")
    gr.Image(label="Try-On Output", height=380, show_share_button=False)
    gr.Image(label="Masked Output", height=380, show_share_button=False)
    gr.Button("Try-On")
    gr.Number(label="Denoising Steps", minimum=20, maximum=40, value=30, step=1)
    gr.Number(label="Seed", minimum=-1, maximum=2147483647, step=1, value=42)

print("Complete UI created OK")
print("Testing API schema...")
print(app.get_config_file())
