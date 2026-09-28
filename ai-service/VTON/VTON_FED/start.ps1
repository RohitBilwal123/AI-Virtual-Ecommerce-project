
$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Backend = Join-Path $Root "VTON-LOCAL"
$Frontend = Join-Path $Root "tryon-studio-main"
$Python = Join-Path $Backend "venv_new\Scripts\python.exe"

Write-Host ""
Write-Host "  ██████  AuraFit Virtual Try-On" -ForegroundColor Cyan
Write-Host "  Checking setup..." -ForegroundColor Gray

$Dist = Join-Path $Frontend "dist\index.html"
if (-not (Test-Path $Dist)) {
    Write-Host "  Building frontend (first time)..." -ForegroundColor Yellow
    Push-Location $Frontend
    npm install --silent
    npm run build
    Pop-Location
} else {
    Write-Host "  Frontend build found." -ForegroundColor Green
}

$EnvFile = Join-Path $Backend ".env"
if (-not (Test-Path $EnvFile)) {
    Write-Host ""
    Write-Host "  WARNING: VTON-LOCAL\.env not found!" -ForegroundColor Red
    Write-Host "  Create it with: MODEL_AUTH_TOKEN=your_token_here" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "  Starting AuraFit on http://localhost:8000" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

Push-Location $Backend
& $Python -m uvicorn main:app --host 0.0.0.0 --port 8000
Pop-Location
