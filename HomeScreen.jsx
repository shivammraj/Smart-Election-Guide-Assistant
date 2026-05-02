import { useLang, useUser } from '../context/AppContext.jsx';
import { ELECTION_TIMELINE } from '../utils/data.js';

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.ceil((d - now) / 86400000);
}

export default function HomeScreen({ setTab }) {
  const { t, lang } = useLang();
  const { user, journeyProgress } = useUser();
  const doneCt = journeyProgress.filter(Boolean).length;
  const pct = Math.round((doneCt / 5) * 100);
  const nextEvent = ELECTION_TIMELINE.find(e => daysUntil(e.date) >= 0);
  const daysLeft = nextEvent ? daysUntil(nextEvent.date) : 0;

  const actions = [
    { icon:'📋', label: t.home.checkEligibility, sub: t.home.voterIdCheck, tab:'eligibility', color:'#E6F1FB' },
    { icon:'📍', label: t.home.findBooth, sub: '1.2 ' + t.home.kmAway, tab:'booth', color:'#EAF3DE' },
    { icon:'💬', label: t.home.askQuestion, sub: t.home.aiHelp, tab:'chat', color:'#FAEEDA' },
    { icon:'🛡️', label: t.home.mythCheck, sub: t.home.spotFakeNews, tab:'myths', color:'#E1F5EE' },
  ];

  const reminders = [
    { dot:'#EF9F27', text:'Voter list verification deadline', time:'Tomorrow' },
    { dot:'#639922', text:'Download voter slip', time:'2 days' },
    { dot:'#378ADD', text:'Voting Day — 7 AM onwards', time: daysLeft > 0 ? daysLeft + ' days' : 'Today!' },
  ];

  return (
    <div className="screen">
      {/* Top Nav */}
      <div className="top-nav">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <p style={{ color:'#85b7eb', fontSize:13 }}>{t.home.greeting},</p>
            <h1 style={{ color:'#fff', fontSize:20, fontWeight:700 }}>{user?.name || 'Voter'}</h1>
            <p style={{ color:'#b5d4f4', fontSize:12, marginTop:2 }}>{user?.city || 'India'} · {user?.state || 'Set location'}</p>
          </div>
          <button style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:38, height:38, fontSize:18, cursor:'pointer', color:'#fff' }}>🔔</button>
        </div>

        {/* Progress card */}
        <div style={{ marginTop:16, background:'rgba(255,255,255,0.12)', borderRadius:14, padding:'14px 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div>
              <p style={{ color:'#85b7eb', fontSize:11 }}>{t.home.votingJourney}</p>
              <p style={{ color:'#fff', fontSize:13, fontWeight:600, marginTop:2 }}>
                {t.home.stepOf.replace('{done}', doneCt).replace('{total}', 5)}
              </p>
            </div>
            <div style={{ background:'rgba(93,202,165,0.2)', borderRadius:10, padding:'6px 12px', color:'#5DCAA5', fontWeight:700, fontSize:15 }}>{pct}%</div>
          </div>
          <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width: pct + '%' }} /></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            {['Register','Verify','Booth','Prep','Vote'].map((s,i) => (
              <span key={i} style={{ fontSize:10, color: journeyProgress[i] ? '#5DCAA5' : '#85b7eb' }}>{journeyProgress[i] ? '✓ ' : ''}{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Countdown */}
      {nextEvent && (
        <div style={{ margin:'16px 16px 0', background:'var(--primary)', borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:32, fontWeight:700, color:'#fff', lineHeight:1 }}>{daysLeft === 0 ? '!' : daysLeft}</div>
            <div style={{ fontSize:11, color:'#85b7eb' }}>{daysLeft === 0 ? 'Today' : t.home.daysLeft}</div>
          </div>
          <div>
            <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{lang==='hi' ? nextEvent.eventHi : nextEvent.event}</div>
            <div style={{ color:'#85b7eb', fontSize:12, marginTop:2 }}>{nextEvent.date}</div>
          </div>
          <div style={{ marginLeft:'auto', fontSize:28 }}>{nextEvent.icon}</div>
        </div>
      )}

      {/* Quick actions */}
      <p className="section-title">{t.home.quickActions}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 16px' }}>
        {actions.map((a, i) => (
          <button key={i} onClick={() => setTab(a.tab)} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:14, cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ width:40, height:40, borderRadius:10, background:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:8 }}>{a.icon}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{a.label}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Reminders */}
      <p className="section-title">{t.home.reminders}</p>
      <div style={{ margin:'0 16px', background:'var(--white)', borderRadius:14, border:'1px solid var(--border)', overflow:'hidden' }}>
        {reminders.map((r, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < reminders.length-1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:r.dot, flexShrink:0 }} />
            <div style={{ flex:1, fontSize:13, color:'var(--text)' }}>{r.text}</div>
            <div style={{ fontSize:11, color:'var(--text3)', flexShrink:0 }}>{r.time}</div>
          </div>
        ))}
      </div>

      {/* ECI link */}
      <div style={{ margin:'16px 16px 0', background:'rgba(26,58,92,0.04)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:20 }}>🏛️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600 }}>Official ECI Portal</div>
          <div style={{ fontSize:11, color:'var(--text3)' }}>eci.gov.in · voters.eci.gov.in</div>
        </div>
        <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Open →</a>
      </div>

      <div style={{ height:16 }} />
    </div>
  );
}
