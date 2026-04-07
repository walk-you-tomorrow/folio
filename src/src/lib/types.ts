export type ElementType = 'sticky' | 'image';

export type StickyColor =
  | '#FFF9DB'  // Yellow
  | '#DBE4FF'  // Blue
  | '#D3F9D8'  // Green
  | '#FFE0E6'  // Pink
  | '#E8DAFB'  // Purple
  | '#F1F3F5'; // Gray

export const STICKY_COLORS: { name: string; hex: StickyColor }[] = [
  { name: 'Yellow', hex: '#FFF9DB' },
  { name: 'Blue', hex: '#DBE4FF' },
  { name: 'Green', hex: '#D3F9D8' },
  { name: 'Pink', hex: '#FFE0E6' },
  { name: 'Purple', hex: '#E8DAFB' },
  { name: 'Gray', hex: '#F1F3F5' },
];

export const AVATAR_COLORS = [
  '#3B6FFF', '#7C5CFC', '#22C55E', '#F87171',
  '#FFD43B', '#FF6B6B', '#4ECDC4', '#45B7D1',
];

export interface CanvasElementContent {
  [key: string]: string | undefined;
  text?: string;
  color?: string;
  url?: string;
  original_name?: string;
}

export interface CanvasElement {
  [key: string]: string | number | CanvasElementContent;
  id: string;
  type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  content: CanvasElementContent;
  z_index: number;
  created_by: string;
}

export interface CanvasMeta {
  id: string;
  title: string;
  created_at: string;
  expires_at: string;
}
