@echo off
echo ========================================
echo Starting PrivacyGuard Development Servers
echo ========================================
echo.
echo Starting Backend Server (Port 3001)...
start "PrivacyGuard Backend" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server (Port 5173)...
start "PrivacyGuard Frontend" cmd /k "cd /d %~dp0client && npm run dev"
echo.
echo ========================================
echo Both servers are starting in separate windows
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Demo Login:
echo Email:    demo@privacyguard.com
echo Password: demo1234
echo.
echo Press any key to exit this window...
pause >nul
