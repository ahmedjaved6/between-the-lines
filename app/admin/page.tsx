'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import SessionEndRitual from '../components/SessionEndRitual';
import { USE_LISTENER_SYSTEM } from '@/utils/anonymousSession';

export default function AdminPage() {
  const { supabase } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'sessions' | 'flags'>('sessions');
  const [waitingSessions, setWaitingSessions] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<any[]>([]);
  const [endingSessionId, setEndingSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (tab === 'sessions') {
        fetchSessions();
      } else {
        fetchFlags();
      }
    }
  }, [isAuthenticated, tab]);

  const fetchSessions = async () => {
    // Fetch Waiting
    const { data: waiting } = await supabase
      .from('sessions')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });
    
    if (waiting) setWaitingSessions(waiting);

    // Fetch Active
    const { data: active } = await supabase
      .from('sessions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (active) setActiveSessions(active);
  };

  const fetchFlags = async () => {
    const { data, error } = await supabase
      .from('safety_flags')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setFlaggedMessages(data);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'between-the-lines-admin-2026') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const claimSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'active', listener_name: 'Manas' })
      .eq('id', sessionId);
    
    if (!error) fetchSessions();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '100px 20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ccc' }}
          />
          <button type="submit" className="btn-ink" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>BTL Admin Dashboard</h2>
        <button 
          onClick={() => { localStorage.removeItem('admin_authenticated'); setIsAuthenticated(false); }}
          className="btn-outline"
          style={{ fontSize: '13px' }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <button 
          onClick={() => setTab('sessions')}
          style={{ 
            background: 'none', 
            fontWeight: tab === 'sessions' ? 'bold' : 'normal',
            borderBottom: tab === 'sessions' ? '2px solid var(--crimson)' : 'none',
            padding: '5px 10px'
          }}
        >
          Sessions ({waitingSessions.length} waiting, {activeSessions.length} active)
        </button>
        <button 
          onClick={() => setTab('flags')}
          style={{ 
            background: 'none', 
            fontWeight: tab === 'flags' ? 'bold' : 'normal',
            borderBottom: tab === 'flags' ? '2px solid var(--crimson)' : 'none',
            padding: '5px 10px'
          }}
        >
          Flagged Messages
        </button>
      </div>

      {tab === 'sessions' ? (
        <div style={{ display: 'grid', gap: '40px' }}>
          {/* Waiting Sessions */}
          <section>
            <h4 style={{ marginBottom: '15px', opacity: 0.6 }}>Waiting for Listener</h4>
            {waitingSessions.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--ink-3)' }}>No waiting sessions.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {waitingSessions.map(s => (
                  <div key={s.id} className="paper-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                    <div>
                      <code style={{ fontSize: '12px' }}>...{s.anonymous_token.slice(-8)}</code>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                        Waiting since {new Date(s.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => claimSession(s.id)}
                      className="btn-ink"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      Claim Session
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Sessions */}
          <section>
            <h4 style={{ marginBottom: '15px', opacity: 0.6 }}>Active Sessions</h4>
            {activeSessions.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--ink-3)' }}>No active sessions.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {activeSessions.map(s => (
                  <div key={s.id} className="paper-card" style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <code style={{ fontSize: '12px' }}>...{s.anonymous_token.slice(-8)}</code>
                        <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Listener: {s.listener_name}</div>
                      </div>
                      <button 
                        onClick={() => setEndingSessionId(s.id)}
                        className="btn-outline"
                        style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--crimson)', borderColor: 'var(--crimson)' }}
                      >
                        End Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {endingSessionId && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%' }}>
                <SessionEndRitual 
                  sessionId={endingSessionId} 
                  role="listener" 
                  onComplete={() => { setEndingSessionId(null); fetchSessions(); }} 
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>Time</th>
              <th style={{ padding: '10px' }}>Severity</th>
              <th style={{ padding: '10px' }}>Snippet</th>
              <th style={{ padding: '10px' }}>Trigger</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {flaggedMessages.map(f => (
              <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontSize: '12px' }}>{new Date(f.created_at).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>
                  <span className={`tag ${f.severity === 'high' ? 'crimson' : 'sage'}`}>{f.severity}</span>
                </td>
                <td style={{ padding: '10px', fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.message_snippet}
                </td>
                <td style={{ padding: '10px', fontSize: '13px' }}>{f.trigger_phrase}</td>
                <td style={{ padding: '10px', fontSize: '13px' }}>{f.resolved ? '✅ Resolved' : '⭕ Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
