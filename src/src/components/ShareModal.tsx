'use client';

import { useState } from 'react';
import Toast from './Toast';

interface ShareModalProps {
  canvasId: string;
  onClose: () => void;
}

export default function ShareModal({ canvasId, onClose }: ShareModalProps) {
  const [toast, setToast] = useState<string | null>(null);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${canvasId}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setToast('링크가 복사됐어요. 이제 보내기만 하면 돼요.');
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                   w-[90vw] max-w-[420px] p-6 rounded-xl shadow-lg"
        style={{ backgroundColor: '#FFFFFF' }}
        role="dialog"
        aria-label="캔버스 공유"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="닫기"
        >
          ✕
        </button>

        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          이 링크를 공유하면
        </h2>
        <p
          className="text-base mb-5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          같이 시작할 수 있어요.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 rounded-lg text-sm border"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            복사
          </button>
        </div>

        <p
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          링크를 가진 누구나 편집할 수 있어요.
        </p>
      </div>

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </>
  );
}
