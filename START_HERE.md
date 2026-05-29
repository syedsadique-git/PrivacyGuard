# 🚀 START HERE - Quick Setup Guide

## Step 1: Create Database

```powershell
# Open PostgreSQL command line (psql)
psql -U postgres

# In psql, run:
CREATE DATABASE privacyguard;
\q
```

## Step 2: Setup Backend

```powershell
cd E:\projects\PrivacyGuard\privacyguard\server

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env file with your database password
# Open .env in notepad and update DATABASE_URL

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

## Step 3: Setup Frontend

```powershell
cd E:\projects\PrivacyGuard\privacyguard\client

# Install dependencies
npm install
```

## Step 4: Start Development Servers

### Option A: Automatic (Windows)
```powershell
cd E:\projects\PrivacyGuard\privacyguard
.\start-dev.bat
```

### Option B: Manual (Two separate terminals)

**Terminal 1 - Backend:**
```powershell
cd E:\projects\PrivacyGuard\privacyguard\server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd E:\projects\PrivacyGuard\privacyguard\client
npm run dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Demo Login**:
  - Email: `demo@privacyguard.com`
  - Password: `demo1234`

## 🐛 Troubleshooting

### "Cannot connect to database"
1. Make sure PostgreSQL is running
2. Check your DATABASE_URL in `server/.env`
3. Verify database exists: `psql -U postgres -l`

### "Port already in use"
```powershell
# Kill process on port 3001 (backend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Module not found"
```powershell
# Delete node_modules and reinstall
cd server
rmdir /s /q node_modules
npm install

cd ..\client
rmdir /s /q node_modules
npm install
```

## 📚 Next Steps

1. ✅ Login with demo account
2. ✅ Explore the dashboard
3. ✅ Check out the trackers page
4. ✅ Install the browser extension (see SETUP.md)
5. ✅ Read the full documentation in README.md

## 🆘 Need Help?

- Full setup guide: `SETUP.md`
- Quick reference: `QUICK_REFERENCE.md`
- Troubleshooting: `SETUP.md` (Troubleshooting section)

---

**You're almost there! Just follow these steps and you'll be up and running! 🎉**
