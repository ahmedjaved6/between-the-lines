const fs = require('fs');
const refHTML = fs.readFileSync('reference.html', 'utf8');
const globalsCSS = fs.readFileSync('app/globals.css', 'utf8');

const styleBlockMatch = refHTML.match(/<style>([\s\S]*?)<\/style>/);
if (!styleBlockMatch) { console.log("No style block found"); process.exit(0); }

const refCSS = styleBlockMatch[1];
const refSelectors = [...refCSS.matchAll(/([.#][a-zA-Z0-9_-]+)\s*\{/g)].map(m => m[1]);
const globalSelectors = [...globalsCSS.matchAll(/([.#][a-zA-Z0-9_-]+)\s*\{/g)].map(m => m[1]);

const missing = refSelectors.filter(s => !globalSelectors.includes(s) && !['.page', '.page.active', '#navbar'].includes(s));
console.log("Missing selectors in globals.css:");
console.log([...new Set(missing)].join(', '));
