# PrivacyGuard Quick Reference

## 🚀 Quick Start Commands

### First Time Setup
\`\`\`bash
# 1. Create database
createdb privacyguard

# 2. Setup backend
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:migrate
npm run prisma:seed

# 3. Setup frontend
cd ../client
npm install

# 4. Start both servers (Windows)
cd ..
start-dev.bat

# Or manually:
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
\`\`\`

### Daily Development
\`\`\`bash
# Start servers (Windows)
start-dev.bat

# Or manually in separate terminals:
cd server && npm run dev
cd client && npm run dev
\`\`\`

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| API Health | http://localhost:3001/health |
| Extension | Load from `extension/` folder |

## 🔑 Demo Credentials

**Email**: demo@privacyguard.com  
**Password**: demo1234

## 📁 Key Files

### Configuration
- `server/.env` — Backend environment variables
- `client/.env` — Frontend environment variables (optional)
- `server/prisma/schema.prisma` — Database schema

### Entry Points
- `server/index.js` — Backend server
- `client/src/main.jsx` — Frontend entry
- `extension/manifest.json` — Extension config

### Important Components
- `client/src/App.jsx` — Main app router
- `client/src/features/auth/AuthContext.jsx` — Auth state
- `client/src/lib/api.js` — API client
- `server/middleware/auth.js` — Auth middleware

## 🛠️ Common Commands

### Backend
\`\`\`bash
cd server

npm run dev              # Start dev server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed demo data
npm start               # Production start
\`\`\`

### Frontend
\`\`\`bash
cd client

npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
\`\`\`

### Database
\`\`\`bash
# Connect to database
psql -U postgres -d privacyguard

# Reset database
cd server
npm run prisma:migrate reset

# View database in Prisma Studio
npx prisma studio
\`\`\`

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Trackers
- `GET /api/trackers` — List trackers
- `POST /api/trackers/scan` — Record tracker
- `PATCH /api/trackers/:id/block` — Toggle block
- `POST /api/trackers/bulk-block` — Bulk action

### Breaches
- `GET /api/breaches?email=...` — Check breach
- `POST /api/breaches/monitor` — Monitor email

### Dashboard
- `GET /api/dashboard/summary` — Dashboard data

### Settings
- `GET /api/settings` — Get settings
- `PATCH /api/settings` — Update settings

## 🎨 Design Tokens

### Colors
\`\`\`css
--cyber-dark: #050C14
--cyber-darker: #0A1628
--cyber-blue: #1A2942
--cyber-teal: #00E5CC
--cyber-red: #FF4D4D
--cyber-green: #00C853
\`\`\`

### Fonts
- **Headings**: Sora
- **Body**: Sora
- **Monospace**: JetBrains Mono

### Tailwind Classes
\`\`\`css
.card              /* Basic card */
.card-hover        /* Card with hover effect */
.btn-primary       /* Primary button */
.btn-secondary     /* Secondary button */
.input-field       /* Form input */
.glow-text         /* Glowing text effect */
\`\`\`

## 🐛 Troubleshooting

### Port Already in Use
\`\`\`bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
\`\`\`

### Database Connection Error
\`\`\`bash
# Check PostgreSQL is running
# Windows: services.msc
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Test connection
psql -U postgres -d privacyguard
\`\`\`

### Prisma Errors
\`\`\`bash
# Regenerate client
npm run prisma:generate

# Reset database
npm run prisma:migrate reset
\`\`\`

### Extension Not Loading
- Chrome: Enable Developer mode
- Firefox: Reload temporary add-on
- Check console for errors

## 📦 Project Structure

\`\`\`
privacyguard/
├── client/          # React frontend
│   └── src/
│       ├── features/    # Page modules
│       ├── components/  # Shared components
│       └── lib/        # Utilities
├── server/          # Node.js backend
│   ├── controllers/ # Business logic
│   ├── routes/     # API routes
│   ├── middleware/ # Auth, validation
│   └── prisma/     # Database
└── extension/       # Browser extension
\`\`\`

## 🔐 Environment Variables

### Required (server/.env)
\`\`\`env
DATABASE_URL="postgresql://..."
JWT_SECRET="random-secret-key"
PORT=3001
CLIENT_URL="http://localhost:5173"
\`\`\`

### Optional
\`\`\`env
HIBP_API_KEY="..."  # For real breach data
NODE_ENV="development"
\`\`\`

## 📊 Database Models

- **User** — id, email, passwordHash, plan
- **Tracker** — id, userId, domain, trackerName, category, count, isBlocked
- **Settings** — id, userId, globalBlocking, emailAlerts
- **MonitoredEmail** — id, userId, email, breached, breachData

## 🎯 Feature Checklist

- [x] Landing page
- [x] Authentication (signup/login)
- [x] Onboarding flow
- [x] Dashboard with privacy score
- [x] Tracker management
- [x] Breach checking
- [x] Privacy reports (Premium)
- [x] Settings page
- [x] Browser extension
- [x] Database with seed data

## 📚 Documentation

- `README.md` — Main documentation
- `SETUP.md` — Detailed setup guide
- `DEPLOYMENT.md` — Production deployment
- `CONTRIBUTING.md` — Contribution guidelines
- `PROJECT_SUMMARY.md` — Complete project overview

## 🆘 Getting Help

1. Check documentation files
2. Search GitHub Issues
3. Check browser console for errors
4. Check server logs
5. Open new GitHub Issue

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma Docs](https://prisma.io/docs)
- [Express.js](https://expressjs.com)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions)

---

**Keep this file handy for quick reference! 📌**
