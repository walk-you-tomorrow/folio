'use client';

import { useState } from 'react';

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
}

export default function NicknameModal({ onSubmit }: NicknameModalProps) {
  const [nickname, setNickname] = useState('');

  function handleSubmit() {
    onSubmit(nickname.trim() || '익명');
  }

  function handleSkip() {
    onSubmit('익명');
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                   w-[90vw] max-w-[360px] p-6 rounded-xl shadow-lg text-center"
        style={{ backgroundColor: '#FFFFFF' }}
        role="dialog"
        aria-label="닉네임 입력"
      >
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          반가워요!
        </h2>
        <p
          className="text-sm mb-5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          닉네임을 알려주세요.
        </p>

        <input
          type="text"
          maxLength={12}
          placeholder="닉네임 입력 (선택)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-3 py-2 rounded-lg border text-sm mb-4"
          style={{
            borderColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
          }}
          aria-label="닉네임"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm mb-3"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          들어가기
        </button>

        <button
          onClick={handleSkip}
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          건너뛰기
        </button>
      </div>
    </>
  );
}
