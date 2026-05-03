'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from '@/app/providers';

const CHAT_SCRIPT = [
  { text: "Hello. I'm Arjun, and I'm here with you today. You don't have to perform or explain everything at once. How are you feeling right now \u2014 in just a few words?", delay: 0 },
  { text: "Thank you for trusting me with this. That takes courage. I'm here \u2014 take your time.", delay: 1800 },
  { text: "I hear you. What you're feeling makes complete sense. Can I ask \u2014 is this something that's been sitting with you for a while, or did something specific happen recently?", delay: 2600 },
  { text: "That's really significant. It sounds like a lot has been landing on you at once. When you carry all of that, how does it feel in your body \u2014 more like weight, or noise, or something else entirely?", delay: 3000 },
  { text: "You described that really clearly. A lot of people who've come through what you're describing have found their way through it. You're not alone in this room, and you're not alone out there either.", delay: 2800 },
];

export default function ChatPage() {
  const { session, supabase } = useAuth();
  const [screen, setScreen] = useState<'start' | 'connecting' | 'active' | 'post'>('start');
  const [openingThought, setOpeningThought] = useState('');
  const [messages, setMessages] = useState<{ dir: 'in' | 'out'; text: string; time: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatIdx, setChatIdx] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [showAuthNudge, setShowAuthNudge] = useState(false);
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startChat = () => {
    setScreen('connecting');
    setTimeout(() => {
      setScreen('active');
      setChatIdx(1);
      const now = new Date();
      const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
      setMessages([{ dir: 'in', text: CHAT_SCRIPT[0].text, time }]);
      
      if (openingThought.trim()) {
        setTimeout(() => {
          const outTime = new Date();
          const outTimeString = outTime.getHours() + ':' + String(outTime.getMinutes()).padStart(2, '0');
          setMessages(prev => [...prev, { dir: 'out', text: openingThought.trim(), time: outTimeString }]);
          triggerReply(1);
        }, 1800);
      }
    }, 3000);
  };

  const triggerReply = (currentIdx: number) => {
    if (currentIdx >= CHAT_SCRIPT.length) return;
    setIsTyping(true);
    const reply = CHAT_SCRIPT[currentIdx];
    
    setTimeout(() => {
      setIsTyping(false);
      const now = new Date();
      const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
      setMessages(prev => [...prev, { dir: 'in', text: reply.text, time }]);
      setChatIdx(currentIdx + 1);
    }, reply.delay || 2000);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const now = new Date();
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    setMessages(prev => [...prev, { dir: 'out', text: inputValue, time }]);
    setInputValue('');
    
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    if (newCount % 5 === 0 && !session) {
      setShowAuthNudge(true);
    }
    
    triggerReply(chatIdx);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleMagicLinkSignIn = async () => {
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (!error) setMagicLinkSent(true);
  };

  return (
    <div className="chat-outer page-transition">
      {showAuthNudge && !session && (
        <div className="paper-card" style={{ marginBottom: '20px', border: '1px solid var(--crimson)', padding: '15px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>
            ❖ <strong>Would you like to save this conversation and continue?</strong> Sign in with Google or email magic link.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn-ink" onClick={handleGoogleSignIn} style={{ padding: '6px 12px', fontSize: '13px' }}>
              Sign in with Google
            </button>
            {!magicLinkSent ? (
              <div style={{ display: 'flex', gap: '5px' }}>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '180px', padding: '6px', fontSize: '13px' }}
                />
                <button className="btn-outline" onClick={handleMagicLinkSignIn} style={{ padding: '6px 12px', fontSize: '13px' }}>
                  Send magic link
                </button>
              </div>
            ) : (
              <span className="tag sage">Magic link sent! Check your inbox.</span>
            )}
            <button 
              className="wiz-back" 
              onClick={() => setShowAuthNudge(false)}
              style={{ textDecoration: 'none', fontSize: '13px' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {screen === 'start' && (
        <div id="chat-start-screen">
          <div className="chat-start-hero" style={{ marginBottom: '28px' }}>
            <span className="tag">Anonymous SafeChat</span>
            <h2 style={{ marginTop: '14px' }}>What's weighing<br />on you today?</h2>
            <p style={{ marginTop: '12px' }}>Connected with a trained peer Listener. Anonymous. Moderated. Human.</p>
            <span className="listener-avail">
              <i className="fas fa-circle" style={{ fontSize: '8px', color: '#4ade80', marginRight: '5px' }}></i>
              3 Listeners available now &middot; Avg response &lt; 2 min
            </span>
          </div>
          <div className="chat-start-area">
            <label style={{ fontFamily: 'var(--hand)', fontSize: '19px', color: 'var(--ink-3)', display: 'block', marginBottom: '8px' }}>
              Begin here, or just press Connect
            </label>
            <textarea 
              placeholder="I've been carrying something&hellip;" 
              value={openingThought}
              onChange={(e) => setOpeningThought(e.target.value)}
            />
            <button className="chat-connect-btn" onClick={startChat}>
              <i className="fas fa-link" style={{ marginRight: '8px' }}></i>Connect with a Listener
            </button>
            <p className="chat-disclaimer">
              Peer support space, not a crisis service. Conversations are moderated for safety. In immediate danger? <a href="#">See helplines</a>.
            </p>
          </div>
        </div>
      )}

      {screen === 'connecting' && (
        <div id="connecting-screen" style={{ display: 'block' }}>
          <div className="breath-ring" aria-hidden="true"></div>
          <h3>Finding your Listener&hellip;</h3>
          <p>Anonymous &middot; Safe &middot; Human</p>
        </div>
      )}

      {screen === 'active' && (
        <div id="chat-screen" style={{ display: 'block' }}>
          <div className="chat-header">
            <div className="listener-info">
              <div className="listener-av" aria-hidden="true"><i className="fas fa-user"></i></div>
              <div className="listener-name-block">
                <div className="name">Arjun L.</div>
                <div className="sub">Peer Listener &middot; Active now</div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="flag-btn"><i className="fas fa-flag"></i> Red Flag</button>
              <button className="end-chat-btn" onClick={() => setScreen('post')}>End Chat</button>
            </div>
          </div>
          <div className="chat-messages" id="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`bubble bubble-${m.dir}`}>
                {m.text}
                <div className="bubble-time">{m.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-bub">
                <div className="tdot"></div>
                <div className="tdot"></div>
                <div className="tdot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <div className="chat-input-row" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Type your message&hellip;" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{ flex: 1, borderRadius: '4px' }}
              />
              <button className="send-btn" onClick={sendMessage} style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '0 20px', borderRadius: '4px' }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <p className="chat-disclaimer" style={{ marginTop: '10px' }}>
              Peer support only. Messages monitored for safety. <a href="#">Safety Pledge</a>
            </p>
          </div>
        </div>
      )}

      {screen === 'post' && (
        <div id="post-chat-screen" style={{ display: 'block' }}>
          <div className="post-icon"><i className="fas fa-heart"></i></div>
          <h3>Thank you for being here.</h3>
          <p>It takes something to say it out loud, even here.</p>
          <div className="listener-note-card">
            "You are not alone. Others have walked this exact path &mdash; and found light on the other side. The courage it takes to say something, even here, is not small."
            <span className="note-attr">&mdash; Arjun L., Peer Listener</span>
          </div>
          <div className="post-btns">
            <button className="btn-ink" onClick={() => window.location.href='/circles'}>Explore Circles</button>
            <button className="btn-outline" onClick={() => window.location.href='/profile'}>Write a Reflection</button>
          </div>
        </div>
      )}
    </div>
  );
}
