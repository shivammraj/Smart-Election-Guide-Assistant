import { useState, useRef, useEffect } from 'react';
import { useLang, useUser } from '../context/AppContext.jsx';
import { sendMessage } from '../services/chatService.js';
import { voiceService } from '../services/voiceService.js';

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, padding:'12px 16px', alignItems:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'var(--text3)', animation:`wave 1s ease ${i*0.15}s infinite` }} />
      ))}
    </div>
  );
}

function ChatBubble({ msg, onCopy }) {
  const isBot = msg.role === 'assistant';
  return (
    <div style={{ display:'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom:8 }}>
      {isBot && <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, marginRight:8, flexShrink:0, marginTop:'auto' }}>🗳️</div>}
      <div style={{ maxWidth:'78%' }}>
        <div style={{
          padding:'10px 14px', borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
          background: isBot ? 'var(--white)' : 'var(--primary)',
          color: isBot ? 'var(--text)' : '#fff',
          border: isBot ? '1px solid var(--border)' : 'none',
          fontSize:14, lineHeight:1.6, whiteSpace:'pre-wrap',
        }}>{msg.content}</div>
        <div style={{ display:'flex', justifyContent: isBot?'flex-start':'flex-end', marginTop:3, gap:6 }}>
          <span style={{ fontSize:10, color:'var(--text3)' }}>{msg.time}</span>
          {isBot && <button onClick={() => onCopy(msg.content)} style={{ fontSize:10, color:'var(--text3)', background:'none', border:'none', cursor:'pointer' }}>copy</button>}
        </div>
      </div>
    </div>
  );
}

export default function ChatScreen() {
  const { t, lang } = useLang();
  const { user } = useUser();
  const [messages, setMessages] = useState([
    { role:'assistant', content: t.chat.greeting, time: new Date().toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [waveAnim, setWaveAnim] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const now = () => new Date().toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' });

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMsg = { role:'user', content:msg, time:now() };
    const history = [...messages, newMsg];
    setMessages(history);
    setLoading(true);
    const reply = await sendMessage(history.map(m => ({ role:m.role, content:m.content })), 'demo');
    setMessages(h => [...h, { role:'assistant', content:reply, time:now() }]);
    setLoading(false);
  };

  const handleVoice = () => {
    if (!voiceService.isSupported()) { alert('Voice not supported in this browser. Try Chrome.'); return; }
    if (listening) { voiceService.stopListening(); setListening(false); setWaveAnim(false); return; }
    setListening(true); setWaveAnim(true);
    voiceService.startListening(lang,
      (transcript) => { setInput(transcript); setListening(false); setWaveAnim(false); },
      () => { setListening(false); setWaveAnim(false); },
      (err) => { setListening(false); setWaveAnim(false); console.warn(err); }
    );
  };

  const copy = (text) => { navigator.clipboard?.writeText(text).catch(()=>{}); };

  return (
    <div className="screen" style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Header */}
      <div className="top-nav" style={{ flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🗳️</div>
          <div>
            <h2 style={{ color:'#fff', fontSize:16, fontWeight:700 }}>Bharat Votes AI</h2>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#5DCAA5' }} />
              <span style={{ color:'#85b7eb', fontSize:11 }}>Online · Replies instantly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflow:'auto', padding:'16px 16px 0' }}>
        {messages.map((m, i) => <ChatBubble key={i} msg={m} onCopy={copy} />)}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🗳️</div>
            <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:'18px 18px 18px 4px', overflow:'hidden' }}><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding:'10px 16px 0', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
        {t.chat.quickReplies.map((qr, i) => (
          <button key={i} onClick={() => send(qr)} className="btn btn-ghost btn-sm" style={{ flexShrink:0, fontSize:12, borderRadius:20 }}>{qr}</button>
        ))}
      </div>

      {/* Voice waveform */}
      {waveAnim && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:3, padding:'8px 16px 0', height:36 }}>
          {Array.from({length:9}).map((_,i) => (
            <div key={i} style={{ width:4, background:'var(--primary)', borderRadius:4, animation:`wave 1s ease ${i*0.1}s infinite`, height:'100%' }} />
          ))}
          <span style={{ fontSize:12, color:'var(--text3)', marginLeft:8 }}>Listening...</span>
        </div>
      )}

      {/* Input row */}
      <div style={{ padding:'10px 16px 16px', display:'flex', gap:8, flexShrink:0, background:'var(--bg)' }}>
        <input ref={inputRef} className="input" placeholder={t.chat.placeholder} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} style={{ flex:1 }} />
        <button onClick={handleVoice} style={{ width:44, height:44, borderRadius:'50%', background: listening ? '#D85A30' : 'var(--bg2)', border:'none', fontSize:20, cursor:'pointer', flexShrink:0, transition:'background 0.2s' }}>
          {listening ? '⏹' : '🎙'}
        </button>
        <button onClick={() => send()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ borderRadius:'50%', width:44, height:44, padding:0, flexShrink:0, opacity: (!input.trim()||loading)?0.5:1 }}>↑</button>
      </div>
    </div>
  );
}
