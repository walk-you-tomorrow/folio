'use client';

interface ZoomControlProps {
  level: number;
  onZoom: (delta: number) => void;
  onReset: () => void;
}

export default function ZoomControl({ level, onZoom, onReset }: ZoomControlProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-1 p-1 rounded-lg"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <button
        onClick={() => onZoom(0.1)}
        className="w-8 h-8 flex items-center justify-center text-sm rounded"
        style={{ color: 'var(--color-text-secondary)' }}
        aria-label="줌 인"
      >
        +
      </button>
      <button
        onClick={onReset}
        className="w-8 h-6 flex items-center justify-center text-xs rounded"
        style={{ color: 'var(--color-text-secondary)' }}
        aria-label="줌 리셋"
      >
        {Math.round(level * 100)}%
      </button>
      <button
        onClick={() => onZoom(-0.1)}
        className="w-8 h-8 flex items-center justify-center text-sm rounded"
        style={{ color: 'var(--color-text-secondary)' }}
        aria-label="줌 아웃"
      >
        −
      </button>
    </div>
  );
}
