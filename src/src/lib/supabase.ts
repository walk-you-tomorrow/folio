import { createClient } from '@supabase/supabase-js';

// Server-side only - called lazily to avoid build-time errors when env vars are missing
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase 환경 변수가 설정되지 않았어요. .env.local을 확인해주세요.');
  }

  return createClient(url, key, {
    db: { schema: 'public' },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(3000) }),
    },
  });
}
