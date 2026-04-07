'use client';

interface User {
  nickname: string;
  color: string;
}

interface TopBarProps {
  title: string;
  users: User[];
  onShare: () => void;
  onTitleChange: (title: string) => void;
}

export default function TopBar({ title, users, onShare, onTitleChange }: TopBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
      style={{
        height: '56px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-surface)',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        className="text-lg font-bold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Folio
      </a>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-sm text-center bg-transparent border-none outline-none max-w-[200px]"
        style={{ color: 'var(--color-text-secondary)' }}
        aria-label="캔버스 제목"
      />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Avatar group */}
        <div className="flex items-center -space-x-2">
          {users.slice(0, 5).map((user, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
              style={{ backgroundColor: user.color, zIndex: 5 - i }}
              title={user.nickname}
            >
              {user.nickname.charAt(0)}
            </div>
          ))}
          {users.length > 5 && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
              }}
            >
              +{users.length - 5}
            </div>
          )}
        </div>

        {users.length > 0 && (
          <span
            className="text-xs hidden md:inline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {users.length}명이 같이 보고 있어요
          </span>
        )}

        {/* Share button */}
        <button
          onClick={onShare}
          className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-primary)' }}
          aria-label="캔버스 공유"
        >
          공유
        </button>
      </div>
    </div>
  );
}
