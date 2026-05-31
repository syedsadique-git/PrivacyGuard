# PrivacyGuard - Quick Reference

## ✅ CURRENT STATUS: Ready for Development!

**Database**: ✅ Connected to Neon PostgreSQL  
**Seeded**: ✅ Demo data loaded  
**Servers**: Ready to start

---

## 🚀 START DEVELOPMENT (EASIEST WAY)

```bash
cd E:\projects\PrivacyGuard\privacyguard
START_DEV.bat
```

This opens two terminal windows:
- **Backend** → http://localhost:3001
- **Frontend** → http://localhost:5173

---

## 🔑 Demo Login Credentials

- **Email**: `demo@privacyguard.com`
- **Password**: `demo1234`

---

## 📁 Project Structure

```
E:\projects\PrivacyGuard\privacyguard\    ← ALWAYS START HERE!
├── client/          # React frontend (Vite) - Port 5173
├── server/          # Express backend - Port 3001
├── extension/       # Browser extension (Manifest V3)
├── START_DEV.bat    # Quick start script
└── CURRENT_STATUS.md # Detailed status & setup info
```

⚠️ **IMPORTANT**: Always `cd` to `E:\projects\PrivacyGuard\privacyguard\` (note the nested folder!)

---

## 🛠️ Common Commands

### Start Servers (Manual)
```bash
# Terminal 1 - Backend
cd E:\projects\PrivacyGuard\privacyguard\server
npm run dev

# Terminal 2 - Frontend
cd E:\projects\PrivacyGuard\privacyguard\client
npm run dev
```

### Database Management
```bash
cd E:\projects\PrivacyGuard\privacyguard\server

npx prisma studio        # Open database GUI in browser
npm run prisma:seed      # Re-seed demo data
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate Prisma Client
```

### Build & Deploy
```bash
cd E:\projects\PrivacyGuard\privacyguard

# Build frontend for production
cd client
npm run build

# Deploy to GitHub Pages
cd ..
deploy-now.bat
```

---

## 🌐 URLs

- **Local Frontend**: http://localhost:5173
- **Local Backend**: http://localhost:3001/api
- **Prisma Studio**: http://localhost:5555 (when running `npx prisma studio`)
- **GitHub Repo**: https://github.com/syedsadique-git/PrivacyGuard
- **GitHub Pages**: https://syedsadique-git.github.io/PrivacyGuard/

---

## 📦 Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router
- **Backend**: Node.js, Express, Prisma 5.11.0, PostgreSQL (Neon)
- **Auth**: JWT + Google OAuth
- **Extension**: Manifest V3 with tracker detection

---

## 🔧 Environment Variables

### Server (`server/.env`)
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-fragrant-king-apxtiafx.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
CLIENT_URL="http://localhost:5173"
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## � API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login

### Trackers
- `GET /api/trackers` - List all trackers for user
- `POST /api/trackers` - Add new tracker
- `PATCH /api/trackers/:id/block` - Block/unblock tracker
- `DELETE /api/trackers/:id` - Delete tracker

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/recent` - Get recent activity

### Breaches
- `GET /api/breaches` - List monitored emails
- `POST /api/breaches/check` - Check email for breaches

---

## 🐛 Troubleshooting

### "Cannot reach database"
✅ **Solution**: Database is already connected to Neon. Check `server/.env` has correct `DATABASE_URL`

### "Port already in use"
```bash
# Kill process on port 3001 (backend)
npx kill-port 3001

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### "Module not found"
```bash
# Reinstall dependencies
cd E:\projects\PrivacyGuard\privacyguard\client
npm install

cd ..\server
npm install
```

### "Prisma Client not generated"
```bash
cd E:\projects\PrivacyGuard\privacyguard\server
npx prisma generate
```

### Wrong Directory Error
```
npm error enoent Could not read package.json
```
✅ **Solution**: You're in the wrong directory! Navigate to:
```bash
cd E:\projects\PrivacyGuard\privacyguard
```

---

## 🧪 Testing the Application

1. **Start servers** using `START_DEV.bat`
2. **Open browser** → http://localhost:5173
3. **Login** with demo@privacyguard.com / demo1234
4. **Explore pages**:
   - Dashboard - View privacy score & stats
   - Trackers - See 12 sample trackers
   - Breaches - Check email breach status
   - Reports - View privacy reports
   - Settings - Configure preferences

---

## 🔌 Browser Extension Setup

1. Open Chrome/Edge
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select folder: `E:\projects\PrivacyGuard\privacyguard\extension`
6. Extension icon appears in toolbar
7. Click icon to see tracker blocking in action

---

## 📚 Documentation Files

- `CURRENT_STATUS.md` - Detailed setup status & next steps
- `SETUP.md` - Complete setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `README.md` - Project overview
- `README_GITHUB.md` - GitHub repository README
- `CONTRIBUTING.md` - Contribution guidelines

---

## 💡 Quick Tips

1. **Always check you're in the right directory** before running commands
2. **Use `START_DEV.bat`** for the easiest startup experience
3. **Prisma Studio** is great for viewing/editing database data visually
4. **Demo account** has 12 sample trackers pre-loaded for testing
5. **Environment files** (`.env`) are in `.gitignore` and won't be committed

---

## 🎨 Design Tokens

### Colors
```css
--cyber-dark: #050C14
--cyber-darker: #0A1628
--cyber-blue: #1A2942
--cyber-teal: #00E5CC
--cyber-red: #FF4D4D
--cyber-green: #00C853
```

### Fonts
- **Headings**: Sora
- **Body**: Sora
- **Monospace**: JetBrains Mono

---

## 📊 Database Models

- **User** — id, email, passwordHash, googleId, plan
- **Tracker** — id, userId, domain, trackerName, category, count, isBlocked, riskLevel
- **Settings** — id, userId, globalBlocking, emailAlerts, weeklyReport
- **MonitoredEmail** — id, userId, email, breached, breachData

---

**Last Updated**: May 30, 2026  
**Status**: ✅ Fully Configured & Ready to Run
