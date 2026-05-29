@echo off
echo ========================================
echo   PrivacyGuard Setup Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo Step 2: Setting up Environment File...
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file
    echo.
    echo IMPORTANT: Edit server\.env with your database credentials!
    echo Press any key to open .env in notepad...
    pause > nul
    notepad .env
) else (
    echo ✓ .env file already exists
)
echo.

echo Step 3: Running Database Migrations...
call npm run prisma:generate
call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Database migration failed!
    echo.
    echo Make sure:
    echo 1. PostgreSQL is running
    echo 2. Database 'privacyguard' exists
    echo 3. DATABASE_URL in .env is correct
    echo.
    pause
    exit /b 1
)
echo ✓ Database migrations completed
echo.

echo Step 4: Seeding Demo Data...
call npm run prisma:seed
echo ✓ Demo data seeded
echo.

cd ..

echo Step 5: Installing Frontend Dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

cd ..

echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Start the servers: start-dev.bat
echo 2. Open http://localhost:5173
echo 3. Login with demo@privacyguard.com / demo1234
echo.
echo Press any key to exit...
pause > nul
