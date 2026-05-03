'use client';

export default function Footer() {
  return (
    <div className="content-with-margin">
      <div className="marginalia" aria-hidden="true"></div>
      <div className="main-content" style={{ padding: '0 0 60px 40px' }}>
        <footer>
          <span>&copy; 2026 Between the Lines. A human-first space.</span>
          <div>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Safety</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
