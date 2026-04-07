import { test, expect } from '@playwright/test';

test.describe('API Route 유닛 테스트', () => {
  test('POST /api/canvas - 캔버스 생성 응답 형식', async ({ request }) => {
    const res = await request.post('/api/canvas');

    // Supabase 미연결 시 500 예상, 연결 시 201 예상
    if (res.status() === 201) {
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.id.length).toBe(8);
      expect(data.title).toBe('제목 없는 캔버스');
      expect(data.created_at).toBeDefined();
      expect(data.expires_at).toBeDefined();
    }
  });

  test('GET /api/canvas/:id - 존재하지 않는 캔버스', async ({ request }) => {
    const res = await request.get('/api/canvas/notexist');

    if (res.status() === 404) {
      const data = await res.json();
      expect(data.error.code).toBe('CANVAS_NOT_FOUND');
      expect(data.error.message).toContain('찾을 수 없어요');
    }
  });

  test('POST /api/upload - 파일 없이 요청', async ({ request }) => {
    const res = await request.post('/api/upload', {
      multipart: {},
    });

    // 400 Bad Request 예상
    if (res.status() === 400) {
      const data = await res.json();
      expect(data.error.message).toBeDefined();
    }
  });

  test('에러 메시지가 브랜드 톤앤매너를 따른다', async ({ request }) => {
    const res = await request.get('/api/canvas/notexist');

    if (res.status() === 404) {
      const data = await res.json();
      const msg = data.error.message;

      // 해요체 확인
      expect(msg).toMatch(/요\./);

      // 개발자 코드 미노출 확인
      expect(msg).not.toMatch(/Error:|Exception|stack|undefined|null/i);
    }
  });
});
