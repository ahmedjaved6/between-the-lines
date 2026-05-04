'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SessionEndRitualProps {
  sessionId: string;
  role: 'user' | 'listener';
  onComplete?: () => void;
}

export default function SessionEndRitual({ sessionId, role, onComplete }: SessionEndRitualProps) {
  const [step, setScreen] = useState<'note' | 'farewell'>(role === 'listener' ? 'note' : 'farewell');
  const [note, setNote] = useState('');
  const [sessionData, setSessionData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    if (role === 'user') {
      const fetchSession = async () => {
        const { data } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
        if (data) setSessionData(data);
      };
      fetchSession();

      // Subscribe to session changes
      const channel = supabase
        .channel(`session_end_${sessionId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
          setSessionData(payload.new);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [sessionId, role]);

  const handleSendNote = async () => {
    if (!note.trim()) return;
    const { error } = await supabase
      .from('sessions')
      .update({ 
        status: 'ended', 
        listener_note: note, 
        ended_at: new Date().toISOString() 
      })
      .eq('id', sessionId);
    
    if (!error) {
      if (onComplete) onComplete();
    }
  };

  const saveAsImage = () => {
    // Simplified canvas drawing
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#faf9f6'; // Alabaster
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#333';
      ctx.font = '24px serif';
      ctx.fillText('A Note for You', 50, 50);
      ctx.font = 'italic 20px serif';
      const lines = note.match(/.{1,50}(\s|$)/g) || [note];
      lines.forEach((line, i) => ctx.fillText(line, 50, 100 + (i * 30)));
      
      const link = document.createElement('a');
      link.download = `btl-note-${sessionId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (role === 'listener' && step === 'note') {
    return (
      <div className="paper-card" style={{ padding: '30px', maxWidth: '600px', margin: '20px auto' }}>
        <h3 style={{ marginBottom: '15px' }}>End the Session</h3>
        <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginBottom: '15px' }}>
          Write a 2-5 sentence note for this person. Be present, be kind, be real.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type your note here..."
          style={{ 
            width: '100%', 
            height: '150px', 
            fontFamily: 'var(--hand)', 
            fontSize: '20px', 
            padding: '15px', 
            border: '1px solid var(--border)',
            marginBottom: '20px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-ink" onClick={handleSendNote}>Send Note & End Session</button>
          <button className="btn-outline" onClick={onComplete}>Cancel</button>
        </div>
      </div>
    );
  }

  if (role === 'user' && sessionData?.status === 'ended') {
    return (
      <div className="farewell-overlay" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        background: 'rgba(0,0,0,0.8)', zIndex: 1000, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
      }}>
        <div className="paper-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div className="post-icon" style={{ fontSize: '40px', color: 'var(--crimson)', marginBottom: '20px' }}>
            <i className="fas fa-heart"></i>
          </div>
          <p style={{ 
            fontFamily: 'var(--hand)', 
            fontSize: '24px', 
            lineHeight: '1.4', 
            color: 'var(--ink)',
            marginBottom: '30px',
            fontStyle: 'italic'
          }}>
            "{sessionData.listener_note}"
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-ink" onClick={saveAsImage}>Save as Image</button>
            <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: '10px' }}>
              ❖ This note will disappear in 24 hours
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => window.location.href='/circles'}>Explore Circles</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => window.location.href='/profile'}>Write Reflection</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
