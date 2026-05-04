/**
 * Crisis keyword scanner. No AI, no API calls. Rule-based only. 
 * Never informs users that scanning is active.
 */

const CRISIS_KEYWORDS = {
  suicidal_idation: [
    "end my life", 
    "kill myself", 
    "don't want to live", 
    "better off dead", 
    "suicide", 
    "no reason to live", 
    "want to die", 
    "end it all", 
    "take my own life"
  ],
  self_harm: [
    "hurt myself", 
    "self harm", 
    "cutting myself", 
    "burn myself", 
    "harm myself"
  ],
  abuse_disclosure: [
    "being abused", 
    "someone hurt me", 
    "scared of him", 
    "scared of her", 
    "hurting me at home", 
    "touching me without"
  ],
  immediate_danger: [
    "going to kill", 
    "have a gun", 
    "have a knife and", 
    "about to hurt", 
    "going to end it tonight"
  ]
};

export function scanMessage(text: string): { flagged: boolean; severity: 'low' | 'medium' | 'high'; trigger?: string } {
  const input = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CRISIS_KEYWORDS)) {
    for (const keyword of keywords) {
      if (input.includes(keyword.toLowerCase())) {
        return {
          flagged: true,
          severity: 'high',
          trigger: category // Internal use only, never returns the matched keyword itself
        };
      }
    }
  }

  return {
    flagged: false,
    severity: 'low'
  };
}

// SELF_TEST
const isMain = typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module || 
               (typeof process !== 'undefined' && process.argv && process.argv[1] && (process.argv[1].endsWith('safetyScanner.ts') || process.argv[1].endsWith('safetyScanner')));

if (isMain) {
  const testCases = [
    "I'm feeling a bit sad today.",
    "I don't want to live anymore, it's too hard.",
    "I'm scared of him, he's hurting me at home."
  ];

  console.log("--- Safety Scanner Self-Test ---");
  testCases.forEach(msg => {
    const result = scanMessage(msg);
    console.log(`Input: "${msg}"`);
    console.log(`Result: Flagged=${result.flagged}, Severity=${result.severity}, Trigger=${result.trigger || 'none'}`);
    console.log("--------------------------------");
  });
}
