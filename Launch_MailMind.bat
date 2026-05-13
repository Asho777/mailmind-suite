@echo off
:: Self-hiding logic: Re-launches the script hidden if not already hidden
:: IMPORTANT: We set the WorkingDirectory so it doesn't create npm files on the Desktop!
if "%~1" neq "hidden" (
    powershell -Command "Start-Process -FilePath '%~f0' -ArgumentList 'hidden' -WindowStyle Hidden -WorkingDirectory '%~dp0'"
    exit /b
)

:: Ensure we are in the correct folder even when hidden
cd /d "%~dp0"

title MailMind AI Suite - Bootloader
echo ========================================
echo   MailMind AI Suite is starting...
echo ========================================

:: Check for node_modules
if not exist "node_modules\" (
    echo [1/3] Installing dependencies... This may take a minute...
    call npm install --quiet
) else (
    echo [1/3] Dependencies found.
)

:: Check for build
if not exist ".next\" (
    echo [2/3] Preparing first-time build...
    call npm run build
) else (
    echo [2/3] System ready.
)

:: Find the best browser to use for "App Mode" (Chrome or Edge)
set "BROWSER_CMD="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_CMD=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_CMD=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

:: Create a Desktop Shortcut automatically if it doesn't exist
if not exist "%USERPROFILE%\Desktop\MailMind.lnk" (
    echo [4/4] Creating Desktop Shortcut...
    powershell -Command "$ws = New-Object -ComObject WScript.Shell; $d = [Environment]::GetFolderPath('Desktop'); $s = $ws.CreateShortcut(\"$d\MailMind.lnk\"); $s.TargetPath = '%~f0'; $s.IconLocation = '%~dp0public\mailmind_final_v1.ico,0'; $s.Save()"
)

echo ----------------------------------------
echo   APP IS READY! 
echo   Opening in your secure desktop window...
echo ----------------------------------------

:: Launch the browser in "App Mode" (No tabs, no address bar)
if defined BROWSER_CMD (
    start "" "%BROWSER_CMD%" --app=http://localhost:3000
) else (
    start http://localhost:3000
)

:: Run the dev server
npm run dev
