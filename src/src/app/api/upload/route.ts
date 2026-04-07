import { createServerSupabase } from '@/lib/supabase';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const canvasId = formData.get('canvas_id') as string | null;

  if (!file || !canvasId) {
    return Response.json(
      { error: { code: 'MISSING_FIELDS', message: '파일과 캔버스 정보가 필요해요.' } },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: { code: 'INVALID_TYPE', message: '이 파일은 올릴 수 없어요. JPG, PNG, GIF, WebP만 가능해요.' } },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: { code: 'FILE_TOO_LARGE', message: '파일이 너무 커요. 5MB 이하로 올려주세요.' } },
      { status: 413 },
    );
  }

  const supabase = createServerSupabase();
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${canvasId}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return Response.json(
      { error: { code: 'UPLOAD_FAILED', message: '이미지를 올리지 못했어요. 다시 시도해주세요.' } },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return Response.json(
    {
      url: urlData.publicUrl,
      original_name: file.name,
      size: file.size,
    },
    { status: 201 },
  );
}
