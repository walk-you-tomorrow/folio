export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      <p
        className="text-lg mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        이 캔버스를 찾을 수 없어요.
      </p>
      <p
        className="text-sm mb-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        링크가 맞는지 확인해보세요.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-lg text-white font-semibold"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        새 캔버스 만들기 →
      </a>
    </main>
  );
}
