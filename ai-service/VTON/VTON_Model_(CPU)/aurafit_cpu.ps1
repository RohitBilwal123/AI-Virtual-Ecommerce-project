# AuraFit CPU Launcher
Write-Host "✨ AuraFit - AI Virtual Try-On" -ForegroundColor Cyan
Write-Host "Experience your style before you buy" -ForegroundColor Yellow
Write-Host ""

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Set environment variables
$env:CUDA_VISIBLE_DEVICES = ""
$env:PYTHONPATH = $PWD.Path
$env:HF_HOME = "D:\huggingface_cache"

# Run the app
cd gradio_demo
python app.py
