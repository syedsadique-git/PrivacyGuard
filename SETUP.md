# PrivacyGuard — Setup Guide

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone & Install

```bash
git clone https://github.com/syedsadique-git/PrivicyGuard.git
cd PrivicyGuard/privacyguard
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
# Runs at http://localhost:3001
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
# Runs at http://localhost:5173
```

### 4. Browser Extension

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

---

## GitHub Pages Deployment (Free Hosting)

Your frontend is automatically deployed to GitHub Pages on every push to `main`.

### One-Time Setup (Do This Once)

1. Go to your repo: https://github.com/syedsadique-git/PrivicyGuard
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set Branch to `gh-pages`, folder to `/ (root)`
5. Click **Save**

### How It Works

Every time you push to `main`:
- GitHub Actions builds the React frontend
- Deploys it to the `gh-pages` branch automatically
- Site is live at: **https://syedsadique-git.github.io/PrivicyGuard/**

### First Deploy

After setting up Pages, trigger a deploy manually:
1. Go to **Actions** tab in your repo
2. Click **CI** workflow
3. Click **Run workflow** → **Run workflow**

Or just push any change to `main`.

---

## Backend Deployment (Production)

For a live backend, use one of these free/cheap options:

### Option A — Railway (Recommended, Free tier)
1. Go to https://railway.app
2. New Project → Deploy from GitHub repo
3. Select the `privacyguard/server` folder
4. Add environment variables from `server/.env.example`
5. Add a PostgreSQL database plugin
6. Railway gives you a public URL like `https://your-app.railway.app`

### Option B — Render (Free tier)
1. Go to https://render.com
2. New → Web Service → Connect GitHub
3. Root directory: `privacyguard/server`
4. Build command: `npm install && npx prisma generate`
5. Start command: `npm start`

### After Deploying Backend

Update your frontend to point to the live backend:

1. In `client/.env` (create this file):
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

2. Rebuild and push:
```bash
cd client
npm run build
git add -A && git commit -m "chore: update API URL" && git push
```

---

## Troubleshooting

**Site shows raw text on GitHub Pages**
- Make sure the CI workflow ran successfully (check Actions tab)
- Make sure GitHub Pages source is set to `gh-pages` branch, not `main`

**Blank page on refresh (route like /dashboard)**
- The `public/404.html` handles this — make sure it's present in the build
- Check that `vite.config.js` has the correct `base: '/PrivicyGuard/'`

**API calls fail on GitHub Pages**
- Set `VITE_API_URL` in your environment or Vite config for production
- The frontend on GitHub Pages is static — it needs a separate backend deployed

**Extension not connecting**
- Make sure backend is running at `http://localhost:3001`
- Check that your JWT token is stored in `chrome.storage.local`
