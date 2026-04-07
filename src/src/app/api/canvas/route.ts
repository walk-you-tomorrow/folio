import { createServerSupabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST() {
  const supabase = createServerSupabase();
  const id = nanoid(8);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('canvases')
    .insert({
      id,
      title: '제목 없는 캔버스',
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    // Retry once on unique constraint violation (nanoid collision)
    if (error.code === '23505') {
      const retryId = nanoid(8);
      const { data: retryData, error: retryError } = await supabase
        .from('canvases')
        .insert({
          id: retryId,
          title: '제목 없는 캔버스',
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (retryError) {
        return Response.json(
          { error: { code: 'CREATE_FAILED', message: '캔버스를 만들지 못했어요. 다시 시도해주세요.' } },
          { status: 500 },
        );
      }
      return Response.json(retryData, { status: 201 });
    }

    return Response.json(
      { error: { code: 'CREATE_FAILED', message: '캔버스를 만들지 못했어요. 다시 시도해주세요.' } },
      { status: 500 },
    );
  }

  return Response.json(data, { status: 201 });
}
