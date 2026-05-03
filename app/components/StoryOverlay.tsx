'use client';

import { useApp, STORIES } from '../context/AppContext';
import Link from 'next/link';

export default function StoryOverlay() {
  const { activeStoryId, setActiveStoryId } = useApp();

  if (activeStoryId === null) return null;

  const story = STORIES.find((s) => s.id === activeStoryId);
  if (!story) return null;

  return (
    <div id="story-overlay" className="open" role="dialog" aria-modal="true" aria-label="Story Reader">
      <button 
        className="reader-close-btn" 
        onClick={() => setActiveStoryId(null)} 
        aria-label="Close story"
      >
        <i className="fas fa-times"></i> Close
      </button>
      
      <div className="reader-inner">
        <button 
          className="reader-back" 
          onClick={() => setActiveStoryId(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <i className="fas fa-arrow-left"></i> Back to Stories
        </button>
        
        <span className={`tag reader-tag ${story.tagCls}`}>{story.tag}</span>
        
        <h1 style={{ marginTop: '12px' }}>{story.title}</h1>
        
        <div className="story-body" style={{ marginTop: '40px' }}>
          {story.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        
        <div className="editorial-note">
          ❖ This story was sculpted by our human editors from {story.guideName}'s own words. 
          No AI was used in its creation. {story.guideName} reviewed and approved every sentence before publication.
        </div>
        
        <div className="guide-bio-card">
          <span className="eyebrow">Meet the Guide</span>
          <h3>{story.guideName}</h3>
          <p>{story.guideBio}</p>
          <Link href="/circles" onClick={() => setActiveStoryId(null)}>
            <button className="btn-ink">
              Join a Circle with {story.guideName} <i className="fas fa-arrow-right" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
