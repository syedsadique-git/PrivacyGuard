@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d E:\projects\PrivacyGuard\privacyguard

echo Unstaging everything from gh-pages...
git reset HEAD -- .
echo.

echo Force-switching to main branch...
git checkout -f -b main origin/main 2>nul || git checkout -f main
echo.

echo Adding all source fixes to main...
git add .github\workflows\ci.yml
git add client\vite.config.js
git add client\index.html
git add client\src\main.jsx
git add client\.env.example
git add client\public\404.html
git add client\public\.nojekyll
git add extension\background.js
git add extension\manifest.json
git add extension\rules.json
git add server\routes\breaches.js
git add server\middleware\auth.js
git add server\controllers\dashboardController.js
git add server\package.json
git add package.json
git add README.md
git add SETUP.md
git add push-to-github.bat
echo.

git status
