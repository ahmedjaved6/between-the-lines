'use client';
import { useApp } from '../context/AppContext';

export default function SafetyModal() {
  const { closeModal } = useApp();

  return (
    <div className="modal-overlay open" onClick={closeModal}>
      <div className="modal-box" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal} aria-label="Close"><i className="fas fa-times"></i></button>
        <div className="modal-icon"><i className="fas fa-shield-halved"></i></div>
        <h3>Our Safety Pledge</h3>
        <p>Between the Lines is a peer support and storytelling space — not a mental health service, therapy, or crisis intervention. We take safety seriously.</p>
        <ul style={{ fontSize: '14px', color: 'var(--ink-2)', paddingLeft: '18px', lineHeight: 2, marginBottom: '4px' }}>
          <li>All SafeChat conversations are monitored for safety signals.</li>
          <li>Red Flag alerts route immediately to a human moderator.</li>
          <li>Guides are vetted and trained in trauma-informed facilitation.</li>
          <li>No real identifiers shared without explicit consent.</li>
        </ul>
        <div className="helpline-list">
          <p>If you are in crisis, please reach out:</p>
          <div className="helpline-row"><span>iCall (India)</span><strong>9152987821</strong></div>
          <div className="helpline-row"><span>Vandrevala Foundation</span><strong>1860-2662-345</strong></div>
          <div className="helpline-row"><span>Samaritans (UK)</span><strong>116 123</strong></div>
          <div className="helpline-row"><span>Crisis Text Line (US)</span><strong>Text HOME to 741741</strong></div>
          <div className="helpline-row"><span>Lifeline (Australia)</span><strong>13 11 14</strong></div>
        </div>
      </div>
    </div>
  );
}
