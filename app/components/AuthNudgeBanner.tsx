'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AuthNudgeBannerProps {
  messageCount: number;
  onSignIn: () => void;
  onDismiss: () => void;
}

export default function AuthNudgeBanner({ messageCount, onSignIn, onDismiss }: AuthNudgeBannerProps) {
  const [email, setEmail] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const supabase = createClient();

  const shouldShow = messageCount >= 5 && (messageCount === 5 || messageCount % 10 === 0);

  if (!shouldShow) return null;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?restoreChat=true`,
      },
    });

    if (!error) {
      setIsMagicLinkSent(true);
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="paper-card nudge-banner" style={{ 
      marginBottom: '20px', 
      border: '1px solid var(--crimson)', 
      padding: '15px',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <p style={{ 
        fontFamily: 'var(--hand)', 
        fontSize: '18px', 
        marginBottom: '12px',
        color: 'var(--ink)'
      }}>
        ❖ You've shared a lot. Want to save this conversation?
      </p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-ink" onClick={onSignIn} style={{ padding: '8px 16px', fontSize: '14px' }}>
          Save with Google
        </button>
        
        {!isMagicLinkSent ? (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '180px', 
                padding: '8px', 
                fontSize: '14px',
                border: '1px solid var(--border)'
              }}
              required
            />
            <button type="submit" className="btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Save with email
            </button>
          </form>
        ) : (
          <span className="tag sage" style={{ padding: '8px 12px' }}>Check your inbox for the magic link!</span>
        )}
        
        <button 
          onClick={onDismiss}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--ink-3)', 
            textDecoration: 'underline', 
            cursor: 'pointer',
            fontSize: '13px',
            marginLeft: '10px'
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
