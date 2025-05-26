@echo off
setlocal

:: Check if pwsh (PowerShell Core) is available
where pwsh >nul 2>nul
if %errorlevel%==0 (
    echo Running PowerShell script with pwsh...
    pwsh -NoProfile -ExecutionPolicy Bypass -Command ^
    "& { $files = Get-ChildItem -Filter '*.user.js'; foreach ($file in $files) { $content = Get-Content $file.FullName; $metadata = $content | Where-Object { $_ -match '^// ' }; $metaFilename = $file.FullName -replace '\.user\.js$', '.meta.js'; if ($metadata.Count -gt 0) { $metadata | Set-Content -Encoding UTF8 $metaFilename; Write-Output '✅ Extracted metadata to: ' + $metaFilename; } else { Write-Output '⚠️ No metadata found in ' + $file.Name; } } }"
    exit /b
)

:: Fallback to legacy Windows PowerShell if pwsh isn't available
echo pwsh not found, using Windows PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "& { $files = Get-ChildItem -Filter '*.user.js'; foreach ($file in $files) { $content = Get-Content $file.FullName; $metadata = $content | Where-Object { $_ -match '^// ' }; $metaFilename = $file.FullName -replace '\.user\.js$', '.meta.js'; if ($metadata.Count -gt 0) { $metadata | Set-Content -Encoding UTF8 $metaFilename; Write-Output '✅ Extracted metadata to: ' + $metaFilename; } else { Write-Output '⚠️ No metadata found in ' + $file.Name; } } }"

endlocal
pause
