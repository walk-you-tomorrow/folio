import { createServerSupabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
    const { data, error } = await supabase
      .from('canvases')
      .select('id, title, created_at, expires_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return Response.json(
        { error: { code: 'CANVAS_NOT_FOUND', message: '이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요.' } },
        { status: 404 },
      );
    }

    if (new Date(data.expires_at) < new Date()) {
      return Response.json(
        { error: { code: 'CANVAS_EXPIRED', message: '이 캔버스는 기간이 만료되어 사라졌어요.' } },
        { status: 410 },
      );
    }

    return Response.json(data);
  } catch {
    return Response.json(
      { error: { code: 'CANVAS_NOT_FOUND', message: '이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요.' } },
      { status: 404 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: '요청을 읽을 수 없었어요.' } },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('canvases')
      .update({ title: body.title })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return Response.json(
        { error: { code: 'UPDATE_FAILED', message: '제목을 바꾸지 못했어요.' } },
        { status: 400 },
      );
    }

    return Response.json(data);
  } catch {
    return Response.json(
      { error: { code: 'UPDATE_FAILED', message: '제목을 바꾸지 못했어요. 다시 시도해주세요.' } },
      { status: 500 },
    );
  }
}
