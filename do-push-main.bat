@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d E:\projects\PrivacyGuard\privacyguard

echo Adding ALL files to main...
git add -A

echo Committing all fixes...
git commit -m "fix: GitHub Pages deploy, vite base path, SPA routing, CI workflow, bug fixes"

echo Pushing main to GitHub...
git push origin main

echo DONE=%ERRORLEVEL%
