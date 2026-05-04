'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useAuth } from '@/app/providers';

export const USE_REAL_POLISH = false; // Feature flag

export default function StoryStudioPage() {
  const { session } = useAuth();
  const { publishStory, publishedStories } = useApp();
  const [formData, setFormData] = useState({ heading: '', body: '', conclusion: '' });
  const [polishMode, setPolishMode] = useState(false);
  const [polishedData, setPolishedData] = useState({ heading: '', body: '', conclusion: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'diff' | 'polished'>('diff');
  const [suggestedChanges, setSuggestedChanges] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePolish = async () => {
    if (!USE_REAL_POLISH) {
      // Mock diff logic
      setPolishedData({
        ...formData,
        body: formData.body.replace(/very/g, 'significantly').replace(/good/g, 'exceptional')
      });
      setSuggestedChanges([
        { type: 'readability', original: 'very', suggestion: 'significantly', position: 0 },
        { type: 'readability', original: 'good', suggestion: 'exceptional', position: 10 }
      ]);
      setPolishMode(true);
      setViewMode('diff');
      return;
    }

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
      setSuggestedChanges(data.changes || []);
      setPolishMode(true);
      setViewMode('diff');
    } catch (error) {
      console.error('Failed to polish', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectChange = (index: number) => {
    setSuggestedChanges(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = (data: typeof formData) => {
    publishStory({ ...data, date: new Date().toLocaleDateString() });
    setFormData({ heading: '', body: '', conclusion: '' });
    setPolishMode(false);
  };

  return (
    <div className="page-transition lantern-glow-subtle" style={{ minHeight: '100vh' }}>
      <div className="content-with-margin">
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
                <label className="refl-prompt" style={{ display: 'block', marginBottom: '8px' }}>Heading</label>
                <input name="heading" value={formData.heading} onChange={handleChange} placeholder="The moment everything changed..." aria-label="Story Heading" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="refl-prompt" style={{ display: 'block', marginBottom: '8px' }}>Body</label>
                <textarea name="body" value={formData.body} onChange={handleChange} placeholder="The night we crossed, the stars were different..." style={{ minHeight: '150px' }} aria-label="Story Body" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="refl-prompt" style={{ display: 'block', marginBottom: '8px' }}>Conclusion</label>
                <textarea name="conclusion" value={formData.conclusion} onChange={handleChange} placeholder="Now I see that every ending is a beginning..." aria-label="Story Conclusion" />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Human Engine Polish</h3>
                <div className="hero-btns" style={{ gap: '5px' }}>
                  <button className={`tab-btn ${viewMode === 'raw' ? 'active' : ''}`} onClick={() => setViewMode('raw')} style={{ padding: '4px 12px', fontSize: '12px' }}>Raw</button>
                  <button className={`tab-btn ${viewMode === 'diff' ? 'active' : ''}`} onClick={() => setViewMode('diff')} style={{ padding: '4px 12px', fontSize: '12px' }}>Diff</button>
                  <button className={`tab-btn ${viewMode === 'polished' ? 'active' : ''}`} onClick={() => setViewMode('polished')} style={{ padding: '4px 12px', fontSize: '12px' }}>Polished</button>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'auto', background: '#fff', minHeight: '200px' }}>
                {viewMode === 'diff' && (
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
                )}
                {viewMode === 'raw' && (
                  <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'var(--ink-3)' }}>{formData.body}</div>
                )}
                {viewMode === 'polished' && (
                  <div style={{ padding: '20px', whiteSpace: 'pre-wrap' }}>{polishedData.body}</div>
                )}
              </div>

              {USE_REAL_POLISH && suggestedChanges.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Suggested Improvements ({suggestedChanges.length})</h4>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {suggestedChanges.map((change, i) => (
                      <div key={i} className="paper-card" style={{ padding: '12px', borderLeft: `4px solid var(--${change.type === 'cliche' ? 'crimson' : 'sage'})`, background: '#faf9f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className={`tag ${change.type === 'cliche' ? 'crimson' : 'sage'}`} style={{ fontSize: '10px', marginBottom: '5px' }}>{change.type}</span>
                            <div style={{ fontSize: '13px' }}>
                              Found: <span style={{ textDecoration: 'line-through', color: 'var(--ink-3)' }}>"{change.original}"</span>
                            </div>
                            <div style={{ fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
                              {change.suggestion}
                            </div>
                          </div>
                          <button 
                            className="btn-outline" 
                            onClick={() => rejectChange(i)}
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!session && (
                <div className="tag crimson" style={{ marginTop: '20px', width: '100%', textAlign: 'center', padding: '10px' }}>
                  ❖ Please sign in on the Profile page to save your story to the cloud.
                </div>
              )}
              <div className="hero-btns" style={{ marginTop: '30px', justifyContent: 'flex-start' }}>
                <button className="btn-ink" onClick={() => handlePublish(viewMode === 'raw' ? formData : polishedData)}>Accept & Publish</button>
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

        <div className="marginalia marginalia-right" aria-hidden="true">
          <div className="margin-item" style={{ marginTop: '140px' }}><i className="fas fa-magic" style={{ opacity: 0.3 }}></i></div>
          <div className="margin-item"><div style={{ width: '1px', height: '100px', background: 'var(--border)', opacity: 0.5 }}></div></div>
        </div>
      </div>
    </div>
  );
}
