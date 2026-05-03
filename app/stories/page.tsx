'use client';

import { useApp, STORIES } from '../context/AppContext';

export default function StoriesPage() {
  const { setActiveStoryId } = useApp();

  return (
    <div className="page-transition lantern-glow-subtle" style={{ minHeight: '100vh' }}>
      <div className="content-with-margin">
        <div className="marginalia" aria-hidden="true">
          <div className="margin-item"><i className="fas fa-book-open"></i><span className="margin-label">sculpted</span></div>
          <div className="margin-item"><i className="fas fa-heart"></i><span className="margin-label">real</span></div>
        </div>
        
        <div className="main-content">
          <div className="stories-header">
            <span className="tag">Sculpted Narratives</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 300, marginTop: '12px' }}>
              Stories that<br />stay with you.
            </h2>
          </div>
          <div className="stories-grid">
            {STORIES.map((s) => (
              <article 
                key={s.id} 
                className="paper-card story-card" 
                onClick={() => setActiveStoryId(s.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className={`tag ${s.tagCls}`} style={{ marginBottom: '12px' }}>{s.tag}</span>
                <h3 style={{ marginBottom: '8px' }}>{s.title}</h3>
                <p className="story-excerpt">{s.excerpt}</p>
                <span className="read-link">
                  Read full story <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="marginalia marginalia-right" aria-hidden="true">
          <div className="margin-item" style={{ marginTop: '120px' }}><i className="fas fa-feather-alt" style={{ opacity: 0.3 }}></i></div>
          <div className="margin-item"><div style={{ width: '1px', height: '100px', background: 'var(--border)', opacity: 0.5 }}></div></div>
        </div>
      </div>
    </div>
  );
}
