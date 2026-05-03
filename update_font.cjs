const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// Update font family
css = css.replace(/--hand:\s*[^;]+;/, "--hand: 'Great Vibes', 'Alex Brush', 'Dancing Script', cursive;");

// Update font sizes for all blocks containing var(--hand)
css = css.replace(/([^{]+)\{([^}]+)\}/g, (match, selector, rules) => {
    if (rules.includes('var(--hand)')) {
        // Find font-size: Xpx and bump it by 4px
        rules = rules.replace(/font-size:\s*(\d+(\.\d+)?)px/g, (m, size) => {
            let newSize = parseFloat(size) + 4;
            return `font-size: ${newSize}px`;
        });
        return `${selector}{${rules}}`;
    }
    return match;
});

// There is also an inline style in app/page.tsx:
// <label style={{ fontFamily: 'var(--hand)', fontSize: '15px', color: 'var(--ink-3)', display: 'block', marginBottom: '8px' }}>
let pageTsx = fs.readFileSync('app/page.tsx', 'utf8');
pageTsx = pageTsx.replace(/fontFamily:\s*'var\(--hand\)',\s*fontSize:\s*'(\d+)px'/g, (m, size) => {
    let newSize = parseInt(size) + 4;
    return `fontFamily: 'var(--hand)', fontSize: '${newSize}px'`;
});
fs.writeFileSync('app/page.tsx', pageTsx);

fs.writeFileSync('app/globals.css', css);
console.log('Updated --hand font and sizes.');
