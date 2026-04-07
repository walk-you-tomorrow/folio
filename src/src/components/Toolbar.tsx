'use client';

export type Tool = 'select' | 'sticky' | 'image' | 'pan';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onImageUpload: () => void;
}

const tools: { id: Tool; label: string; icon: string; ariaLabel: string }[] = [
  { id: 'sticky', label: 'T', icon: 'T', ariaLabel: '텍스트 스티커 추가' },
  { id: 'image', label: '🖼', icon: '🖼', ariaLabel: '이미지 업로드' },
  { id: 'pan', label: '✋', icon: '✋', ariaLabel: '캔버스 이동' },
];

export default function Toolbar({ activeTool, onToolChange, onImageUpload }: ToolbarProps) {
  function handleClick(tool: Tool) {
    if (tool === 'image') {
      onImageUpload();
    }
    onToolChange(tool);
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30
                 flex items-center gap-1 px-3 py-2 rounded-xl shadow-lg"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
      role="toolbar"
      aria-label="캔버스 도구"
    >
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleClick(tool.id)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-colors duration-200"
          style={{
            backgroundColor: activeTool === tool.id ? '#EBF0FF' : 'transparent',
            color: activeTool === tool.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          }}
          aria-label={tool.ariaLabel}
          aria-pressed={activeTool === tool.id}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
