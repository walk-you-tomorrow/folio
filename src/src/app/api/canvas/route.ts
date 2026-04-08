import { createServerSupabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST() {
  let supabase;
  try {
    supabase = createServerSupabase();
  } catch {
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: '서버 설정을 확인하고 있어요. 잠시 후 다시 시도해주세요.' } },
      { status: 500 },
    );
  }

  try {
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
  } catch {
    return Response.json(
      { error: { code: 'CREATE_FAILED', message: '캔버스를 만들지 못했어요. 다시 시도해주세요.' } },
      { status: 500 },
    );
  }
}
