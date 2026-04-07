'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useStorage, useMutation } from '@liveblocks/react';
import type { CanvasElement, StickyColor } from '@/lib/types';
import { STICKY_COLORS } from '@/lib/types';
import type { Tool } from './Toolbar';
import useImage from './useImage';

interface CanvasProps {
  activeTool: Tool;
  canvasId: string;
  onToolChange: (tool: Tool) => void;
}

function StickyNote({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTextChange,
  onDelete,
  onColorChange,
}: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
  onColorChange: (color: StickyColor) => void;
}) {
  const bgColor = element.content.color || '#FFF9DB';

  return (
    <>
      <Group
        x={element.position_x}
        y={element.position_y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd(e.target.x(), e.target.y());
        }}
      >
        <Rect
          width={element.width}
          height={element.height}
          fill={bgColor}
          cornerRadius={6}
          stroke={isSelected ? '#3B6FFF' : 'transparent'}
          strokeWidth={isSelected ? 2 : 0}
          shadowColor="rgba(0,0,0,0.08)"
          shadowBlur={isSelected ? 8 : 0}
          shadowOffsetY={isSelected ? 2 : 0}
        />
        <Text
          text={element.content.text || '클릭하여 입력'}
          x={12}
          y={12}
          width={element.width - 24}
          height={element.height - 24}
          fontSize={14}
          fontFamily="Pretendard, Inter, sans-serif"
          fill={element.content.text ? '#1A1A2E' : '#6B6B80'}
          wrap="word"
        />
      </Group>
      {/* Color picker and delete when selected */}
      {isSelected && (
        <StickyControls
          x={element.position_x}
          y={element.position_y + element.height + 8}
          currentColor={bgColor as StickyColor}
          onColorChange={onColorChange}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

function StickyControls({
  x,
  y,
  currentColor,
  onColorChange,
  onDelete,
}: {
  x: number;
  y: number;
  currentColor: StickyColor;
  onColorChange: (color: StickyColor) => void;
  onDelete: () => void;
}) {
  return (
    <Group x={x} y={y}>
      {STICKY_COLORS.map((c, i) => (
        <Group key={c.hex} x={i * 24} y={0} onClick={() => onColorChange(c.hex)}>
          <Rect
            width={20}
            height={20}
            fill={c.hex}
            cornerRadius={4}
            stroke={c.hex === currentColor ? '#3B6FFF' : '#EEEEF0'}
            strokeWidth={2}
          />
        </Group>
      ))}
      <Group x={STICKY_COLORS.length * 24 + 8} y={0} onClick={onDelete}>
        <Rect width={20} height={20} fill="#F87171" cornerRadius={4} />
        <Text text="✕" x={5} y={3} fontSize={12} fill="white" />
      </Group>
    </Group>
  );
}

function ImageElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
}: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}) {
  const [image] = useImage(element.content.url || '');
  const trRef = useRef<Konva.Transformer>(null);
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
        x={element.position_x}
        y={element.position_y}
        width={element.width}
        height={element.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
        stroke={isSelected ? '#3B6FFF' : 'transparent'}
        strokeWidth={isSelected ? 2 : 0}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default function Canvas({ activeTool, canvasId, onToolChange }: CanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  // Liveblocks: read elements as plain array
  const elements = useStorage((root) => {
    const arr: CanvasElement[] = [];
    root.elements.forEach((value) => {
      arr.push(value as CanvasElement);
    });
    return arr;
  });

  const addElement = useMutation(({ storage }, element: CanvasElement) => {
    storage.get('elements').set(element.id, element);
  }, []);

  const updateElement = useMutation(
    ({ storage }, id: string, updates: Partial<CanvasElement>) => {
      const el = storage.get('elements').get(id);
      if (el) {
        const updated = { ...el, ...updates } as CanvasElement;
        if (updates.content) {
          updated.content = { ...(el as CanvasElement).content, ...updates.content };
        }
        storage.get('elements').set(id, updated);
      }
    },
    [],
  );

  const deleteElement = useMutation(({ storage }, id: string) => {
    storage.get('elements').delete(id);
  }, []);

  const elementsArray: CanvasElement[] = elements || [];

  // Resize handler
  useEffect(() => {
    function handleResize() {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedId) {
            deleteElement(selectedId);
            setSelectedId(null);
          }
          break;
        case 't':
        case 'T':
          onToolChange('sticky');
          break;
        case 'h':
        case 'H':
          onToolChange('pan');
          break;
        case 'v':
        case 'V':
          onToolChange('select');
          break;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteElement, onToolChange]);

  // Wheel zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(4, newScale));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    setScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  // Click on stage to add sticky or deselect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleStageClick(e: any) {
    if (e.target === e.target.getStage()) {
      if (activeTool === 'sticky') {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const pos = {
          x: (pointer.x - stagePos.x) / scale,
          y: (pointer.y - stagePos.y) / scale,
        };

        const newElement: CanvasElement = {
          id: crypto.randomUUID(),
          type: 'sticky',
          position_x: pos.x - 100,
          position_y: pos.y - 60,
          width: 200,
          height: 120,
          content: { text: '', color: '#FFF9DB' },
          z_index: elementsArray.length + 1,
          created_by: 'me',
        };
        addElement(newElement);
        setSelectedId(newElement.id);
        onToolChange('select');
      } else {
        setSelectedId(null);
      }
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scaleX={scale}
      scaleY={scale}
      x={stagePos.x}
      y={stagePos.y}
      draggable={activeTool === 'pan'}
      onWheel={handleWheel}
      onClick={handleStageClick}
      onTap={handleStageClick}
      onDragEnd={(e) => {
        if (e.target === stageRef.current) {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        cursor: activeTool === 'pan' ? 'grab' : activeTool === 'sticky' ? 'crosshair' : 'default',
      }}
    >
      <Layer>
        {[...elementsArray]
          .sort((a, b) => a.z_index - b.z_index)
          .map((el) =>
            el.type === 'sticky' ? (
              <StickyNote
                key={el.id}
                element={el}
                isSelected={selectedId === el.id}
                onSelect={() => setSelectedId(el.id)}
                onDragEnd={(x, y) => updateElement(el.id, { position_x: x, position_y: y })}
                onTextChange={(text) => updateElement(el.id, { content: { ...el.content, text } })}
                onDelete={() => {
                  deleteElement(el.id);
                  setSelectedId(null);
                }}
                onColorChange={(color) => updateElement(el.id, { content: { ...el.content, color } })}
              />
            ) : (
              <ImageElement
                key={el.id}
                element={el}
                isSelected={selectedId === el.id}
                onSelect={() => setSelectedId(el.id)}
                onDragEnd={(x, y) => updateElement(el.id, { position_x: x, position_y: y })}
              />
            ),
          )}
      </Layer>
    </Stage>
  );
}
