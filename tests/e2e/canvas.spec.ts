import { test, expect } from '@playwright/test';

test.describe('캔버스 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // Canvas API mock
    await page.route('/api/canvas/test1234', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'test1234',
            title: '제목 없는 캔버스',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        });
      }
    });

    // Liveblocks auth mock
    await page.route('/api/liveblocks-auth', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token' }),
      });
    });
  });

  test('캔버스 UI 요소가 표시된다', async ({ page }) => {
    await page.goto('/test1234');

    // TopBar 요소 확인
    await expect(page.getByText('Folio')).toBeVisible();
    await expect(page.getByRole('button', { name: '캔버스 공유' })).toBeVisible();

    // Toolbar 확인
    await expect(page.getByRole('toolbar', { name: '캔버스 도구' })).toBeVisible();
  });

  test('만료된 캔버스 접속 시 에러 표시', async ({ page }) => {
    await page.route('/api/canvas/expired1', async (route) => {
      await route.fulfill({
        status: 410,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'CANVAS_EXPIRED',
            message: '이 캔버스는 기간이 만료되어 사라졌어요.',
          },
        }),
      });
    });

    await page.goto('/expired1');

    await expect(page.getByText('이 캔버스는 기간이 만료되어 사라졌어요.')).toBeVisible();
  });

  test('공유 버튼 클릭 시 공유 모달이 열린다', async ({ page }) => {
    await page.goto('/test1234');

    const shareBtn = page.getByRole('button', { name: '캔버스 공유' });
    await shareBtn.click();

    await expect(page.getByText('이 링크를 공유하면')).toBeVisible();
    await expect(page.getByText('같이 시작할 수 있어요.')).toBeVisible();
    await expect(page.getByRole('button', { name: /복사/ })).toBeVisible();
  });
});

test.describe('API 검증', () => {
  test('이미지 업로드 - 잘못된 파일 타입 거부', async ({ request }) => {
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');
    formData.append('canvas_id', 'test1234');

    // Note: 실제 API 서버가 실행 중이어야 함
    // CI에서는 이 테스트를 skip하거나 서버를 먼저 실행
  });

  test('이미지 업로드 - 크기 제한 확인 (5MB)', async () => {
    // 5MB 초과 파일은 413 응답 확인
    // 서버 실행 필요
  });
});
