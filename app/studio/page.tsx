'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useAuth } from '@/app/providers';

export default function StoryStudioPage() {
  const { session } = useAuth();
  const { publishStory, publishedStories } = useApp();
  const [formData, setFormData] = useState({ heading: '', body: '', conclusion: '' });
  const [polishMode, setPolishMode] = useState(false);
  const [polishedData, setPolishedData] = useState({ heading: '', body: '', conclusion: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePolish = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.body }),
      });
      const data = await response.json();
      setPolishedData({
        ...formData,
        body: data.polished,
      });
      setPolishMode(true);
    } catch (error) {
      console.error('Failed to polish', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = (data: typeof formData) => {
    publishStory({ ...data, date: new Date().toLocaleDateString() });
    setFormData({ heading: '', body: '', conclusion: '' });
    setPolishMode(false);
  };

  return (
    <div className="content-with-margin page-transition">
      <div className="marginalia" aria-hidden="true">
        <div className="margin-item"><i className="fas fa-quill"></i><span className="margin-label">studio</span></div>
        <div className="margin-item"><i className="fas fa-wand-magic-sparkles"></i><span className="margin-label">sculpt</span></div>
      </div>
      <div className="main-content">
        <div className="stories-header">
          <span className="tag">Story Studio</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 300, marginTop: '12px' }}>
            Sculpt your narrative.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--ink-3)', marginTop: '8px', maxWidth: '500px' }}>
            Transform your lived experience into a lighthouse for others.
          </p>
        </div>

        {!polishMode ? (
          <div className="paper-card" style={{ maxWidth: '700px' }}>
            {isLoading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,240,228,0.8)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="breath-ring"></div>
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <label className="refl-prompt">Heading</label>
              <input name="heading" value={formData.heading} onChange={handleChange} placeholder="The moment everything changed..." />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="refl-prompt">Body</label>
              <textarea name="body" value={formData.body} onChange={handleChange} placeholder="The night we crossed, the stars were different..." style={{ minHeight: '150px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="refl-prompt">Conclusion</label>
              <textarea name="conclusion" value={formData.conclusion} onChange={handleChange} placeholder="Now I see that every ending is a beginning..." />
            </div>
            <div className="hero-btns" style={{ justifyContent: 'flex-start' }}>
              <button className="btn-ink" onClick={() => handlePublish(formData)}>Publish as raw</button>
              <button className="btn-outline" onClick={handlePolish} disabled={isLoading}>
                {isLoading ? 'Sculpting...' : 'Polish with Human Engine'}
              </button>
            </div>
          </div>
        ) : (
          <div className="paper-card" style={{ maxWidth: '900px' }}>
            <h3 style={{ marginBottom: '20px' }}>Human Engine Polish</h3>
            <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'auto', background: '#fff', maxWidth: '100vw' }}>
              <ReactDiffViewer 
                oldValue={formData.body} 
                newValue={polishedData.body} 
                splitView={true}
                styles={{
                  variables: {
                    light: {
                      diffViewerBackground: 'var(--paper)',
                      addedBackground: 'rgba(80,140,90,0.15)',
                      addedColor: '#3d7048',
                      removedBackground: 'rgba(178,59,59,0.15)',
                      removedColor: 'var(--crimson)',
                    }
                  }
                }}
              />
            </div>
            {!session && (
              <div className="tag crimson" style={{ marginTop: '20px', width: '100%', textAlign: 'center', padding: '10px' }}>
                ❖ Please sign in on the Profile page to save your story to the cloud.
              </div>
            )}
            <div className="hero-btns" style={{ marginTop: '30px', justifyContent: 'flex-start' }}>
              <button className="btn-ink" onClick={() => handlePublish(polishedData)}>Accept & Publish</button>
              <button className="btn-outline" onClick={() => setPolishMode(false)}>Discard & Edit</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '60px' }}>
          <h3>Your Published Stories</h3>
          {publishedStories.length === 0 ? (
            <p className="margin-note">You haven't published any stories yet.</p>
          ) : (
            <div className="stories-grid" style={{ marginTop: '20px' }}>
              {publishedStories.map((s, i) => (
                <div key={i} className="paper-card">
                  <span className="tag">{s.date}</span>
                  <h4>{s.heading}</h4>
                  <p className="story-excerpt">{s.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
