'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch('/api/canvas', { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      router.push(`/${data.id}`);
    } catch {
      alert('캔버스를 만들지 못했어요. 다시 시도해주세요.');
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <section className="text-center max-w-xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}
        >
          Folio
        </h1>
        <p
          className="text-xl md:text-2xl font-medium mb-6"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Your thoughts, unfolded together.
        </p>
        <p
          className="text-base md:text-lg mb-10 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          로그인도, 설치도, 준비도 없어요.
          <br />
          링크 하나로 캔버스를 열고,
          <br />
          지금 이 순간의 생각을 다 같이 모아보세요.
        </p>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 text-white font-semibold text-base
                     rounded-lg px-8 py-3 transition-all duration-200
                     hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: loading ? '#6B6B80' : 'var(--color-primary)',
            height: '48px',
          }}
          aria-label="새 캔버스 만들기"
        >
          {loading ? '캔버스 펼치는 중이에요...' : '새 캔버스 만들기 →'}
        </button>
      </section>

      {/* How it works */}
      <section className="mt-20 max-w-2xl mx-auto w-full">
        <h2
          className="text-center text-sm font-semibold mb-8 uppercase tracking-wider"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { step: '①', label: '링크를 만들어요' },
            { step: '②', label: '공유해요' },
            { step: '③', label: '함께 올려요' },
            { step: '④', label: '실시간으로 봐요' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-2">
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--color-primary)' }}
              >
                {item.step}
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-auto py-8 text-center text-xs"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        © 2026 Folio
      </footer>
    </main>
  );
}
