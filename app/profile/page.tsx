'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '@/app/providers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function ProfilePage() {
  const { session, supabase } = useAuth();
  const { profile, setProfile, joinedCircles, reflections, addReflection, isListener, setIsListener, guideApplied } = useApp();
  const [nameInput, setNameInput] = useState('');
  const [reflInput, setReflInput] = useState('');
  const [showOrient, setShowOrient] = useState(false);

  if (!session) {
    return (
      <div className="profile-outer page-transition">
        <div className="profile-setup-scr" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="empty-icon"><i className="fas fa-user-lock"></i></div>
          <h2 style={{ textAlign: 'center' }}>Sign in to Between the Lines</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px' }}>Save your reflections, join circles, and sculpted stories in the cloud.</p>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['google']}
            magicLink={true}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined}
          />
          {!profile && (
            <div style={{ marginTop: '40px', borderTop: '1px dashed var(--border)', paddingTop: '20px' }}>
              <p style={{ fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>Or continue anonymously with a pseudonym:</p>
              <div className="pname-wrap">
                <input 
                  type="text" 
                  placeholder="e.g. Sunflower, River&hellip;" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
                <button className="btn-ink" style={{ width: '100%' }} onClick={() => nameInput && setProfile({ name: nameInput })}>
                  Set Pseudonym
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const displayName = session.user.user_metadata.full_name || session.user.email?.split('@')[0] || profile?.name || 'Explorer';

  return (
    <div className="profile-outer page-transition">
      <div id="profile-ready-scr">
        <div className="profile-top">
          <div className="profile-av"><i className="fas fa-user"></i></div>
          <div className="profile-meta">
            <h2>{displayName}</h2>
            <div className="role-tag">{isListener ? 'Listener' : guideApplied ? 'Guide Applicant' : 'Reader'}</div>
          </div>
          <button 
            className="btn-outline" 
            onClick={() => supabase.auth.signOut()} 
            style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px' }}
          >
            Logout
          </button>
        </div>

        <div className="profile-stats">
          <div className="stat-cell">
            <div className="stat-num">{joinedCircles.length}</div>
            <div className="stat-label">Circles</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">{reflections.length}</div>
            <div className="stat-label">Reflections</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">{guideApplied ? '1' : '&mdash;'}</div>
            <div className="stat-label">Stories</div>
          </div>
        </div>

        <div className="journal-card">
          <h3>Reflection Journal</h3>
          <span className="caption">Private. Stored only on your device.</span>
          <label className="refl-prompt">What is one thing you're carrying from today's Circle?</label>
          <textarea 
            placeholder="Write freely&hellip;" 
            value={reflInput}
            onChange={(e) => setReflInput(e.target.value)}
          />
          <button className="btn-ink" onClick={() => { if(reflInput) { addReflection(reflInput); setReflInput(''); } }}>
            Save Reflection
          </button>
          
          <div id="reflections-list" style={{ marginTop: '20px' }}>
            {reflections.length === 0 ? (
              <p style={{ fontFamily: 'var(--hand)', fontSize: '19px', color: 'var(--ink-4)', fontStyle: 'italic' }}>
                Your reflections will appear here.
              </p>
            ) : (
              reflections.map((r, i) => (
                <div key={i} className="refl-item">
                  <div className="refl-date">{r.date}</div>
                  <div className="refl-text">"{r.text}"</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="listener-card">
          <h3>{isListener ? 'You are a Listener \u2756' : 'Become a Listener'}</h3>
          <p>
            {isListener 
              ? 'Thank you for volunteering. Your role in the SafeChat queue is active.' 
              : 'Listeners hold space for others in SafeChat. A volunteer role \u2014 no experience needed, just presence.'}
          </p>
          
          {showOrient && !isListener && (
            <div className="listener-orient" style={{ display: 'block' }}>
              <strong>Listener Orientation (Brief)</strong><br /><br />
              Your role is to hold space \u2014 not to solve, advise, or fix.<br />
              \u00b7 Listen with full presence. Reflect back what you hear.<br />
              \u00b7 Never share personal details outside this platform.<br />
              \u00b7 If someone is in crisis, use the Red Flag button immediately.<br />
              \u00b7 You can step back at any time. No judgment.<br /><br />
              By accepting, you agree to the Listener Code of Conduct.
            </div>
          )}

          <button 
            className="btn-ink" 
            style={isListener ? { background: 'var(--paper-3)', color: 'var(--ink-3)', boxShadow: 'inset 0 0 0 1px var(--border-2)' } : {}}
            onClick={() => {
              if (isListener) {
                setIsListener(false);
              } else if (!showOrient) {
                setShowOrient(true);
              } else {
                setIsListener(true);
                setShowOrient(false);
              }
            }}
          >
            {isListener ? 'Step Back from Listener Role' : showOrient ? 'Accept & Become a Listener' : 'Volunteer as a Listener'}
          </button>
        </div>
      </div>
    </div>
  );
}
