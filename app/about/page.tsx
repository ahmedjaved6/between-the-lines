'use client';

export default function AboutPage() {
  return (
    <div className="page-transition">
      <div id="hero">
        <div className="hero-lantern" aria-hidden="true"></div>
        <span className="hero-eyebrow">a human-first space for lived experience</span>
        <h1 className="hero-h1">Between<br /><em>the Lines</em></h1>
        <p className="hero-sub">Where every scar becomes a lantern for someone still in the dark. Real stories. Real people. Real circles.</p>
        <div className="hero-btns">
          <button className="btn-ink" onClick={() => window.location.href='/stories'}>
            Explore Stories <i className="fas fa-arrow-right" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
          </button>
          <button className="btn-outline">Join the Waitlist</button>
        </div>
      </div>
      
      <div className="content-with-margin">
        <div className="marginalia" aria-hidden="true">
          <div className="margin-item"><i className="fas fa-quill"></i><span className="margin-label">human</span></div>
          <div className="margin-item"><i className="fas fa-mask"></i><span className="margin-label">safe</span></div>
          <div className="margin-item"><i className="fas fa-fire"></i><span className="margin-label">circles</span></div>
        </div>
        <div className="main-content">
          <div id="promises">
            <div className="promises-header">
              <h2>Three promises<br />we keep.</h2>
              <span className="promises-annotation">always, without exception</span>
            </div>
            <div className="promises-grid">
              <div className="paper-card promise-card">
                <div className="promise-icon-wrap"><i className="fas fa-pen-nib"></i></div>
                <h3>Human-Only Stories</h3>
                <p>Every word lived, felt, and approved by the person who experienced it. Our editors shape &mdash; never replace &mdash; the authentic voice. No AI-generated content. Ever.</p>
                <div className="margin-note">&✦; no algorithm can feel what you feel</div>
              </div>
              <div className="paper-card promise-card">
                <div className="promise-icon-wrap"><i className="fas fa-mask"></i></div>
                <h3>Anonymous Safe Space</h3>
                <p>You choose your name. You control what you share. Every conversation is moderated. Your identity is never exposed without explicit, informed consent.</p>
                <div className="margin-note">\u2726 you are a feeling, not a face</div>
              </div>
              <div className="paper-card promise-card">
                <div className="promise-icon-wrap"><i className="fas fa-fire"></i></div>
                <h3>Guided Digital Campfires</h3>
                <p>Intimate 60-minute circles of 8, led by someone who has walked your path. Not therapy. Not a webinar. A circle of shared humanity \u2014 safe, structured, deeply human.</p>
                <div className="margin-note">\u2726 fire warms, and so do stories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
