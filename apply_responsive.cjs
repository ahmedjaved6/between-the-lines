const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

// 1. Add webkit-tap-highlight-color
css = css.replace(/body\s*\{([^}]+)\}/, (match, p1) => {
    if (!p1.includes('-webkit-tap-highlight-color')) {
        return `body {${p1} -webkit-tap-highlight-color: transparent; overflow-x: hidden; }`;
    }
    return match;
});

// 2. Fix send button touch target
css = css.replace(/\.send-btn\s*\{[^}]+\}/, (match) => {
    return match.replace(/width:\s*40px;/, 'width: 44px;').replace(/height:\s*40px;/, 'height: 44px;');
});

// 3. Fluid typography for headings
// Currently h1 is already clamp(58px,8vw,100px), .reader-inner h1 is clamp(36px,5vw,60px).
// We need to ensure h2, h3 are also fluid or scale properly in media queries.

// 4. Update the media queries to ensure 320px to 4K support
let responsiveCSS = `
/* Responsive Overrides for Mobile-First & Touch */
button, select {
  min-height: 44px;
}
.nav-links li button {
  min-height: 44px;
  display: flex;
  align-items: center;
}
.tab-btn {
  min-height: 44px;
}
.chat-actions button {
  min-height: 44px;
}
input, textarea {
  min-height: 44px;
}

/* Image defaults */
img, video {
  max-width: 100%;
  height: auto;
}

/* Prevent horizontal overflow strictly */
html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

/* Navbar on very small screens (320px - 375px) */
@media (max-width: 414px) {
  #navbar {
    padding: 0 12px;
    flex-wrap: wrap;
    height: auto;
    min-height: 58px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .nav-brand {
    font-size: 16px;
  }
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
    width: 100%;
    margin-top: 8px;
  }
  .nav-links li button {
    padding: 6px 10px;
    font-size: 13px;
  }
  .hero-lantern {
    width: 100%;
    height: 300px;
  }
  .hero-h1 {
    font-size: clamp(40px, 12vw, 58px);
  }
  .promises-header h2 {
    font-size: clamp(24px, 8vw, 32px);
  }
  .reader-inner {
    padding: 40px 20px 80px;
  }
  #safety-banner {
    flex-wrap: wrap;
    padding: 10px 16px;
    text-align: center;
    justify-content: center;
    gap: 8px;
  }
  .modal-box {
    padding: 24px;
  }
  .profile-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .profile-top button {
    margin-left: 0 !important;
    margin-top: 16px;
    width: 100%;
  }
  .profile-stats {
    grid-template-columns: 1fr;
  }
  .wiz-nav {
    flex-direction: column-reverse;
    gap: 12px;
  }
  .wiz-next {
    width: 100%;
  }
  .wiz-back {
    width: 100%;
    text-align: center;
    min-height: 44px;
  }
  .chat-input-row {
    flex-direction: column;
    align-items: stretch;
  }
  .send-btn {
    width: 100% !important;
    border-radius: 4px !important;
    margin-top: 8px;
  }
}

/* Intermediate Tablet adjustments */
@media (min-width: 415px) and (max-width: 768px) {
  #navbar {
    padding: 0 16px;
  }
  .nav-links {
    gap: 2px;
  }
  .nav-links li button {
    padding: 6px 10px;
  }
  .profile-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

fs.writeFileSync('app/globals.css', css + responsiveCSS);
console.log('Appended responsive CSS.');
