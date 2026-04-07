import { test, expect } from '@playwright/test';

test.describe('홈 페이지', () => {
  test('랜딩 페이지가 올바르게 표시된다', async ({ page }) => {
    await page.goto('/');

    // 태그라인 확인
    await expect(page.locator('h1')).toContainText('Folio');
    await expect(page.getByText('Your thoughts, unfolded together.')).toBeVisible();

    // 서브 카피 확인
    await expect(page.getByText('로그인도, 설치도, 준비도 없어요.')).toBeVisible();

    // CTA 버튼 확인
    const ctaButton = page.getByRole('button', { name: '새 캔버스 만들기' });
    await expect(ctaButton).toBeVisible();

    // How it works 섹션 확인
    await expect(page.getByText('링크를 만들어요')).toBeVisible();
    await expect(page.getByText('공유해요')).toBeVisible();
    await expect(page.getByText('함께 올려요')).toBeVisible();
    await expect(page.getByText('실시간으로 봐요')).toBeVisible();

    // Footer 확인
    await expect(page.getByText('© 2026 Folio')).toBeVisible();
  });

  test('CTA 버튼 클릭 시 로딩 상태로 전환된다', async ({ page }) => {
    await page.goto('/');

    // API mock - canvas 생성
    await page.route('/api/canvas', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test1234',
          title: '제목 없는 캔버스',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    const ctaButton = page.getByRole('button', { name: '새 캔버스 만들기' });
    await ctaButton.click();

    // 로딩 텍스트 확인
    await expect(page.getByText('캔버스 펼치는 중이에요...')).toBeVisible();
  });

  test('브랜드 컬러가 올바르게 적용되어 있다', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.getByRole('button', { name: '새 캔버스 만들기' });
    const bgColor = await ctaButton.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );

    // #3B6FFF = rgb(59, 111, 255)
    expect(bgColor).toBe('rgb(59, 111, 255)');
  });
});

test.describe('404 페이지', () => {
  test('존재하지 않는 경로에서 적절한 메시지를 표시한다', async ({ page }) => {
    // 존재하지 않는 캔버스 접속 시 API mock
    await page.route('/api/canvas/nonexist', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'CANVAS_NOT_FOUND',
            message: '이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요.',
          },
        }),
      });
    });

    await page.goto('/nonexist');

    await expect(page.getByText('이 캔버스를 찾을 수 없어요')).toBeVisible();
    await expect(page.getByText('새 캔버스 만들기 →')).toBeVisible();
  });
});
