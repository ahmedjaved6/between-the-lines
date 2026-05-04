import { NextResponse } from 'next/server';
import { polishText } from '@/utils/polishEngine';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData || (now - limitData.lastReset) > 60000) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (limitData.count >= 10) {
    return true;
  }

  limitData.count++;
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const result = polishText(text);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to polish text' }, { status: 500 });
  }
}
