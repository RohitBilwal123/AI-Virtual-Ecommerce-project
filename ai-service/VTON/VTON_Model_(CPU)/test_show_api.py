import gradio as gr

with gr.Blocks() as app:
    gr.ImageEditor(type="pil")

print("Blocks created")

app.launch(
    server_name="127.0.0.1",
    server_port=7861,
    show_api=False,
    prevent_thread_lock=True
)
