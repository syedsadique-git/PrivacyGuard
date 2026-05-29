# 🛡️ PrivacyGuard

<div align="center">

![PrivacyGuard Logo](https://via.placeholder.com/200x200/050C14/00E5CC?text=PrivacyGuard)

**Your Privacy Command Center**

A centralized privacy dashboard that tracks, analyzes, and blocks online trackers across your entire browsing experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-61dafb)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://privacyguard-demo.vercel.app) • [Documentation](https://github.com/yourusername/privacyguard/wiki) • [Report Bug](https://github.com/yourusername/privacyguard/issues) • [Request Feature](https://github.com/yourusername/privacyguard/issues)

</div>

---

## 📸 Screenshots

<div align="center">

### Landing Page
![Landing Page](https://via.placeholder.com/800x450/050C14/00E5CC?text=Landing+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/050C14/00E5CC?text=Dashboard)

### Tracker Management
![Trackers](https://via.placeholder.com/800x450/050C14/00E5CC?text=Tracker+Management)

</div>

---

## 🎯 Why PrivacyGuard?

Most tracker blockers (Privacy Badger, Ghostery) are browser extensions without centralized dashboards. **PrivacyGuard** provides a **web-based command center** for your entire digital privacy posture.

### The Problem
- 🔴 Trackers follow you across the web
- 🔴 No visibility into what data is being collected
- 🔴 Fragmented privacy tools
- 🔴 No historical tracking data

### The Solution
✅ **One dashboard** to see all trackers  
✅ **Real-time privacy score** (0-100)  
✅ **Breach monitoring** with instant alerts  
✅ **One-click blocking** across all sites  
✅ **Historical analytics** and reports  

---

## ✨ Features

### 🔍 **Tracker Detection**
- Real-time detection of Analytics, Advertising, Social, and Fingerprinting trackers
- Categorization and risk scoring
- Historical tracking data with charts

### 📊 **Privacy Score**
- Live privacy score (0-100) based on exposure
- Color-coded risk levels (Red/Yellow/Green)
- Score history and trends

### 🚨 **Breach Monitoring**
- Check emails against HaveIBeenPwned database
- Instant breach notifications
- Detailed breach information with recommended actions

### 🛡️ **Tracker Blocking**
- One-click global blocking
- Per-tracker blocking controls
- Bulk actions for multiple trackers

### 📈 **Privacy Reports** (Premium)
- Monthly privacy reports with charts
- Tracker trends over time
- Category breakdown analysis
- PDF export

### 🔌 **Browser Extension**
- Lightweight Manifest V3 extension
- Real-time tracker detection
- Syncs with dashboard automatically
- Works on Chrome and Firefox

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Recharts
- React Router
- Axios

</td>
<td>

**Backend**
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT + bcrypt
- Zod validation

</td>
<td>

**Extension**
- Manifest V3
- Vanilla JavaScript
- declarativeNetRequest API
- Chrome & Firefox compatible

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/privacyguard.git
cd privacyguard

# 2. Create PostgreSQL database
createdb privacyguard

# 3. Setup Backend
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:migrate
npm run prisma:seed

# 4. Setup Frontend
cd ../client
npm install

# 5. Start Development Servers
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
cd client && npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Demo Account**: 
  - Email: `demo@privacyguard.com`
  - Password: `demo1234`

### Install Browser Extension

**Chrome:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

**Firefox:**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from the `extension` folder

---

## 📁 Project Structure

```
privacyguard/
├── client/                  # React frontend
│   ├── src/
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── trackers/   # Tracker management
│   │   │   ├── breaches/   # Breach monitoring
│   │   │   ├── reports/    # Privacy reports
│   │   │   ├── settings/   # User settings
│   │   │   ├── landing/    # Landing page
│   │   │   └── onboarding/ # Onboarding flow
│   │   ├── components/     # Shared components
│   │   ├── lib/           # API client & utilities
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   ├── prisma/          # Database schema
│   └── index.js
├── extension/            # Browser extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup.html
└── README.md
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/privacyguard"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
NODE_ENV=development
HIBP_API_KEY="your-haveibeenpwned-api-key"
CLIENT_URL="http://localhost:5173"
```

### Frontend (`client/.env`)

```env
VITE_API_URL="http://localhost:3001/api"
```

---

## 📊 API Documentation

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Trackers
- `GET /api/trackers` - List all trackers
- `POST /api/trackers/scan` - Record tracker detection
- `PATCH /api/trackers/:id/block` - Toggle block status
- `POST /api/trackers/bulk-block` - Bulk block/allow

### Breaches
- `GET /api/breaches?email=...` - Check breach status
- `POST /api/breaches/monitor` - Monitor email

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard data

### Reports (Premium)
- `GET /api/reports/monthly` - Monthly privacy report

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings
- `DELETE /api/settings/account` - Delete account

[Full API Documentation →](docs/API.md)

---

## 🎨 Design System

### Color Palette

```css
--cyber-dark: #050C14      /* Primary background */
--cyber-darker: #0A1628    /* Secondary background */
--cyber-blue: #1A2942      /* Tertiary background */
--cyber-teal: #00E5CC      /* Primary accent */
--cyber-red: #FF4D4D       /* Alert/danger */
--cyber-green: #00C853     /* Success */
```

### Typography

- **Headings & Body**: [Sora](https://fonts.google.com/specimen/Sora)
- **Monospace/Data**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run E2E tests
npm run test:e2e
```

---

## 📦 Deployment

### Quick Deploy (Recommended)

**Backend**: Deploy to [Railway](https://railway.app)  
**Frontend**: Deploy to [Vercel](https://vercel.com)  
**Database**: Railway PostgreSQL or [Supabase](https://supabase.com)

```bash
# Build frontend
cd client
npm run build

# Build backend (production)
cd server
npm install --production
```

[Full Deployment Guide →](DEPLOYMENT.md)

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- [x] Web dashboard with 8 pages
- [x] Backend API with 20+ endpoints
- [x] Browser extension (Chrome/Firefox)
- [x] Privacy score algorithm
- [x] Tracker detection and blocking
- [x] Breach monitoring
- [x] Premium features

### 🚧 In Progress
- [ ] Full EasyList integration
- [ ] Real-time HaveIBeenPwned API
- [ ] PDF report generation
- [ ] Email notifications

### 🔮 Future
- [ ] Mobile app (iOS/Android)
- [ ] VPN integration
- [ ] Team/family plans
- [ ] Advanced analytics
- [ ] Browser sync
- [ ] Whitelist/blacklist management

[View Full Roadmap →](https://github.com/yourusername/privacyguard/projects/1)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/privacyguard.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [HaveIBeenPwned](https://haveibeenpwned.com/) for breach data API
- [EasyList](https://easylist.to/) for tracker filter lists
- [Recharts](https://recharts.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://prisma.io/) for database management

---

## 📞 Support

- 📧 Email: support@privacyguard.com
- 💬 [Discord Community](https://discord.gg/privacyguard)
- 🐦 Twitter: [@PrivacyGuardApp](https://twitter.com/privacyguardapp)
- 📖 [Documentation](https://github.com/yourusername/privacyguard/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/privacyguard/issues)

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/privacyguard?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/privacyguard?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/privacyguard)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/privacyguard)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/privacyguard)

---

<div align="center">

**Built with ❤️ for privacy advocates everywhere**

[⬆ Back to Top](#-privacyguard)

</div>
