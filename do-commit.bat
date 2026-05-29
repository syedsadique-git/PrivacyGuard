@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d E:\projects\PrivacyGuard\privacyguard
git commit -m "deploy-gh-pages"
echo COMMIT_DONE=%ERRORLEVEL%
