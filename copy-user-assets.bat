@echo off
echo ==============================================
echo Setting up Mahesh Gite Resume and Photo...
echo ==============================================

if not exist "public\assets" mkdir "public\assets"
if not exist "src\assets" mkdir "src\assets"

REM 1. Copy exact original PDF resume
if exist "C:\Users\Baap\.gemini\antigravity-ide\brain\d3658f7e-baa3-4496-a8df-814d967e9499\.user_uploaded\media_1788593016045.pdf" (
    copy /Y "C:\Users\Baap\.gemini\antigravity-ide\brain\d3658f7e-baa3-4496-a8df-814d967e9499\.user_uploaded\media_1788593016045.pdf" "public\assets\Mahesh_Gite_Resume.pdf"
    copy /Y "C:\Users\Baap\.gemini\antigravity-ide\brain\d3658f7e-baa3-4496-a8df-814d967e9499\.user_uploaded\media_1788593016045.pdf" "src\assets\Mahesh_Gite_Resume.pdf"
    copy /Y "C:\Users\Baap\.gemini\antigravity-ide\brain\d3658f7e-baa3-4496-a8df-814d967e9499\.user_uploaded\media_1788593016045.pdf" "public\assets\media_1788593016045.pdf"
    echo [OK] Copied original Resume PDF to assets!
)
if exist "src\assets\Mahesh Gite Resume.pdf (1).pdf" (
    copy /Y "src\assets\Mahesh Gite Resume.pdf (1).pdf" "public\assets\Mahesh Gite Resume.pdf (1).pdf"
    copy /Y "src\assets\Mahesh Gite Resume.pdf (1).pdf" "public\assets\Mahesh_Gite_Resume.pdf"
    echo [OK] Copied Canva Resume to public/assets!
)

REM 2. Copy exact Mahesh_img.png and Mahesh_gite_logo.png
if exist "src\assets\Mahesh_img.png" (
    copy /Y "src\assets\Mahesh_img.png" "public\assets\Mahesh_img.png"
    echo [OK] Copied Mahesh_img.png to public/assets!
)
if exist "src\assets\Mahesh_gite_logo.png" (
    copy /Y "src\assets\Mahesh_gite_logo.png" "public\assets\Mahesh_gite_logo.png"
    echo [OK] Copied Mahesh_gite_logo.png to public/assets!
)
if exist "src\assets\favicon.svg" (
    copy /Y "src\assets\favicon.svg" "public\assets\favicon.svg"
    copy /Y "src\assets\favicon.svg" "public\favicon.svg"
    echo [OK] Copied circular favicon.svg!
)
echo ==============================================
echo All assets successfully ready!
echo Please restart your terminal (npm start) or refresh browser.
echo ==============================================
pause
