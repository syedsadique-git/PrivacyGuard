@echo off
echo ============================================
echo   PrivacyGuard - Push to GitHub
echo ============================================

cd /d E:\projects\PrivacyGuard\privacyguard

echo.
echo [1/3] Staging all changes...
git add -A

echo.
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg=chore: update project files

echo.
echo [2/3] Committing: %msg%
git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo   Done! GitHub Actions will now build and
echo   deploy to GitHub Pages automatically.
echo   
echo   Site: https://syedsadique-git.github.io/PrivicyGuard/
echo   Actions: https://github.com/syedsadique-git/PrivicyGuard/actions
echo ============================================
pause
