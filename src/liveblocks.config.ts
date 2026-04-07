import type { LiveMap } from '@liveblocks/client';
import type { CanvasElement } from '@/lib/types';

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      nickname: string;
      color: string;
    };
    Storage: {
      elements: LiveMap<string, CanvasElement>;
    };
    UserMeta: {
      id: string;
      info: {
        nickname: string;
        color: string;
      };
    };
  }
}

export {};
