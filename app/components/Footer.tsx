'use client';

import { useApp } from '../context/AppContext';
import Link from 'next/link';

export default function Footer() {
  const { openModal } = useApp();
  
  return (
    <div className="content-with-margin">
      <div className="marginalia" aria-hidden="true"></div>
      <div className="main-content" style={{ padding: '0 40px 60px 40px' }}>
        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--ink-4)', borderTop: '1px dashed var(--border)', paddingTop: '30px' }}>
          <span>&copy; 2026 Between the Lines. A human-first space.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/about">About</Link>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('safety'); }}>Safety Pledge</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </footer>
      </div>
      <div className="marginalia marginalia-right" aria-hidden="true"></div>
    </div>
  );
}
