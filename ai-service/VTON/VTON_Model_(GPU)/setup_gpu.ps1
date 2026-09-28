Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing PyTorch with CUDA 11.8" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

.\venv\Scripts\Activate.ps1

Write-Host "Removing old versions..." -ForegroundColor Yellow
pip uninstall torch torchvision torchaudio -y 2>$null

Write-Host "Installing PyTorch with CUDA 11.8..." -ForegroundColor Yellow
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow
python -c "
import torch
print(f'PyTorch version: {torch.__version__}')
print(f'CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'CUDA version: {torch.version.cuda}')
    print(f'GPU: {torch.cuda.get_device_name(0)}')
    print(f'VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB')
else:
    print('❌ CUDA not available - trying alternative...')
"

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green