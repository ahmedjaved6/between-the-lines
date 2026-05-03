import { NextResponse } from 'next/server';

const CLICHES: Record<string, string> = {
  "at the end of the day": "ultimately",
  "think outside the box": "be creative",
  "low hanging fruit": "easy wins",
  "it is what it is": "it's unchangeable",
  "game changer": "significant shift",
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    let polished = text;

    // 1. Remove double spaces
    polished = polished.replace(/  +/g, ' ');

    // 2. Simple grammar regexes
    polished = polished.replace(/\bi is\b/gi, 'I am');
    polished = polished.replace(/\bwe was\b/gi, 'we were');
    polished = polished.replace(/\bthey was\b/gi, 'they were');
    polished = polished.replace(/\byou was\b/gi, 'you were');
    
    // 3. Flag and replace clichés
    Object.keys(CLICHES).forEach(cliche => {
      const regex = new RegExp(`\\b${cliche}\\b`, 'gi');
      polished = polished.replace(regex, CLICHES[cliche]);
    });

    // Placeholder for future local tools:
    // TODO: Integrate write-good (e.g., const suggestions = writeGood(text))
    // TODO: Integrate alex (e.g., alex.text(text))
    // TODO: Integrate languagetool-api

    return NextResponse.json({ 
      original: text,
      polished: polished
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to polish text' }, { status: 500 });
  }
}
