@echo off
setlocal

:: Add Node and Git to PATH for this session
set PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%

echo ================================================
echo  PrivacyGuard - Build and Deploy to GitHub Pages
echo ================================================
echo.

:: Step 1: Check versions
echo [STEP 1] Checking tools...
node --version
npm --version
git --version
echo.

:: Step 2: Install client dependencies
echo [STEP 2] Installing client dependencies...
cd /d E:\projects\PrivacyGuard\privacyguard\client
call npm install
if errorlevel 1 (echo ERROR: npm install failed & pause & exit /b 1)
echo.

:: Step 3: Build the React app
echo [STEP 3] Building React app...
set NODE_ENV=production
call npm run build
if errorlevel 1 (echo ERROR: Build failed & pause & exit /b 1)
echo.
echo Build complete! dist/ folder created.
echo.

:: Step 4: Go to repo root
cd /d E:\projects\PrivacyGuard\privacyguard

:: Step 5: Configure git
echo [STEP 4] Configuring git...
git config user.email "syedsadique@privacyguard.com"
git config user.name "syedsadique-git"
echo.

:: Step 6: Stash any current changes to main
echo [STEP 5] Saving current state of main branch...
git add -A
git stash
echo.

:: Step 7: Check if gh-pages branch exists
echo [STEP 6] Setting up gh-pages branch...
git fetch origin 2>nul
git checkout gh-pages 2>nul
if errorlevel 1 (
  echo Creating new gh-pages branch...
  git checkout --orphan gh-pages
  git reset --hard
)
echo.

:: Step 8: Clear old files from gh-pages
echo [STEP 7] Clearing old gh-pages content...
git rm -rf . >nul 2>&1
echo.

:: Step 9: Copy built files to root of gh-pages branch
echo [STEP 8] Copying build files...
xcopy /E /I /Y "E:\projects\PrivacyGuard\privacyguard\client\dist\*" "E:\projects\PrivacyGuard\privacyguard\"
echo.

:: Step 10: Add .nojekyll
echo. > .nojekyll
echo Created .nojekyll
echo.

:: Step 11: Commit and push gh-pages
echo [STEP 9] Committing to gh-pages...
git add -A
git commit -m "Deploy: React build to GitHub Pages"
echo.

echo [STEP 10] Pushing gh-pages to GitHub...
git push origin gh-pages --force
if errorlevel 1 (echo ERROR: Push failed & pause & exit /b 1)
echo.

:: Step 12: Switch back to main
echo [STEP 11] Switching back to main branch...
git checkout main
git stash pop 2>nul
echo.

echo ================================================
echo  SUCCESS! Deployed to GitHub Pages!
echo.
echo  Your site will be live in ~60 seconds at:
echo  https://syedsadique-git.github.io/PrivacyGuard/
echo.
echo  Make sure GitHub Pages is set to:
echo  Settings > Pages > Branch: gh-pages > /(root)
echo ================================================
pause
