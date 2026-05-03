'use client';

import { useState } from 'react';
import { useApp, CIRCLES, STORIES } from '../context/AppContext';

export default function CirclesPage() {
  const [tab, setTab] = useState<'upcoming' | 'my'>('upcoming');
  const { joinedCircles, joinCircle, setActiveStoryId } = useApp();

  /**
   * FUTURE-PROOFING: Circle Spot Counts
   * 
   * Current Implementation:
   * Uses AppContext and localStorage to track joined circles for the local user only.
   * This results in spot counts that are only accurate for the current user's session.
   * 
   * Multi-User Recommendation:
   * To achieve real-time accuracy across all users, replace this logic with Supabase Realtime.
   * 1. Subscribe to the 'circles' table in Supabase.
   * 2. Use a 'spots_taken' column and increment it via a database function on join.
   * 
   * Pseudocode for Realtime:
   * useEffect(() => {
   *   const channel = supabase.channel('realtime_circles')
   *     .on('postgres_changes', { event: 'UPDATE', table: 'circles' }, payload => {
   *        setCircles(current => current.map(c => c.id === payload.new.id ? payload.new : c));
   *     }).subscribe();
   *   return () => supabase.removeChannel(channel);
   * }, []);
   */

  const circles = CIRCLES.map(c => ({
    ...c,
    left: Math.max(0, c.origLeft - (joinedCircles.includes(c.id) ? 1 : 0))
  }));

  const myCircles = circles.filter(c => joinedCircles.includes(c.id));

  return (
    <div className="page-transition lantern-glow-subtle" style={{ minHeight: '100vh' }}>
      <div className="content-with-margin">
        <div className="marginalia" aria-hidden="true">
          <div className="margin-item"><i className="fas fa-fire"></i><span className="margin-label">gather</span></div>
          <div className="margin-item"><i className="fas fa-people-group"></i><span className="margin-label">8 seats</span></div>
        </div>

        <div className="main-content">
          <div className="circles-header">
            <span className="tag">Digital Campfires</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 300, marginTop: '12px' }}>
              Find your circle.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', marginTop: '8px', maxWidth: '500px' }}>
              Intimate 60-minute sessions, 8 people maximum, led by someone who has lived what you are facing.
            </p>
          </div>

          <div className="tab-row" role="tablist">
            <button 
              role="tab"
              aria-selected={tab === 'upcoming'}
              className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`} 
              onClick={() => setTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              role="tab"
              aria-selected={tab === 'my'}
              className={`tab-btn ${tab === 'my' ? 'active' : ''}`} 
              onClick={() => setTab('my')}
            >
              My Circles
            </button>
          </div>

          {tab === 'upcoming' ? (
            <div className="circles-grid">
              {circles.map((c) => {
                const joined = joinedCircles.includes(c.id);
                const full = c.left === 0;
                const urgent = c.left <= 2 && !full;
                const story = STORIES.find(s => s.circleId === c.id);
                
                return (
                  <article key={c.id} className="paper-card">
                    <div className="circle-card-header">
                      <span className="circle-guide">{c.guide}</span>
                      <span className={`spots-pill ${full ? 'full' : urgent ? 'urgent' : ''}`}>
                        {full ? 'Full' : `${c.left} of ${c.total} spots`}
                      </span>
                    </div>
                    <h3>{c.title}</h3>
                    <div className="circle-meta">
                      <div className="circle-meta-item"><i className="fas fa-calendar"></i>{c.date}</div>
                      <div className="circle-meta-item"><i className="fas fa-clock"></i>{c.time}</div>
                      <div className="circle-meta-item"><i className="fas fa-hourglass-half"></i>60 min</div>
                    </div>
                    {story && (
                      <button 
                        className="circle-story-link" 
                        onClick={() => setActiveStoryId(story.id)}
                        aria-label={`Read ${c.guide}'s story`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        ❖ Read {c.guide}'s story
                      </button>
                    )}
                    <button 
                      className={`join-btn ${joined ? 'joined' : ''}`} 
                      disabled={joined || full}
                      onClick={() => joinCircle(c.id)}
                      aria-label={joined ? "You are already in this circle" : full ? "This circle is full" : `Join circle with ${c.guide}`}
                    >
                      {joined ? (
                        <><i className="fas fa-check" style={{ marginRight: '6px' }}></i>You're in</>
                      ) : full ? (
                        'Circle Full'
                      ) : (
                        'Join Circle'
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div id="my-circles-list">
              {myCircles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><i className="fas fa-fire"></i></div>
                  <h4>No circles yet</h4>
                  <p>Find a circle that speaks to you.</p>
                </div>
              ) : (
                myCircles.map((c) => (
                  <div key={c.id} className="booked-item">
                    <h4>{c.title}</h4>
                    <p>
                      <i className="fas fa-calendar" style={{ color: 'var(--crimson)', marginRight: '5px' }}></i>
                      {c.date} &middot; {c.time} &middot; with {c.guide}
                    </p>
                    <a className="booked-link" href={c.link} target="_blank">
                      <i className="fas fa-video" style={{ marginRight: '5px' }}></i>Jitsi Meeting Link
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="marginalia marginalia-right" aria-hidden="true">
          <div className="margin-item" style={{ marginTop: '100px' }}><i className="fas fa-users-viewfinder" style={{ opacity: 0.3 }}></i></div>
          <div className="margin-item"><div style={{ width: '1px', height: '100px', background: 'var(--border)', opacity: 0.5 }}></div></div>
        </div>
      </div>
    </div>
  );
}
