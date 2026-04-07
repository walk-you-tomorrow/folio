-- Folio DB Schema for Supabase
-- Run this in Supabase SQL Editor

-- 캔버스 테이블
CREATE TABLE IF NOT EXISTS canvases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '제목 없는 캔버스',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- 인덱스: 만료일 기준 정리용
CREATE INDEX IF NOT EXISTS idx_canvases_expires_at ON canvases (expires_at);

-- RLS (Row Level Security)
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능 (MVP: 인증 없음)
CREATE POLICY "Public read" ON canvases FOR SELECT USING (true);
CREATE POLICY "Public insert" ON canvases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON canvases FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON canvases FOR DELETE USING (true);

-- Storage bucket for image uploads
-- Run in Supabase Dashboard > Storage > New Bucket
-- Bucket name: uploads
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- 만료 캔버스 정리 함수 (Cron용)
CREATE OR REPLACE FUNCTION cleanup_expired_canvases()
RETURNS void AS $$
BEGIN
  DELETE FROM canvases WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- pg_cron으로 매일 실행 (Supabase Pro 필요, 또는 Vercel Cron 사용)
-- SELECT cron.schedule('cleanup-expired', '0 0 * * *', 'SELECT cleanup_expired_canvases()');
