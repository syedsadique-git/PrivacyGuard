@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d E:\projects\PrivacyGuard\privacyguard
git push origin gh-pages --force
echo PUSH_DONE=%ERRORLEVEL%
