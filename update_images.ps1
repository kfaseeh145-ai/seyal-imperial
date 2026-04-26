# Seyal Imperial Image Update Script
# Run this in PowerShell to apply the new bottle designs

$brainPath = "C:\Users\Administrator\.gemini\antigravity\brain\6ab674c6-a094-4d2d-a4e4-c4da40db8bc0"
$projectPath = "c:\Users\Administrator\Desktop\Seyal Imperial"

# New Signature/Hero Bottle
$newSignature = "$brainPath\seyal_signature_bottle_1777062122779.png"
# New Femme Bottle
$newFemme = "$brainPath\seyal_femme_bottle_1777062153759.png"

Write-Host "Updating images..." -ForegroundColor Cyan

if (Test-Path $newSignature) {
    Copy-Item $newSignature "$projectPath\public\images\sheikh.png" -Force
    Copy-Item $newSignature "$projectPath\public\images\hero.png" -Force
    Write-Host "✔ Hero and Signature Sheikh images updated." -ForegroundColor Green
} else {
    Write-Host "✘ Could not find new signature image." -ForegroundColor Red
}

if (Test-Path $newFemme) {
    Copy-Item $newFemme "$projectPath\public\images\femme.png" -Force
    Write-Host "✔ Femme Royale image updated." -ForegroundColor Green
} else {
    Write-Host "✘ Could not find new femme image." -ForegroundColor Red
}

Write-Host "Done! Please refresh your browser." -ForegroundColor Cyan
pause
