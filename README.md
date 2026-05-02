# 🗳️ Smart Election Guide Assistant — Bharat Votes

> "This is not just an election assistant — it's a system designed to ensure people don't just understand voting, they actually participate."

A full-stack AI-powered civic tech platform that guides Indian citizens through the entire voting process — from registration to casting their vote.

---

## 📱 Screenshots & Features

| Screen | Description |
|--------|-------------|
| 🏠 **Home** | Personalized dashboard, countdown timer, quick actions, reminders |
| 📋 **Eligibility** | Age/registration check with guided registration flow |
| 🗺️ **Journey** | 5-phase step-by-step voting guide with progress tracking |
| 📍 **Booth Finder** | GPS-based polling booth locator with directions |
| 📅 **Timeline** | Dynamic election dates with countdown & calendar integration |
| 💬 **AI Chat** | Voice + text chatbot with Hindi/English support |
| 🛡️ **Myth Buster** | 12+ myths debunked with flip card animation |
| ⚙️ **Settings** | Reminder toggles, language preference, notifications |
| 🔐 **Admin** | Analytics dashboard with charts (password: `admin123`) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# 1. Clone or unzip the project
cd election-guide

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: Anthropic Claude API for AI chatbot
# Without this, the app uses built-in fallback responses (still fully functional)
VITE_ANTHROPIC_API_KEY=your_key_here

# Optional: Google Maps for real booth finder
VITE_GOOGLE_MAPS_KEY=your_key_here
```

**The app works fully without any API keys** — it uses intelligent fallback responses for the chatbot and mock data for the booth finder.

---

## 🏗️ Project Structure

```
src/
├── context/
│   └── AppContext.jsx       ← Global state (user, language, journey progress)
├── screens/
│   ├── OnboardingScreen.jsx ← 4-step onboarding (name, location, language, notifications)
│   ├── HomeScreen.jsx       ← Dashboard with countdown & quick actions
│   ├── EligibilityScreen.jsx← Age check + registration guide
│   ├── JourneyScreen.jsx    ← 5-phase voting journey with progress bar
│   ├── BoothFinderScreen.jsx← GPS + manual booth locator with map
│   ├── TimelineScreen.jsx   ← Election dates with live countdown
│   ├── ChatScreen.jsx       ← AI chatbot with voice input
│   ├── MythBusterScreen.jsx ← Searchable myth-fact flip cards
│   ├── SettingsScreen.jsx   ← Reminders, language, profile
│   └── AdminDashboard.jsx   ← Analytics with Recharts (password: admin123)
├── services/
│   ├── chatService.js       ← Anthropic Claude API + fallback responses
│   └── voiceService.js      ← Web Speech API (voice input/output)
├── i18n/
│   ├── en.js               ← English translations
│   └── hi.js               ← Hindi (हिंदी) translations
└── utils/
    └── data.js             ← Myths, timeline, states, journey phases data
```

---

## 🤖 AI Chatbot

The chatbot uses **Anthropic Claude** (claude-haiku) as the AI backend. Without an API key, it uses a smart fallback system that handles:

- Voter registration steps
- Name missing from voter list  
- Voting without ID (12 alternatives)
- What to carry on voting day
- EVM (Electronic Voting Machine) guide
- General election information

### To enable full AI:
1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Add `VITE_ANTHROPIC_API_KEY=your_key` to `.env`

---

## 🎙️ Voice Assistant

Voice input/output uses the **Web Speech API** — built into modern browsers, no API key needed.

**Supported browsers:** Chrome (desktop + Android), Edge, Safari (iOS 15+)

**Languages:** English (en-US) and Hindi (hi-IN)

---

## 🗺️ Booth Finder

**Demo mode (default):** Shows 5 mock polling booths near Indore, MP with realistic data.

**To enable real GPS booth finding:**
1. Get a [Google Maps API key](https://console.cloud.google.com)
2. Enable: Maps JavaScript API + Places API
3. Add `VITE_GOOGLE_MAPS_KEY=your_key` to `.env`

---

## 🔐 Admin Dashboard

Access via the 🔐 button in the top navigation.

**Default password:** `admin123`

Features:
- User registration analytics
- State-wise distribution bar chart
- Daily active users line chart
- Registration completion donut chart
- User management table with CSV export
- Broadcast notification simulator
- Election date editor

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy to any static host:

```bash
# Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy

# Netlify
netlify deploy --dir=dist --prod

# Vercel
vercel --prod
```

---

## 🌐 Multilingual Support

The app supports **English** and **Hindi** with instant switching via the हिं/EN toggle.

All UI text, navigation, chatbot quick replies, eligibility messages, journey phases, and notifications are fully translated.

To add more languages:
1. Create `src/i18n/mr.js` (Marathi) following the same structure as `en.js`
2. Add the language option in `OnboardingScreen.jsx`
3. Update `AppContext.jsx` to import and use it

---

## 📋 Data Sources

All election information is based on:
- [Election Commission of India](https://eci.gov.in)
- [NVSP Portal](https://nvsp.in)
- [National Voter Services Portal](https://voters.eci.gov.in)
- [Electoral Search](https://electoralsearch.eci.gov.in)
- Representation of the People Act, 1950

**Helpline:** 1950 (National Voter Helpline, toll-free)

---

## 🏆 Bonus Features Included

- ✅ Confetti animation on journey completion (canvas-confetti)
- ✅ Badge system (🏅 earned after completing steps)
- ✅ Offline-capable (all core data is static)
- ✅ Mobile-first responsive design (max-width: 480px)
- ✅ Persistent state via localStorage
- ✅ "Add to Google Calendar" for each election event
- ✅ Share booth location via Web Share API
- ✅ Admin dashboard with Recharts analytics

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Custom CSS (no framework needed) |
| State | React Context + localStorage |
| Charts | Recharts 2 |
| AI | Anthropic Claude (haiku) + fallback |
| Voice | Web Speech API |
| Animations | CSS keyframes + canvas-confetti |
| i18n | Custom lightweight i18n |
| Build | Vite (tree-shaken, ~620KB bundle) |

---

## 📣 One-Line Pitch

**"This is not just an election assistant — it's a behavior-change system designed to ensure people don't just understand voting, they actually participate."**

---

*Built with ❤️ for Indian democracy. Jai Hind! 🇮🇳*
