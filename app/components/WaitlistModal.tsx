'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function WaitlistModal() {
  const { closeModal, addToWaitlist } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addToWaitlist(email);
      setSubmitted(true);
    }
  };

  return (
    <div className="modal-overlay open" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal} aria-label="Close"><i className="fas fa-times"></i></button>
        <div className="modal-icon"><i className="fas fa-envelope-open-text"></i></div>
        {!submitted ? (
          <>
            <h3>Join the Waitlist</h3>
            <p>We're opening carefully, one circle at a time. Drop your email and we'll reach out personally.</p>
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                className="modal-input"
                style={{ marginBottom: '14px' }}
              />
              <button type="submit" className="modal-primary">Reserve My Spot</button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-tick"><i className="fas fa-check-circle"></i></div>
            <h4>You're on the list.</h4>
            <p>We'll reach out personally. No newsletters. Just a human message.</p>
            <button className="modal-primary" style={{ marginTop: '20px' }} onClick={closeModal}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
