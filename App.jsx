import { useState, useEffect } from 'react'
import { UserProvider, LanguageProvider } from './context/AppContext.jsx'
import { useUser, useLang } from './context/AppContext.jsx'
import OnboardingScreen from './screens/OnboardingScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import EligibilityScreen from './screens/EligibilityScreen.jsx'
import JourneyScreen from './screens/JourneyScreen.jsx'
import BoothFinderScreen from './screens/BoothFinderScreen.jsx'
import TimelineScreen from './screens/TimelineScreen.jsx'
import ChatScreen from './screens/ChatScreen.jsx'
import MythBusterScreen from './screens/MythBusterScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import AdminDashboard from './screens/AdminDashboard.jsx'

const NAV_ITEMS = [
  { id:'home', icon:'🏠', label:'Home' },
  { id:'steps', icon:'📋', label:'Steps' },
  { id:'chat', icon:'💬', label:'Ask AI' },
  { id:'booth', icon:'📍', label:'Booth' },
  { id:'myths', icon:'🛡️', label:'Myths' },
]

const styles = `
  .app-shell { max-width: 480px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; position: relative; background: #F8F9FA; }
  .app-header { background: #1a3a5c; color: white; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
  .app-header h1 { font-size: 17px; font-weight: 600; }
  .app-header .flag { font-size: 20px; }
  .header-right { display: flex; gap: 8px; align-items: center; }
  .header-btn { background: rgba(255,255,255,0.12); border: none; color: white; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .header-btn:hover { background: rgba(255,255,255,0.2); }
  .screen-body { flex: 1; overflow-y: auto; padding-bottom: 72px; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: white; border-top: 1px solid #e2e8f0; display: flex; z-index: 50; }
  .bnav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px 4px; cursor: pointer; border: none; background: none; gap: 2px; min-height: 56px; }
  .bnav-icon { font-size: 20px; line-height: 1; }
  .bnav-label { font-size: 10px; color: #64748b; font-family: 'Noto Sans', sans-serif; }
  .bnav-item.active .bnav-label { color: #1a3a5c; font-weight: 600; }
  .bnav-item.active .bnav-icon { filter: drop-shadow(0 0 4px rgba(26,58,92,0.4)); }
  .lang-toggle { font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.15); border: none; color: white; padding: 4px 10px; border-radius: 20px; cursor: pointer; }
  .lang-toggle:hover { background: rgba(255,255,255,0.25); }
  @media (max-width: 480px) { .app-shell { max-width: 100%; } .bottom-nav { max-width: 100%; } }
`

function AppInner() {
  const { user } = useUser()
  const { lang, changeLang, t } = useLang()
  const [tab, setTab] = useState('home')
  const [showAdmin, setShowAdmin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  if (!user) {
    return <OnboardingScreen onComplete={() => {}} />
  }

  if (showAdmin) {
    return (
      <div className="app-shell">
        <div className="app-header">
          <span className="flag">🇮🇳</span>
          <h1>Admin Dashboard</h1>
          <button className="header-btn" onClick={() => setShowAdmin(false)} title="Back">←</button>
        </div>
        <div className="screen-body"><AdminDashboard /></div>
      </div>
    )
  }

  if (showSettings) {
    return (
      <div className="app-shell">
        <div className="app-header">
          <span className="flag">🇮🇳</span>
          <h1>Settings</h1>
          <button className="header-btn" onClick={() => setShowSettings(false)} title="Back">←</button>
        </div>
        <div className="screen-body"><SettingsScreen /></div>
      </div>
    )
  }

  const screens = {
    home: <HomeScreen setTab={setTab} />,
    eligibility: <EligibilityScreen />,
    steps: <JourneyScreen />,
    booth: <BoothFinderScreen />,
    timeline: <TimelineScreen />,
    chat: <ChatScreen />,
    myths: <MythBusterScreen />,
  }

  const navLabels = { home:'Home', steps:'Steps', chat:'Ask AI', booth:'Booth', myths:'Myths' }

  return (
    <div className="app-shell">
      <div className="app-header">
        <span className="flag">🇮🇳</span>
        <h1>Bharat Votes</h1>
        <div className="header-right">
          <button className="lang-toggle" onClick={() => changeLang(lang === 'en' ? 'hi' : 'en')}>
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          <button className="header-btn" onClick={() => setShowSettings(true)} title="Settings" aria-label="Settings">⚙️</button>
          <button className="header-btn" onClick={() => setShowAdmin(true)} title="Admin" aria-label="Admin panel">🔐</button>
        </div>
      </div>

      <div className="screen-body" role="main">
        {screens[tab] || screens.home}
      </div>

      <nav className="bottom-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`bnav-item${tab === item.id ? ' active' : ''}`}
            onClick={() => setTab(item.id)}
            aria-label={item.label}
            aria-current={tab === item.id ? 'page' : undefined}
          >
            <span className="bnav-icon" aria-hidden="true">{item.icon}</span>
            <span className="bnav-label">{lang === 'hi' && item.id === 'home' ? 'होम' : lang === 'hi' && item.id === 'steps' ? 'चरण' : lang === 'hi' && item.id === 'chat' ? 'पूछें' : lang === 'hi' && item.id === 'booth' ? 'बूथ' : lang === 'hi' && item.id === 'myths' ? 'मिथक' : item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <LanguageProvider>
        <UserProvider>
          <AppInner />
        </UserProvider>
      </LanguageProvider>
    </>
  )
}
