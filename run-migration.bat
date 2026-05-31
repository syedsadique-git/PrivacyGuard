@echo off
cd /d E:\projects\PrivacyGuard\privacyguard\server
echo Running Prisma db push to Supabase...
npx prisma db push
echo.
echo Done! Press any key to exit.
pause
