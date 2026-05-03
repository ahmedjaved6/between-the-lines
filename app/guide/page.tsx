'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';

const WIZ_STEPS = [
  { eye: 'Step 1 of 4 &mdash; The Unheard Voice', title: 'The moment no one heard you.', hint: 'Describe a time you felt profoundly unheard or misunderstood. What was the context? Who was there? What went unsaid &mdash; and what would you have needed them to understand?', key: 'w1' },
  { eye: 'Step 2 of 4 &mdash; The Tipping Point', title: 'When something crystallised.', hint: 'What was the single moment &mdash; an image, a sentence, a silence &mdash; when your understanding of yourself or your situation shifted? Not necessarily a good moment. Just a clear one.', key: 'w2' },
  { eye: 'Step 3 of 4 &mdash; The Sensory Anchor', title: 'What your body remembers.', hint: 'What smell, sound, texture, temperature, or image stays with you from that period? Our editors use sensory detail to ground stories in the body, not just the mind. Surprise us.', key: 'w3' },
  { eye: 'Step 4 of 4 &mdash; Your Gift Forward', title: 'Why you want to share this.', hint: 'Who do you imagine reading your story? What do you want them to feel or understand that no one told you when you were in it?', key: 'w4', last: true },
];

export default function GuidePage() {
  const { applyAsGuide, guideApplied } = useApp();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wStep, setWStep] = useState(0);
  const [wAnswers, setWAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);

  const handleNext = () => {
    const currentKey = WIZ_STEPS[wStep].key;
    if (!wAnswers[currentKey]?.trim()) return;
    
    if (WIZ_STEPS[wStep].last) {
      if (!consent) return;
      applyAsGuide();
    } else {
      setWStep(wStep + 1);
    }
  };

  return (
    <div className="content-with-margin page-transition">
      <div className="marginalia" aria-hidden="true">
        <div className="margin-item"><i className="fas fa-feather-alt"></i><span className="margin-label">apply</span></div>
        <div className="margin-item"><i className="fas fa-seedling"></i><span className="margin-label">grow</span></div>
      </div>
      <div className="main-content">
        <div className="guide-header">
          <span className="tag">The Guide Journey</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 300, marginTop: '12px' }}>
            Your story is<br />a lighthouse.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--ink-3)', maxWidth: '500px', marginTop: '12px', lineHeight: 1.7 }}>
            You've survived something. You've rebuilt. Now you can show others they can too &mdash; not by having answers, but by having walked the path.
          </p>
        </div>

        <div className="guide-journey">
          <div className="paper-card j-step">
            <div className="j-num"><i className="fas fa-book-reader"></i></div>
            <h4>Reader</h4>
            <p>Explore stories and join Circles. No pressure, no commitment.</p>
          </div>
          <div className="paper-card j-step current">
            <div className="j-num"><i className="fas fa-ear-listen"></i></div>
            <h4>Listener</h4>
            <p>Volunteer as a peer supporter in SafeChat sessions.</p>
          </div>
          <div className="paper-card j-step">
            <div className="j-num"><i className="fas fa-fire"></i></div>
            <h4>Guide</h4>
            <p>Share your sculpted story. Lead your own Circles.</p>
          </div>
        </div>

        {!guideApplied ? (
          <>
            <div className="guide-cta-block">
              <h3>Story Alchemist's Toolkit</h3>
              <p>Your story will be shaped by one of our human editors through four questions and a 15-minute call. You retain full approval rights before anything is published.</p>
              <button className="btn-ink" onClick={() => setWizardOpen(true)}>
                <i className="fas fa-feather-alt" style={{ marginRight: '8px' }}></i>Apply to be a Guide
              </button>
            </div>

            {wizardOpen && (
              <div id="wizard-container" className="open">
                <button className="wiz-reset" onClick={() => setWizardOpen(false)}>&#x2715; Cancel</button>
                <div className="wiz-progress">
                  {WIZ_STEPS.map((_, i) => (
                    <div key={i} className={`wiz-bar ${i <= wStep ? 'lit' : ''}`}></div>
                  ))}
                </div>
                <span className="wiz-eyebrow">{WIZ_STEPS[wStep].eye}</span>
                <h3 className="wiz-title">{WIZ_STEPS[wStep].title}</h3>
                <p className="wiz-hint">{WIZ_STEPS[wStep].hint}</p>
                <textarea 
                  className="wiz-textarea" 
                  placeholder="Write freely&hellip;" 
                  value={wAnswers[WIZ_STEPS[wStep].key] || ''}
                  onChange={(e) => setWAnswers({ ...wAnswers, [WIZ_STEPS[wStep].key]: e.target.value })}
                />
                
                {WIZ_STEPS[wStep].last && (
                  <div className="consent-check">
                    <input type="checkbox" id="w-consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <label htmlFor="w-consent">I understand that my story will be shaped by a human editor through a 15-minute conversation, and I will retain full approval rights before anything is published.</label>
                  </div>
                )}

                <div className="wiz-nav">
                  {wStep > 0 ? (
                    <button className="wiz-back" onClick={() => setWStep(wStep - 1)}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                  ) : <div />}
                  <button className="wiz-next" onClick={handleNext}>
                    {WIZ_STEPS[wStep].last ? 'Submit Application' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="wiz-success">
            <div className="tick-ico"><i className="fas fa-check-circle"></i></div>
            <h3>Your application is with us.</h3>
            <p>Our team will read your responses with care and reach out within 7 days. Your story is safe with us.</p>
          </div>
        )}
      </div>
    </div>
  );
}
