import { createServerSupabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createServerSupabase();

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
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title } = await request.json();
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from('canvases')
    .update({ title })
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
}
