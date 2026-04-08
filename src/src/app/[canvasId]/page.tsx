'use client';

import { use, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { LiveblocksProvider, RoomProvider, useOthers, useSelf, useStorage, useMutation } from '@liveblocks/react';
import { LiveMap } from '@liveblocks/client';
import type { CanvasMeta, CanvasElement } from '@/lib/types';
import { AVATAR_COLORS } from '@/lib/types';
import TopBar from '@/components/TopBar';
import Toolbar from '@/components/Toolbar';
import type { Tool } from '@/components/Toolbar';
import ZoomControl from '@/components/ZoomControl';
import ShareModal from '@/components/ShareModal';
import NicknameModal from '@/components/NicknameModal';
import Toast from '@/components/Toast';

// Dynamic import for Konva (SSR 불가)
const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });

function CanvasRoom({ canvasId }: { canvasId: string }) {
  const [canvasMeta, setCanvasMeta] = useState<CanvasMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [showShare, setShowShare] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const others = useOthers();
  const self = useSelf();

  // Fetch canvas metadata
  useEffect(() => {
    async function fetchCanvas() {
      try {
        const res = await fetch(`/api/canvas/${canvasId}`);
        if (res.status === 404) {
          setError('이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요.');
          return;
        }
        if (res.status === 410) {
          setError('이 캔버스는 기간이 만료되어 사라졌어요.');
          return;
        }
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCanvasMeta(data);
      } catch {
        setError('캔버스를 불러오지 못했어요. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }
    fetchCanvas();
  }, [canvasId]);

  // Check if first visit (show nickname or share modal)
  useEffect(() => {
    if (!loading && canvasMeta) {
      const visited = sessionStorage.getItem(`folio-visited-${canvasId}`);
      if (!visited) {
        // Check if creator (came from home page)
        const isCreator = sessionStorage.getItem(`folio-created-${canvasId}`);
        if (isCreator) {
          setShowShare(true);
          sessionStorage.removeItem(`folio-created-${canvasId}`);
        } else {
          setShowNickname(true);
        }
        sessionStorage.setItem(`folio-visited-${canvasId}`, 'true');
      }
    }
  }, [loading, canvasMeta, canvasId]);

  // Image upload handler
  const addElement = useMutation(({ storage }, element: CanvasElement) => {
    storage.get('elements').set(element.id, element);
  }, []);

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('canvas_id', canvasId);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        setToast(data.error?.message || '이미지를 올리지 못했어요.');
        return;
      }
      const data = await res.json();

      const newElement: CanvasElement = {
        id: crypto.randomUUID(),
        type: 'image',
        position_x: 200,
        position_y: 200,
        width: 300,
        height: 200,
        content: {
          url: data.url,
          original_name: data.original_name,
        },
        z_index: 999,
        created_by: 'me',
      };
      addElement(newElement);
    } catch {
      setToast('이미지를 올리지 못했어요. 다시 시도해주세요.');
    }
  }

  function handleFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).slice(0, 5).forEach(handleImageUpload);
    e.target.value = '';
    setActiveTool('select');
  }

  // Drag and drop
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    files.slice(0, 5).forEach(handleImageUpload);
  }

  function handleTitleChange(title: string) {
    setCanvasMeta((prev) => (prev ? { ...prev, title } : prev));
    // Debounced save
    fetch(`/api/canvas/${canvasId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  }

  // Users list for TopBar
  const users = others.map((other) => ({
    nickname: (other.info as { nickname?: string })?.nickname || '익명',
    color: (other.info as { color?: string })?.color || AVATAR_COLORS[0],
  }));

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--color-text-secondary)' }}>
        캔버스 펼치는 중이에요...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
          {error}
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          새 캔버스 만들기 →
        </a>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TopBar
        title={canvasMeta?.title || '제목 없는 캔버스'}
        users={users}
        onShare={() => setShowShare(true)}
        onTitleChange={handleTitleChange}
      />

      <div className="pt-[56px] w-full h-full">
        <Canvas
          activeTool={activeTool}
          canvasId={canvasId}
          onToolChange={setActiveTool}
        />
      </div>

      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onImageUpload={handleFileSelect}
      />

      <ZoomControl
        level={zoom}
        onZoom={(delta) => setZoom((z) => Math.max(0.1, Math.min(4, z + delta)))}
        onReset={() => setZoom(1)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {showShare && (
        <ShareModal canvasId={canvasId} onClose={() => setShowShare(false)} />
      )}

      {showNickname && (
        <NicknameModal
          onSubmit={(name) => {
            setNickname(name);
            setShowNickname(false);
          }}
        />
      )}

      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}

      {/* Empty state */}
      {canvasMeta && !loading && (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  const count = useStorage((root) => root.elements.size);

  if (!count || count > 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-[56px]">
      <div className="text-center pointer-events-auto">
        <p className="text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>
          아직 아무것도 없어요.
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          하나 올려볼까요?
        </p>
      </div>
    </div>
  );
}

export default function CanvasPage({ params }: { params: Promise<{ canvasId: string }> }) {
  const { canvasId } = use(params);

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={`canvas-${canvasId}`}
        initialPresence={{ cursor: null, nickname: '익명', color: AVATAR_COLORS[0] }}
        initialStorage={{ elements: new LiveMap() }}
      >
        <CanvasRoom canvasId={canvasId} />
      </RoomProvider>
    </LiveblocksProvider>
  );
}
