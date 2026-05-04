import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure restoreChat param is preserved if it's in the 'next' URL
      const redirectUrl = new URL(next, origin);
      if (searchParams.get('restoreChat') === 'true') {
        redirectUrl.searchParams.set('restoreChat', 'true');
      }
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
