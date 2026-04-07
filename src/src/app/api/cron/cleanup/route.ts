import { createServerSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerSupabase();

  // 만료된 캔버스 조회
  const { data: expiredCanvases, error: fetchError } = await supabase
    .from('canvases')
    .select('id')
    .lt('expires_at', new Date().toISOString());

  if (fetchError || !expiredCanvases) {
    return Response.json({ error: 'Failed to fetch expired canvases' }, { status: 500 });
  }

  let deletedCount = 0;

  for (const canvas of expiredCanvases) {
    // Supabase Storage 이미지 삭제
    const { data: files } = await supabase.storage
      .from('uploads')
      .list(canvas.id);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${canvas.id}/${f.name}`);
      await supabase.storage.from('uploads').remove(filePaths);
    }

    // 캔버스 레코드 삭제
    await supabase.from('canvases').delete().eq('id', canvas.id);
    deletedCount++;
  }

  return Response.json({
    message: `${deletedCount}개의 만료된 캔버스를 정리했어요.`,
    deleted: deletedCount,
  });
}
