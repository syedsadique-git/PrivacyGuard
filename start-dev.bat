@echo off
echo ========================================
echo   PrivacyGuard Development Startup
echo ========================================
echo.

echo Starting Backend Server...
start "PrivacyGuard Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "PrivacyGuard Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause > nul

taskkill /FI "WindowTitle eq PrivacyGuard Backend*" /T /F
taskkill /FI "WindowTitle eq PrivacyGuard Frontend*" /T /F
