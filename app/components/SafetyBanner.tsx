'use client';

export default function SafetyBanner() {
  return (
    <>
      <div id="safety-banner" role="contentinfo">
        <i className="fas fa-shield-halved"></i>
        <em>Human-first space. No AI content.</em>
        <span className="banner-sep">&mdash;</span>
        <a href="#">See Safety Pledge</a>
        <span className="banner-sep">&mdash;</span>
        <span>Crisis? iCall: <strong style={{ color: 'var(--crimson)' }}>9152987821</strong></span>
      </div>
      <div style={{ height: '44px' }} aria-hidden="true"></div>
    </>
  );
}
