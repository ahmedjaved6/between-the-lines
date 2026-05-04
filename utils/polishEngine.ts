// Prose tools will be loaded dynamically inside the function

/**
 * Human Polish Engine. Rule-based, offline, zero AI. 
 * Write-good (MIT) + Alex (MIT) + custom cliché dictionary. 
 * This tool corrects; it never creates.
 */

export interface PolishChange {
  type: 'grammar' | 'cliche' | 'insensitive' | 'readability';
  original: string;
  suggestion: string;
  position: number;
}

export interface PolishResult {
  original: string;
  polished: string;
  changes: PolishChange[];
}

const CLICHE_DICTIONARY = [
  "at the end of the day", "think outside the box", "in this day and age", 
  "delve into", "unleash", "foster", "amplify", "synergy", "journey", 
  "unlock", "game changer", "cutting edge", "move the needle", "circle back", 
  "deep dive", "low hanging fruit", "boil the ocean", "paradigm shift", 
  "disruptive", "best in class"
];

export function polishText(rawText: string): PolishResult {
  // Load tools on demand to avoid build-time issues
  let writeGood = require('write-good');
  if (writeGood.default) writeGood = writeGood.default;
  
  let alex = require('alex');
  if (alex.default) alex = alex.default;
  
  const changes: PolishChange[] = [];
  let polished = rawText;

  // 1. Deterministic Grammar/Spelling Fixes
  // Repeated words
  polished = polished.replace(/\b(\w+)\s+\1\b/gi, '$1');
  // Double spaces
  polished = polished.replace(/  +/g, ' ');

  // 2. Write-good (Grammar & Readability)
  const wgSuggestions = writeGood(rawText);
  wgSuggestions.forEach((s: any) => {
    changes.push({
      type: 'readability',
      original: rawText.substring(s.index, s.index + s.offset),
      suggestion: "Consider revising for clarity",
      position: s.index
    });
  });

  // 3. Alex (Inclusive Language)
  const alexSuggestions = alex(rawText).messages;
  alexSuggestions.forEach((m: any) => {
    // Alex uses 1-indexed line/column, we need to map to index if possible or just store position
    // For simplicity, we'll store the column as position if line is 1
    const pos = (m.line === 1) ? m.column - 1 : 0; 
    changes.push({
      type: 'insensitive',
      original: m.actual || "detected term",
      suggestion: m.reason,
      position: pos
    });
  });

  // 4. Custom Cliché Scan
  CLICHE_DICTIONARY.forEach(cliche => {
    const regex = new RegExp(`\\b${cliche}\\b`, 'gi');
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      changes.push({
        type: 'cliche',
        original: match[0],
        suggestion: "Avoid overused cliché",
        position: match.index
      });
    }
  });

  // Sort changes by position
  changes.sort((a, b) => a.position - b.position);

  return {
    original: rawText,
    polished: polished,
    changes: changes
  };
}
