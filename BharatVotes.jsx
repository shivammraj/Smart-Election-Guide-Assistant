import { useState, useRef, useEffect, createContext, useContext } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
  :root {
    --primary: #1a3a5c;
    --primary-dark: #0f2540;
    --accent: #5DCAA5;
    --accent2: #EF9F27;
    --white: #ffffff;
    --bg: #F4F6FA;
    --bg2: #EAF0F8;
    --border: #dde4ee;
    --text: #1a2433;
    --text2: #3c4e63;
    --text3: #7a8fa6;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Mukta', sans-serif; background: #e8edf5; }

  .shell { max-width: 430px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); box-shadow: 0 0 40px rgba(0,0,0,0.18); position: relative; }
  .header { background: var(--primary); color: #fff; padding: 0 16px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .header h1 { font-size: 17px; font-weight: 700; letter-spacing: 0.2px; }
  .header-right { display: flex; gap: 8px; align-items: center; }
  .hbtn { background: rgba(255,255,255,0.13); border: none; color: #fff; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .hbtn:hover { background: rgba(255,255,255,0.25); }
  .lang-pill { font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.16); border: none; color: #fff; padding: 4px 11px; border-radius: 20px; cursor: pointer; transition: background 0.15s; }
  .lang-pill:hover { background: rgba(255,255,255,0.28); }

  .screen-body { flex: 1; overflow-y: auto; padding-bottom: 68px; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-top: 1px solid var(--border); display: flex; z-index: 100; }
  .bnav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 7px 4px; cursor: pointer; border: none; background: none; gap: 2px; min-height: 54px; }
  .bnav-icon { font-size: 19px; }
  .bnav-label { font-size: 10px; color: var(--text3); font-family: 'Mukta', sans-serif; }
  .bnav-item.active .bnav-label { color: var(--primary); font-weight: 700; }

  .top-nav { background: linear-gradient(160deg, #1a3a5c 0%, #24527a 100%); padding: 16px 16px 20px; }
  .section-title { font-size: 13px; font-weight: 700; color: var(--text3); padding: 14px 16px 6px; text-transform: uppercase; letter-spacing: 0.6px; }

  .card { background: var(--white); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
  .card-pad { padding: 14px 16px; }

  .input { width: 100%; background: var(--bg2); border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 14px; color: var(--text); font-family: 'Mukta', sans-serif; outline: none; transition: border-color 0.15s; }
  .input:focus { border-color: var(--primary); }

  .btn { border: none; border-radius: 10px; padding: 10px 18px; font-size: 14px; font-family: 'Mukta', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-primary { background: var(--primary); color: #fff; }
  .btn-primary:hover { background: var(--primary-dark); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: var(--bg2); color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--border); }
  .btn-outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
  .btn-outline:hover { background: var(--bg2); }
  .btn-full { width: 100%; }
  .btn-sm { padding: 7px 14px; font-size: 12px; border-radius: 8px; }

  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #e3f7ed; color: #2a7a4b; }
  .badge-orange { background: #fef0db; color: #a05f10; }
  .badge-gray { background: #f0f0f0; color: #666; }
  .badge-blue { background: #dbeafe; color: #1e40af; }

  .prog-bar-bg { height: 6px; background: rgba(255,255,255,0.2); border-radius: 10px; overflow: hidden; }
  .prog-bar-fill { height: 100%; background: var(--accent); border-radius: 10px; transition: width 0.6s ease; }

  .screen { min-height: 100%; }
  .fade-in { animation: fadeIn 0.25s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes wave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1.2); } }
  @keyframes dots { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

  .myth-card { perspective: 600px; cursor: pointer; }
  .myth-inner { position: relative; width: 100%; transition: transform 0.5s; transform-style: preserve-3d; }
  .myth-card.flipped .myth-inner { transform: rotateY(180deg); }
  .myth-front, .myth-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 14px; padding: 16px; border: 1px solid var(--border); }
  .myth-back { position: absolute; inset: 0; transform: rotateY(180deg); background: linear-gradient(135deg, #1a3a5c, #24527a); color: #fff; }

  .step-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }

  @media (max-width: 430px) { .shell { max-width: 100%; } .bottom-nav { max-width: 100%; } }
`;

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const en = {
  home: { greeting:"Good day", votingJourney:"Your Voting Journey", stepOf:"Step {done} of {total} complete", daysLeft:"days left", quickActions:"Quick Actions", checkEligibility:"Check Eligibility", voterIdCheck:"Verify voter ID", findBooth:"Find My Booth", kmAway:"km away", askQuestion:"Ask a Question", aiHelp:"AI-powered help", mythCheck:"Myth Buster", spotFakeNews:"Spot fake news", reminders:"Upcoming Reminders" },
  chat: { greeting:"Namaste! 🙏 I'm your Bharat Votes AI assistant. I can help you with voter registration, finding your booth, election dates, and more. What would you like to know?", placeholder:"Type your question...", quickReplies:["How to register?","Find my booth","What ID to carry?","When is voting?"] },
  nav: { home:"Home", steps:"Steps", chat:"Ask AI", booth:"Booth", myths:"Myths" },
};
const hi = {
  home: { greeting:"नमस्ते", votingJourney:"आपकी मतदान यात्रा", stepOf:"{done} / {total} चरण पूरे", daysLeft:"दिन बाकी", quickActions:"त्वरित कार्य", checkEligibility:"पात्रता जाँचें", voterIdCheck:"वोटर आईडी सत्यापित करें", findBooth:"मतदान केंद्र खोजें", kmAway:"किमी दूर", askQuestion:"प्रश्न पूछें", aiHelp:"AI-सहायता", mythCheck:"मिथक तोड़ो", spotFakeNews:"फर्जी खबर पकड़ें", reminders:"आगामी अनुस्मारक" },
  chat: { greeting:"नमस्ते! 🙏 मैं भारत वोट्स AI सहायक हूं। मैं मतदाता पंजीकरण, बूथ खोजने, चुनाव तिथियों आदि में मदद कर सकता हूं। आप क्या जानना चाहते हैं?", placeholder:"अपना प्रश्न लिखें...", quickReplies:["पंजीकरण कैसे करें?","मेरा बूथ खोजें","क्या लेकर जाएं?","मतदान कब है?"] },
  nav: { home:"होम", steps:"चरण", chat:"पूछें", booth:"बूथ", myths:"मिथक" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TIMELINE = [
  { date:"2025-10-15", event:"Registration Deadline", eventHi:"पंजीकरण की अंतिम तिथि", icon:"📝" },
  { date:"2025-11-05", event:"Voter List Published", eventHi:"मतदाता सूची प्रकाशित", icon:"📋" },
  { date:"2025-11-17", event:"Voting Day", eventHi:"मतदान दिवस", icon:"🗳️" },
  { date:"2025-11-23", event:"Results Day", eventHi:"परिणाम दिवस", icon:"🏆" },
];

const MYTHS = [
  { myth:"You need voter ID card to vote", fact:"12 alternative IDs accepted: Aadhaar, PAN, Passport, Driving License, MNREGA card, etc.", icon:"🪪" },
  { myth:"You can only vote in your home state", fact:"You vote where you are registered — you can update your address on voters.eci.gov.in", icon:"📍" },
  { myth:"Voting takes the whole day", fact:"Average voting time is 10–15 minutes. Queues are usually shortest in the morning.", icon:"⏰" },
  { myth:"EVM machines can be hacked", fact:"EVMs are standalone devices with no internet, Bluetooth, or WiFi connectivity.", icon:"🖥️" },
  { myth:"You lose your vote if you spoil the ballot", fact:"NOTA (None of the Above) is a valid option — press the last button on the EVM.", icon:"🗳️" },
  { myth:"First-time voters need special documents", fact:"Any valid ID from the approved list is sufficient for all voters, including first-timers.", icon:"✅" },
];

const JOURNEY_PHASES = [
  { phase:"Register", icon:"📝", desc:"Check if your name is on the voter list. If not, fill Form 6 on voters.eci.gov.in", done:false },
  { phase:"Verify", icon:"✔️", desc:"Verify your details on the voter list. Correct any errors with Form 8.", done:false },
  { phase:"Find Booth", icon:"📍", desc:"Locate your assigned polling booth using the Booth Finder.", done:false },
  { phase:"Prepare", icon:"🎒", desc:"Keep your voter ID ready. Know your booth location and voting hours (7AM–6PM).", done:false },
  { phase:"Vote!", icon:"🗳️", desc:"Go to your polling booth, verify your identity, and cast your vote confidently.", done:false },
];

const BOOTHS = [
  { name:"Govt. Higher Secondary School", address:"Vijay Nagar, Indore", distance:"0.8 km", voters:1240, open:"7:00 AM – 6:00 PM" },
  { name:"Municipal Primary School No. 3", address:"Scheme 54, Indore", distance:"1.2 km", voters:980, open:"7:00 AM – 6:00 PM" },
  { name:"Community Hall, Sector 7", address:"Palasia, Indore", distance:"1.9 km", voters:1560, open:"7:00 AM – 6:00 PM" },
];

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppCtx = createContext({});
function useApp() { return useContext(AppCtx); }

// ─── CHAT SERVICE ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "Bharat Votes AI", a helpful civic assistant for Indian voters. You help with voter registration, finding polling booths, election dates, required documents, EVM usage, and combating election misinformation. Keep answers concise (3-5 sentences), friendly, and factual. Cite ECI (eci.gov.in) when relevant. If asked something unrelated to voting/elections, politely redirect.`;

async function callClaude(messages) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
  } catch {
    return fallback(messages[messages.length - 1]?.content || "");
  }
}

function fallback(q) {
  q = q.toLowerCase();
  if (q.includes("register") || q.includes("पंजीकरण")) return "To register as a voter: 1) Visit voters.eci.gov.in 2) Fill Form 6 online 3) Upload proof of age & address 4) Track your application status. You'll receive your EPIC card within 30 days. Helpline: 1950 (toll-free).";
  if (q.includes("booth") || q.includes("बूथ")) return "Find your polling booth at electoralsearch.eci.gov.in by entering your name/EPIC number. Your booth details are also printed on your voter slip. Use the Booth Finder tab in this app!";
  if (q.includes("id") || q.includes("document") || q.includes("carry") || q.includes("लेकर")) return "You can use any of 12 photo IDs: Voter ID, Aadhaar, PAN, Passport, Driving License, MNREGA card, Service ID (Govt. employees), Passbook with photo, Health insurance smartcard, Pension document, NPR smartcard, or Disability certificate.";
  if (q.includes("when") || q.includes("date") || q.includes("कब")) return "Key dates: Registration Deadline — Oct 15, 2025 | Voter List Published — Nov 5, 2025 | Voting Day — Nov 17, 2025 | Results — Nov 23, 2025. Voting hours are 7AM–6PM.";
  if (q.includes("evm")) return "EVMs (Electronic Voting Machines) are standalone devices with zero internet/Bluetooth/WiFi. They are sealed, verified by all candidates' agents, and have a paper trail (VVPAT). They are manufactured by BEL and ECIL under strict ECI oversight.";
  return "I can help you with voter registration, booth location, required documents, election dates, and clearing voting myths. What would you like to know? For official info, visit eci.gov.in or call 1950 (toll-free).";
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function daysUntil(d) {
  const now = new Date(); now.setHours(0,0,0,0);
  const dt = new Date(d); dt.setHours(0,0,0,0);
  return Math.ceil((dt - now) / 86400000);
}

// HOME
function HomeScreen({ setTab }) {
  const { t, user, progress } = useApp();
  const doneCt = progress.filter(Boolean).length;
  const pct = Math.round((doneCt / 5) * 100);
  const nextEvent = TIMELINE.find(e => daysUntil(e.date) >= 0);
  const daysLeft = nextEvent ? daysUntil(nextEvent.date) : 0;

  const actions = [
    { icon:"📋", label:t.home.checkEligibility, sub:t.home.voterIdCheck, tab:"steps", color:"#E6F1FB" },
    { icon:"📍", label:t.home.findBooth, sub:"1.2 " + t.home.kmAway, tab:"booth", color:"#EAF3DE" },
    { icon:"💬", label:t.home.askQuestion, sub:t.home.aiHelp, tab:"chat", color:"#FAEEDA" },
    { icon:"🛡️", label:t.home.mythCheck, sub:t.home.spotFakeNews, tab:"myths", color:"#E1F5EE" },
  ];

  return (
    <div className="screen fade-in">
      <div className="top-nav">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:"#85b7eb", fontSize:13 }}>{t.home.greeting},</p>
            <h1 style={{ color:"#fff", fontSize:20, fontWeight:700, fontFamily:"'Playfair Display', serif" }}>{user?.name || "Voter"}</h1>
            <p style={{ color:"#b5d4f4", fontSize:12, marginTop:2 }}>{user?.city || "India"} · {user?.state || "India"}</p>
          </div>
          <button className="hbtn">🔔</button>
        </div>
        <div style={{ marginTop:16, background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <div>
              <p style={{ color:"#85b7eb", fontSize:11 }}>{t.home.votingJourney}</p>
              <p style={{ color:"#fff", fontSize:13, fontWeight:600, marginTop:2 }}>{t.home.stepOf.replace("{done}", doneCt).replace("{total}", 5)}</p>
            </div>
            <div style={{ background:"rgba(93,202,165,0.2)", borderRadius:10, padding:"6px 12px", color:"#5DCAA5", fontWeight:700, fontSize:15 }}>{pct}%</div>
          </div>
          <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width:`${pct}%` }} /></div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {["Register","Verify","Booth","Prep","Vote"].map((s,i) => (
              <span key={i} style={{ fontSize:10, color:progress[i] ? "#5DCAA5" : "#85b7eb" }}>{progress[i] ? "✓ " : ""}{s}</span>
            ))}
          </div>
        </div>
      </div>

      {nextEvent && (
        <div style={{ margin:"16px 16px 0", background:"var(--primary)", borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"center", minWidth:44 }}>
            <div style={{ fontSize:30, fontWeight:700, color:"#fff", lineHeight:1 }}>{daysLeft <= 0 ? "!" : daysLeft}</div>
            <div style={{ fontSize:11, color:"#85b7eb" }}>{daysLeft <= 0 ? "Today" : t.home.daysLeft}</div>
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{nextEvent.event}</div>
            <div style={{ color:"#85b7eb", fontSize:12, marginTop:2 }}>{nextEvent.date}</div>
          </div>
          <div style={{ marginLeft:"auto", fontSize:28 }}>{nextEvent.icon}</div>
        </div>
      )}

      <p className="section-title">{t.home.quickActions}</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 16px" }}>
        {actions.map((a,i) => (
          <button key={i} onClick={() => setTab(a.tab)} style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:14, padding:14, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
            <div style={{ width:40, height:40, borderRadius:10, background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:8 }}>{a.icon}</div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{a.label}</div>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:3 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      <p className="section-title">{t.home.reminders}</p>
      <div style={{ margin:"0 16px", background:"var(--white)", borderRadius:14, border:"1px solid var(--border)", overflow:"hidden" }}>
        {[
          { dot:"#EF9F27", text:"Voter list verification deadline", time:"Oct 15" },
          { dot:"#639922", text:"Download your voter slip", time:"Nov 5" },
          { dot:"#378ADD", text:"Voting Day — 7 AM onwards", time:"Nov 17" },
        ].map((r,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:r.dot, flexShrink:0 }} />
            <div style={{ flex:1, fontSize:13 }}>{r.text}</div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>{r.time}</div>
          </div>
        ))}
      </div>

      <div style={{ margin:"16px 16px 8px", background:"rgba(26,58,92,0.05)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>🏛️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600 }}>Official ECI Portal</div>
          <div style={{ fontSize:11, color:"var(--text3)" }}>eci.gov.in · voters.eci.gov.in</div>
        </div>
        <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Open →</a>
      </div>
      <div style={{ height:8 }} />
    </div>
  );
}

// JOURNEY / STEPS
function JourneyScreen() {
  const { progress, setProgress } = useApp();
  const toggle = (i) => {
    const n = [...progress];
    n[i] = !n[i];
    setProgress(n);
  };

  return (
    <div className="screen fade-in">
      <div className="top-nav">
        <h2 style={{ color:"#fff", fontSize:17, fontWeight:700 }}>Your Voting Journey</h2>
        <p style={{ color:"#85b7eb", fontSize:12, marginTop:4 }}>Complete all 5 phases to be voting-ready</p>
        <div style={{ marginTop:14 }}>
          <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width:`${Math.round(progress.filter(Boolean).length/5*100)}%` }} /></div>
          <p style={{ color:"#5DCAA5", fontSize:12, marginTop:6, fontWeight:600 }}>{progress.filter(Boolean).length}/5 phases complete</p>
        </div>
      </div>
      <div style={{ padding:"16px" }}>
        {JOURNEY_PHASES.map((p, i) => (
          <div key={i} className="card card-pad" style={{ marginBottom:10, opacity:1 }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:progress[i]?"#e3f7ed":"var(--bg2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{p.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Phase {i+1}: {p.phase}</span>
                  <span className={`badge ${progress[i]?"badge-green":"badge-gray"}`}>{progress[i]?"Done":"Pending"}</span>
                </div>
                <p style={{ fontSize:12, color:"var(--text3)", marginTop:5, lineHeight:1.55 }}>{p.desc}</p>
              </div>
            </div>
            <button onClick={() => toggle(i)} className={`btn btn-sm btn-full ${progress[i]?"btn-ghost":"btn-primary"}`} style={{ marginTop:12 }}>
              {progress[i] ? "✓ Mark Incomplete" : "Mark as Complete"}
            </button>
          </div>
        ))}
        {progress.filter(Boolean).length === 5 && (
          <div style={{ background:"linear-gradient(135deg,#1a3a5c,#24527a)", borderRadius:16, padding:"20px", textAlign:"center", color:"#fff", marginTop:4 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🎉</div>
            <h3 style={{ fontSize:17, fontWeight:700 }}>You're Voting Ready!</h3>
            <p style={{ fontSize:13, color:"#85b7eb", marginTop:6 }}>All phases complete. See you at the booth on Nov 17!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// BOOTH FINDER
function BoothScreen() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  return (
    <div className="screen fade-in">
      <div className="top-nav">
        <h2 style={{ color:"#fff", fontSize:17, fontWeight:700 }}>Find My Polling Booth</h2>
        <p style={{ color:"#85b7eb", fontSize:12, marginTop:4 }}>Based on your registered address</p>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          <input className="input" placeholder="Enter name or EPIC number…" value={query} onChange={e => setQuery(e.target.value)} style={{ flex:1, background:"rgba(255,255,255,0.15)", borderColor:"rgba(255,255,255,0.2)", color:"#fff" }} />
          <button className="btn btn-primary btn-sm">🔍</button>
        </div>
      </div>
      <div style={{ padding:"16px" }}>
        <div style={{ background:"linear-gradient(135deg,#e8f4fd,#dbeafe)", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:24 }}>📍</span>
          <div>
            <p style={{ fontSize:13, fontWeight:600 }}>Showing booths near Vijay Nagar, Indore</p>
            <p style={{ fontSize:11, color:"var(--text3)" }}>Demo mode — enter your details above for actual results</p>
          </div>
        </div>
        {BOOTHS.map((b, i) => (
          <div key={i} className="card card-pad" style={{ marginBottom:10, cursor:"pointer", border:selected===i?"2px solid var(--primary)":"1px solid var(--border)" }} onClick={() => setSelected(selected===i?null:i)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:700 }}>{b.name}</p>
                <p style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>{b.address}</p>
              </div>
              <span className="badge badge-blue" style={{ flexShrink:0, marginLeft:8 }}>{b.distance}</span>
            </div>
            {selected === i && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--border)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                  <div style={{ background:"var(--bg2)", borderRadius:8, padding:"8px 12px" }}>
                    <p style={{ fontSize:10, color:"var(--text3)" }}>Total Voters</p>
                    <p style={{ fontSize:15, fontWeight:700 }}>{b.voters.toLocaleString()}</p>
                  </div>
                  <div style={{ background:"var(--bg2)", borderRadius:8, padding:"8px 12px" }}>
                    <p style={{ fontSize:10, color:"var(--text3)" }}>Voting Hours</p>
                    <p style={{ fontSize:13, fontWeight:700 }}>{b.open}</p>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex:1 }}>🗺️ Directions</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>📤 Share</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <p style={{ fontSize:11, color:"var(--text3)", textAlign:"center", marginTop:8 }}>For official search: <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noreferrer" style={{ color:"var(--primary)" }}>electoralsearch.eci.gov.in</a></p>
      </div>
    </div>
  );
}

// CHAT
function TypingDots() {
  return (
    <div style={{ display:"flex", gap:5, padding:"10px 14px", alignItems:"center" }}>
      {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"var(--text3)", animation:`dots 1.2s ease ${i*0.2}s infinite` }} />)}
    </div>
  );
}

function ChatScreen() {
  const { t } = useApp();
  const [messages, setMessages] = useState([{ role:"assistant", content:t.chat.greeting, time:nowTime() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  function nowTime() { return new Date().toLocaleTimeString("en", { hour:"2-digit", minute:"2-digit" }); }

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    const newMsg = { role:"user", content:msg, time:nowTime() };
    const hist = [...messages, newMsg];
    setMessages(hist);
    setLoading(true);
    const reply = await callClaude(hist);
    setMessages(h => [...h, { role:"assistant", content:reply, time:nowTime() }]);
    setLoading(false);
  };

  return (
    <div className="screen" style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 110px)", minHeight:400 }}>
      <div className="top-nav" style={{ flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🗳️</div>
          <div>
            <h2 style={{ color:"#fff", fontSize:16, fontWeight:700 }}>Bharat Votes AI</h2>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#5DCAA5" }} />
              <span style={{ color:"#85b7eb", fontSize:11 }}>Online · Replies instantly</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflow:"auto", padding:"14px 16px 0" }}>
        {messages.map((m, i) => {
          const isBot = m.role === "assistant";
          return (
            <div key={i} style={{ display:"flex", justifyContent:isBot?"flex-start":"flex-end", marginBottom:10 }}>
              {isBot && <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🗳️</div>}
              <div style={{ maxWidth:"78%" }}>
                <div style={{ padding:"10px 14px", borderRadius:isBot?"18px 18px 18px 4px":"18px 18px 4px 18px", background:isBot?"var(--white)":"var(--primary)", color:isBot?"var(--text)":"#fff", border:isBot?"1px solid var(--border)":"none", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{m.content}</div>
                <div style={{ fontSize:10, color:"var(--text3)", marginTop:3, textAlign:isBot?"left":"right" }}>{m.time}</div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🗳️</div>
            <div style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:"18px 18px 18px 4px" }}><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding:"8px 16px 0", display:"flex", gap:6, overflowX:"auto", flexShrink:0 }}>
        {t.chat.quickReplies.map((qr,i) => (
          <button key={i} onClick={() => send(qr)} className="btn btn-ghost btn-sm" style={{ flexShrink:0, fontSize:12, borderRadius:20, whiteSpace:"nowrap" }}>{qr}</button>
        ))}
      </div>

      <div style={{ padding:"10px 16px 14px", display:"flex", gap:8, flexShrink:0, background:"var(--bg)" }}>
        <input className="input" placeholder={t.chat.placeholder} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} style={{ flex:1 }} />
        <button onClick={() => send()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ borderRadius:"50%", width:44, height:44, padding:0, flexShrink:0, opacity:(!input.trim()||loading)?0.5:1 }}>↑</button>
      </div>
    </div>
  );
}

// MYTH BUSTER
function MythScreen() {
  const [flipped, setFlipped] = useState({});
  const [search, setSearch] = useState("");
  const filtered = MYTHS.filter(m => m.myth.toLowerCase().includes(search.toLowerCase()) || m.fact.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen fade-in">
      <div className="top-nav">
        <h2 style={{ color:"#fff", fontSize:17, fontWeight:700 }}>🛡️ Myth Buster</h2>
        <p style={{ color:"#85b7eb", fontSize:12, marginTop:4 }}>Tap a card to reveal the truth</p>
        <input className="input" placeholder="Search myths…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginTop:14, background:"rgba(255,255,255,0.15)", borderColor:"rgba(255,255,255,0.2)", color:"#fff" }} />
      </div>
      <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map((m, i) => (
          <div key={i} className={`myth-card${flipped[i]?" flipped":""}`} style={{ minHeight:120 }} onClick={() => setFlipped(f => ({ ...f, [i]:!f[i] }))}>
            <div className="myth-inner" style={{ minHeight:120 }}>
              <div className="myth-front" style={{ background:"var(--white)", minHeight:120 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{m.icon}</span>
                  <div>
                    <span className="badge badge-orange" style={{ marginBottom:8 }}>MYTH</span>
                    <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", lineHeight:1.5 }}>{m.myth}</p>
                    <p style={{ fontSize:11, color:"var(--text3)", marginTop:8 }}>Tap to see the truth →</p>
                  </div>
                </div>
              </div>
              <div className="myth-back" style={{ minHeight:120 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start", height:"100%" }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>✅</span>
                  <div>
                    <span style={{ background:"rgba(93,202,165,0.3)", color:"#5DCAA5", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, display:"inline-block", marginBottom:8 }}>FACT</span>
                    <p style={{ fontSize:14, lineHeight:1.55 }}>{m.fact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ textAlign:"center", color:"var(--text3)", fontSize:13, paddingTop:32 }}>No myths found for "{search}"</p>}
      </div>
    </div>
  );
}

// TIMELINE
function TimelineScreen() {
  return (
    <div className="screen fade-in">
      <div className="top-nav">
        <h2 style={{ color:"#fff", fontSize:17, fontWeight:700 }}>📅 Election Timeline</h2>
        <p style={{ color:"#85b7eb", fontSize:12, marginTop:4 }}>Key dates for the 2025 elections</p>
      </div>
      <div style={{ padding:"16px" }}>
        {TIMELINE.map((e, i) => {
          const dl = daysUntil(e.date);
          return (
            <div key={i} className="card card-pad" style={{ marginBottom:10, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:46, height:46, borderRadius:12, background:dl<=0?"#e3f7ed":"var(--bg2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{e.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:700 }}>{e.event}</p>
                <p style={{ fontSize:12, color:"var(--text3)" }}>{e.date}</p>
              </div>
              <span className={`badge ${dl <= 0 ? "badge-green" : dl <= 7 ? "badge-orange" : "badge-blue"}`}>
                {dl <= 0 ? "Done/Today" : `${dl} days`}
              </span>
            </div>
          );
        })}
        <div className="card card-pad" style={{ background:"rgba(26,58,92,0.04)", marginTop:8 }}>
          <p style={{ fontSize:12, fontWeight:600, marginBottom:4 }}>📞 Voter Helpline</p>
          <p style={{ fontSize:20, fontWeight:700, color:"var(--primary)" }}>1950</p>
          <p style={{ fontSize:11, color:"var(--text3)" }}>Toll-free · Available 24×7</p>
        </div>
      </div>
    </div>
  );
}

// ADMIN
const stateData = [{ state:"MP", users:4200 },{ state:"UP", users:3800 },{ state:"MH", users:2900 },{ state:"RJ", users:2100 },{ state:"DL", users:1850 },{ state:"KA", users:1600 }];
const dauData = [{ day:"Mon", users:820 },{ day:"Tue", users:940 },{ day:"Wed", users:1100 },{ day:"Thu", users:880 },{ day:"Fri", users:1250 },{ day:"Sat", users:1480 },{ day:"Sun", users:1190 }];
const regData = [{ name:"Completed", value:62 },{ name:"In Progress", value:24 },{ name:"Not Started", value:14 }];
const PIE_COLORS = ["#5DCAA5","#378ADD","#D3D1C7"];

function AdminDashboard({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [section, setSection] = useState("overview");

  const login = () => { pw === "admin123" ? (setAuthed(true), setErr("")) : setErr("Incorrect password. (Hint: admin123)"); };

  if (!authed) return (
    <div className="screen" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, minHeight:400 }}>
      <div style={{ width:"100%", maxWidth:300, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
        <h2 style={{ fontSize:20, fontWeight:700 }}>Admin Access</h2>
        <p style={{ fontSize:13, color:"var(--text3)", marginTop:4, marginBottom:20 }}>Restricted to authorised personnel</p>
        {err && <div style={{ background:"#FCEBEB", color:"#A32D2D", padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:12 }}>{err}</div>}
        <input className="input" type="password" placeholder="Enter admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter" && login()} style={{ marginBottom:12 }} />
        <button className="btn btn-primary btn-full" onClick={login}>Login</button>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop:8 }}>← Back</button>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="top-nav">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ color:"#fff", fontSize:17, fontWeight:700 }}>Admin Dashboard</h1>
            <p style={{ color:"#85b7eb", fontSize:12 }}>Bharat Votes · Real-time analytics</p>
          </div>
          <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ fontSize:12 }}>← Exit</button>
        </div>
        <div style={{ display:"flex", gap:6, marginTop:12 }}>
          {["overview","users","content"].map(s => (
            <button key={s} onClick={() => setSection(s)} style={{ flex:1, padding:"7px", borderRadius:8, border:"none", background:section===s?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.08)", color:"#fff", fontWeight:section===s?700:400, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        {section === "overview" && (
          <div className="fade-in">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[["👥","Total Users","16,350","+234 today","#185FA5"],["✅","Registered","62%","10,137 users","#3B6D11"],["📍","Booth Searches","4,280","This week","#854F0B"],["🔔","Notif Rate","71%","Open rate","#0F6E56"]].map(([icon,label,value,sub,color],i) => (
                <div key={i} style={{ background:"var(--white)", borderRadius:12, border:"1px solid var(--border)", padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <p style={{ fontSize:12, color:"var(--text3)", marginBottom:4 }}>{label}</p>
                      <p style={{ fontSize:22, fontWeight:700, color }}>{value}</p>
                      <p style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{sub}</p>
                    </div>
                    <span style={{ fontSize:22 }}>{icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card card-pad" style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Daily active users (last 7 days)</h3>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={dauData}><XAxis dataKey="day" tick={{ fontSize:11 }} /><YAxis tick={{ fontSize:11 }} /><Tooltip /><Line type="monotone" dataKey="users" stroke="#1a3a5c" strokeWidth={2.5} dot={{ fill:"#1a3a5c", r:4 }} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div className="card card-pad">
                <h3 style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Users by state</h3>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={stateData}><XAxis dataKey="state" tick={{ fontSize:10 }} /><Tooltip /><Bar dataKey="users" fill="#1a3a5c" radius={[4,4,0,0]} /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card card-pad">
                <h3 style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>Registration</h3>
                <ResponsiveContainer width="100%" height={90}>
                  <PieChart><Pie data={regData} cx="50%" cy="50%" innerRadius={25} outerRadius={42} dataKey="value">{regData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
                {regData.map((d,i) => <div key={i} style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}><div style={{ width:9, height:9, borderRadius:2, background:PIE_COLORS[i] }} /><span style={{ fontSize:10, color:"var(--text3)" }}>{d.name}: {d.value}%</span></div>)}
              </div>
            </div>
          </div>
        )}
        {section === "users" && (
          <div className="fade-in">
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <input className="input" placeholder="Search by name or phone…" style={{ flex:1 }} />
              <button className="btn btn-primary btn-sm">🔍</button>
            </div>
            <div className="card" style={{ marginBottom:12, overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid var(--border)" }}>{["Name","State","Status","Joined"].map(h => <th key={h} style={{ textAlign:"left", padding:"10px 12px", color:"var(--text3)", fontWeight:600, fontSize:11 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["Rahul Kumar","MP","Registered","2 days ago"],["Priya Singh","UP","Pending","5 days ago"],["Amit Sharma","MH","Registered","1 week ago"],["Sunita Devi","RJ","Not started","2 weeks ago"],["Vikram Patel","GJ","Registered","3 weeks ago"]].map(([name,state,status,joined],i) => (
                    <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}>
                      <td style={{ padding:"10px 12px", fontWeight:500 }}>{name}</td>
                      <td style={{ padding:"10px 12px", color:"var(--text3)" }}>{state}</td>
                      <td style={{ padding:"10px 12px" }}><span className={`badge ${status==="Registered"?"badge-green":status==="Pending"?"badge-orange":"badge-gray"}`} style={{ fontSize:10 }}>{status}</span></td>
                      <td style={{ padding:"10px 12px", color:"var(--text3)" }}>{joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-outline btn-full btn-sm">📥 Export CSV</button>
          </div>
        )}
        {section === "content" && (
          <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div className="card card-pad">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>📅 Update Election Dates</h3>
              {[["Registration Deadline","2025-10-15"],["Voting Day","2025-11-17"],["Results","2025-11-23"]].map(([label,date]) => (
                <div key={label} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ flex:1, fontSize:13 }}>{label}</span>
                  <input type="date" defaultValue={date} className="input" style={{ width:155, height:36, fontSize:13 }} />
                </div>
              ))}
              <button className="btn btn-primary btn-sm" style={{ marginTop:4 }}>Save Dates</button>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>📣 Broadcast Notification</h3>
              <textarea className="input" placeholder="Enter notification message…" style={{ height:80, resize:"none", padding:"10px 14px" }} />
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex:1 }}>🔔 Send to All</button>
                <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>👁 Preview</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ height:16 }} />
    </div>
  );
}

// ONBOARDING
function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name:"", city:"", state:"", lang:"en" });

  const states = ["Andhra Pradesh","Delhi","Gujarat","Karnataka","Madhya Pradesh","Maharashtra","Rajasthan","Tamil Nadu","Uttar Pradesh","West Bengal"];

  const steps = [
    { title:"Welcome to Bharat Votes 🇮🇳", sub:"Your complete guide to voting in India", content:(
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🗳️</div>
        <p style={{ fontSize:14, color:"var(--text3)", lineHeight:1.7 }}>Register, find your booth, ask questions, and vote with confidence.</p>
      </div>
    )},
    { title:"What's your name?", sub:"We'll personalise your experience", content:(
      <input className="input" placeholder="Enter your name" value={data.name} onChange={e => setData(d => ({...d, name:e.target.value}))} autoFocus />
    )},
    { title:"Where are you from?", sub:"Helps us show relevant booths & info", content:(
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <input className="input" placeholder="City (e.g. Indore)" value={data.city} onChange={e => setData(d => ({...d, city:e.target.value}))} />
        <select className="input" value={data.state} onChange={e => setData(d => ({...d, state:e.target.value}))}>
          <option value="">Select state…</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    )},
    { title:"Choose language", sub:"You can change this anytime", content:(
      <div style={{ display:"flex", gap:12 }}>
        {[["en","English","A"],["hi","हिंदी","अ"]].map(([l,label,ch]) => (
          <button key={l} onClick={() => setData(d => ({...d, lang:l}))} style={{ flex:1, padding:"20px 16px", borderRadius:14, border:`2px solid ${data.lang===l?"var(--primary)":"var(--border)"}`, background:data.lang===l?"#e6f1fb":"var(--white)", cursor:"pointer" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{ch}</div>
            <div style={{ fontSize:14, fontWeight:600 }}>{label}</div>
          </button>
        ))}
      </div>
    )},
  ];

  const canNext = step === 0 || (step === 1 && data.name.trim()) || step === 2 || step === 3;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:28, background:"var(--bg)" }}>
      <div style={{ display:"flex", gap:6, marginBottom:28 }}>
        {steps.map((_,i) => <div key={i} style={{ flex:1, height:4, borderRadius:4, background:i<=step?"var(--primary)":"var(--border)", transition:"background 0.3s" }} />)}
      </div>
      <h2 style={{ fontSize:22, fontWeight:700, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>{steps[step].title}</h2>
      <p style={{ fontSize:13, color:"var(--text3)", marginBottom:24 }}>{steps[step].sub}</p>
      <div style={{ flex:1 }}>{steps[step].content}</div>
      <div style={{ display:"flex", gap:10, marginTop:32 }}>
        {step > 0 && <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setStep(s=>s-1)}>← Back</button>}
        <button className="btn btn-primary" style={{ flex:2 }} disabled={!canNext} onClick={() => step < steps.length-1 ? setStep(s=>s+1) : onDone(data)}>
          {step === steps.length-1 ? "Get Started 🚀" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home", icon:"🏠" },
  { id:"steps", icon:"📋" },
  { id:"chat", icon:"💬" },
  { id:"booth", icon:"📍" },
  { id:"myths", icon:"🛡️" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [progress, setProgress] = useState([false, false, false, false, false]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const t = lang === "hi" ? hi : en;

  const ctx = { user, lang, t, progress, setProgress };

  const navLabels = { home:t.nav.home, steps:t.nav.steps, chat:t.nav.chat, booth:t.nav.booth, myths:t.nav.myths };

  if (!user) return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <OnboardingScreen onDone={(d) => { setUser({ name:d.name, city:d.city, state:d.state }); setLang(d.lang); }} />
      </div>
    </>
  );

  if (showAdmin) return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <div className="header">
          <span style={{ fontSize:20 }}>🇮🇳</span>
          <h1>Admin Dashboard</h1>
          <button className="hbtn" onClick={() => setShowAdmin(false)}>←</button>
        </div>
        <div className="screen-body"><AdminDashboard onBack={() => setShowAdmin(false)} /></div>
      </div>
    </>
  );

  const screens = { home:<HomeScreen setTab={setTab} />, steps:<JourneyScreen />, chat:<ChatScreen />, booth:<BoothScreen />, myths:<MythScreen />, timeline:<TimelineScreen /> };

  return (
    <>
      <style>{CSS}</style>
      <AppCtx.Provider value={ctx}>
        <div className="shell">
          <div className="header">
            <span style={{ fontSize:20 }}>🇮🇳</span>
            <h1>Bharat Votes</h1>
            <div className="header-right">
              <button className="lang-pill" onClick={() => setLang(l => l==="en"?"hi":"en")}>{lang==="en"?"हिं":"EN"}</button>
              <button className="hbtn" onClick={() => setShowTimeline(t => !t)} title="Timeline">📅</button>
              <button className="hbtn" onClick={() => setShowAdmin(true)} title="Admin">🔐</button>
            </div>
          </div>
          <div className="screen-body">
            {showTimeline ? <TimelineScreen /> : (screens[tab] || screens.home)}
          </div>
          <nav className="bottom-nav">
            {NAV.map(item => (
              <button key={item.id} className={`bnav-item${tab===item.id&&!showTimeline?" active":""}`} onClick={() => { setTab(item.id); setShowTimeline(false); }}>
                <span className="bnav-icon">{item.icon}</span>
                <span className="bnav-label">{navLabels[item.id]}</span>
              </button>
            ))}
          </nav>
        </div>
      </AppCtx.Provider>
    </>
  );
}
