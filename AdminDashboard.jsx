import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ADMIN_PASS = 'admin123';

const stateData = [
  { state:'MP', users:4200 }, { state:'UP', users:3800 }, { state:'MH', users:2900 },
  { state:'RJ', users:2100 }, { state:'DL', users:1850 }, { state:'KA', users:1600 },
];
const dauData = [
  { day:'Mon', users:820 }, { day:'Tue', users:940 }, { day:'Wed', users:1100 },
  { day:'Thu', users:880 }, { day:'Fri', users:1250 }, { day:'Sat', users:1480 }, { day:'Sun', users:1190 },
];
const regData = [{ name:'Completed', value:62 }, { name:'In Progress', value:24 }, { name:'Not Started', value:14 }];
const PIE_COLORS = ['#5DCAA5','#378ADD','#D3D1C7'];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background:'var(--white)', borderRadius:12, border:'1px solid var(--border)', padding:'14px 16px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:4 }}>{label}</p>
          <p style={{ fontSize:24, fontWeight:700, color: color || 'var(--text)' }}>{value}</p>
          {sub && <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{sub}</p>}
        </div>
        <span style={{ fontSize:24 }}>{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const login = () => {
    if (pw === ADMIN_PASS) { setAuthed(true); setPwErr(''); }
    else setPwErr('Incorrect password. (Try: admin123)');
  };

  if (!authed) return (
    <div className="screen" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <div style={{ width:'100%', maxWidth:320 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
          <h2 style={{ fontSize:20, fontWeight:700 }}>Admin Access</h2>
          <p style={{ fontSize:13, color:'var(--text3)', marginTop:4 }}>Restricted to authorised personnel</p>
        </div>
        {pwErr && <div style={{ background:'#FCEBEB', color:'#A32D2D', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:12 }}>{pwErr}</div>}
        <input className="input" type="password" placeholder="Enter admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==='Enter' && login()} style={{ marginBottom:12 }} />
        <button className="btn btn-primary btn-full" onClick={login}>Login</button>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop:8 }}>← Back to app</button>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="top-nav">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ color:'#fff', fontSize:18, fontWeight:700 }}>Admin Dashboard</h1>
            <p style={{ color:'#85b7eb', fontSize:12 }}>Bharat Votes · Real-time analytics</p>
          </div>
          <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ fontSize:12 }}>← Exit</button>
        </div>
        <div style={{ display:'flex', gap:6, marginTop:12 }}>
          {['overview','users','content'].map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{ flex:1, padding:'7px', borderRadius:8, border:'none', background: activeSection===s ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', color:'#fff', fontWeight: activeSection===s ? 600 : 400, fontSize:12, cursor:'pointer', textTransform:'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {activeSection === 'overview' && (
          <div className="fade-in">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              <StatCard icon="👥" label="Total Users" value="16,350" sub="+234 today" color="#185FA5" />
              <StatCard icon="✅" label="Registered" value="62%" sub="10,137 users" color="#3B6D11" />
              <StatCard icon="📍" label="Booth Searches" value="4,280" sub="This week" color="#854F0B" />
              <StatCard icon="🔔" label="Notif Rate" value="71%" sub="Open rate" color="#0F6E56" />
            </div>

            <div className="card card-pad" style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Daily active users (last 7 days)</h3>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={dauData}>
                  <XAxis dataKey="day" tick={{ fontSize:11 }} />
                  <YAxis tick={{ fontSize:11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#1a3a5c" strokeWidth={2.5} dot={{ fill:'#1a3a5c', r:4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              <div className="card card-pad">
                <h3 style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Users by state</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={stateData}>
                    <XAxis dataKey="state" tick={{ fontSize:10 }} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#1a3a5c" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card card-pad">
                <h3 style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>Registration status</h3>
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={regData} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value">
                      {regData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:4 }}>
                  {regData.map((d, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:PIE_COLORS[i], flexShrink:0 }} />
                      <span style={{ fontSize:11, color:'var(--text3)' }}>{d.name}: {d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="fade-in">
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input className="input" placeholder="Search by name or phone..." style={{ flex:1 }} />
              <button className="btn btn-primary btn-sm">🔍</button>
            </div>
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--border)' }}>
                      {['Name','State','Status','Joined'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'10px 12px', color:'var(--text3)', fontWeight:600, fontSize:11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Rahul Kumar','MP','Registered','2 days ago'],
                      ['Priya Singh','UP','Pending','5 days ago'],
                      ['Amit Sharma','MH','Registered','1 week ago'],
                      ['Sunita Devi','RJ','Not started','2 weeks ago'],
                      ['Vikram Patel','GJ','Registered','3 weeks ago'],
                    ].map(([name,state,status,joined], i) => (
                      <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'10px 12px', fontWeight:500 }}>{name}</td>
                        <td style={{ padding:'10px 12px', color:'var(--text3)' }}>{state}</td>
                        <td style={{ padding:'10px 12px' }}>
                          <span className={`badge ${status==='Registered'?'badge-green':status==='Pending'?'badge-orange':'badge-gray'}`} style={{ fontSize:10 }}>{status}</span>
                        </td>
                        <td style={{ padding:'10px 12px', color:'var(--text3)' }}>{joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button className="btn btn-outline btn-full btn-sm">📥 Export to CSV</button>
          </div>
        )}

        {activeSection === 'content' && (
          <div className="fade-in" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card card-pad">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>📅 Update election dates</h3>
              {[['Registration Deadline','2025-10-15'],['Voting Day','2025-11-17'],['Results','2025-11-23']].map(([label, date]) => (
                <div key={label} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                  <span style={{ flex:1, fontSize:13 }}>{label}</span>
                  <input type="date" defaultValue={date} className="input" style={{ width:160, height:36, fontSize:13 }} />
                </div>
              ))}
              <button className="btn btn-primary btn-sm" style={{ marginTop:4 }}>Save Dates</button>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>📣 Broadcast notification</h3>
              <textarea className="input" placeholder="Enter notification message..." style={{ height:80, resize:'none', padding:'10px 14px' }} />
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex:1 }}>🔔 Send to all users</button>
                <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>👁 Preview</button>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>🛡️ Manage myths</h3>
              <p style={{ fontSize:12, color:'var(--text3)', marginBottom:10 }}>12 myths currently active</p>
              <button className="btn btn-outline btn-sm btn-full">+ Add new myth</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ height:16 }} />
    </div>
  );
}
