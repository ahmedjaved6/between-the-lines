'use client';
import { useApp } from '../context/AppContext';

interface RedFlagModalProps {
  onResume: () => void;
}

export default function RedFlagModal({ onResume }: RedFlagModalProps) {
  const { closeModal } = useApp();

  const handleResume = () => {
    onResume();
    closeModal();
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ color: 'var(--crimson)' }}><i className="fas fa-flag"></i></div>
        <h3>A moderator has been notified.</h3>
        <p style={{ color: 'var(--crimson)' }}>Help is on the way. A human moderator has been alerted.</p>
        <p>If in immediate danger, call emergency services or a helpline now:</p>
        <div className="helpline-list">
          <div className="helpline-row"><span>iCall (India)</span><strong>9152987821</strong></div>
          <div className="helpline-row"><span>Vandrevala Foundation</span><strong>1860-2662-345</strong></div>
          <div className="helpline-row"><span>Samaritans (UK)</span><strong>116 123</strong></div>
        </div>
        <button className="modal-primary" style={{ marginTop: '20px', background: 'var(--paper-2)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--border-2)' }} onClick={handleResume}>
          Resume Chat
        </button>
      </div>
    </div>
  );
}
