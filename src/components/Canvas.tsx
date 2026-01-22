import { useCallback, useRef, useEffect, useState } from 'react';
import { Block, GridSettings, PageFormat, BlockTemplate, BlockType } from '@/types/presentation';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';

interface CanvasProps {
  blocks: Block[];
  gridSettings: GridSettings;
  format: PageFormat;
  selectedBlockId: string | null;
  zoom: number;
  onZoom: (delta: number) => void;
  onSelectBlock: (id: string | null) => void;
  onAddBlock: (block: Block) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
}

const formatDimensions: Record<PageFormat, { width: number; height: number }> = {
  'A3': { width: 1191, height: 842 },
  'A3-vertical': { width: 842, height: 1191 },
  'A4-spread': { width: 1191, height: 842 },
  '16:9': { width: 1280, height: 720 },
};

export function Canvas({
  blocks,
  gridSettings,
  format,
  selectedBlockId,
  zoom,
  onZoom,
  onSelectBlock,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const dimensions = formatDimensions[format];
  const contentWidth = dimensions.width - gridSettings.marginLeft - gridSettings.marginRight;
  const contentHeight = dimensions.height - gridSettings.marginTop - gridSettings.marginBottom;
  const columnWidth = contentWidth / gridSettings.columns;

  // Handle Space key for panning mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLInputElement || 
                       activeElement instanceof HTMLTextAreaElement ||
                       activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isTyping) return;
      
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        onZoom(delta);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [onZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isSpacePressed) {
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    }
  }, [isSpacePressed, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.current.x;
      const deltaY = e.clientY - panStart.current.y;
      setPanOffset({
        x: panStart.current.panX + deltaX,
        y: panStart.current.panY + deltaY,
      });
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const template: BlockTemplate = JSON.parse(data);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const gridX = Math.max(0, Math.min(
      gridSettings.columns - template.defaultWidth,
      Math.floor((x - gridSettings.marginLeft) / columnWidth)
    ));
    const gridY = Math.max(0, Math.floor((y - gridSettings.marginTop) / gridSettings.rowHeight));

    const newBlock: Block = {
      id: Date.now().toString(),
      type: template.type,
      x: gridX,
      y: gridY,
      width: template.defaultWidth,
      height: template.defaultHeight,
      content: {},
    };

    onAddBlock(newBlock);
  }, [zoom, gridSettings, columnWidth, onAddBlock]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('blueprint-grid')) {
      onSelectBlock(null);
    }
  }, [onSelectBlock]);

  // Generate grid lines
  const renderGrid = () => {
    if (!gridSettings.showGrid) return null;

    const lines = [];
    
    // Vertical lines (columns)
    for (let i = 0; i <= gridSettings.columns; i++) {
      const x = i * columnWidth;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={contentHeight}
          stroke={i % 4 === 0 ? 'var(--blueprint-line-strong)' : 'var(--blueprint-line)'}
          strokeWidth={i % 4 === 0 ? 1 : 0.5}
        />
      );
    }

    // Horizontal lines (rows)
    const rows = Math.ceil(contentHeight / gridSettings.rowHeight);
    for (let i = 0; i <= rows; i++) {
      const y = i * gridSettings.rowHeight;
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={contentWidth}
          y2={y}
          stroke={i % 5 === 0 ? 'var(--blueprint-line-strong)' : 'var(--blueprint-line)'}
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
        />
      );
    }

    return (
      <svg
        className="blueprint-grid absolute inset-0 pointer-events-none"
        width={contentWidth}
        height={contentHeight}
        style={{ left: gridSettings.marginLeft, top: gridSettings.marginTop }}
      >
        {lines}
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 overflow-auto bg-background flex items-center justify-center p-8",
        isSpacePressed && !isPanning && 'cursor-grab',
        isPanning && 'cursor-grabbing'
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={canvasRef}
        className="blueprint-border relative bg-canvas shadow-2xl"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderGrid()}

        {/* Content area */}
        <div
          className="absolute"
          style={{
            left: gridSettings.marginLeft,
            top: gridSettings.marginTop,
            width: contentWidth,
            height: contentHeight,
          }}
        >
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isSelected={block.id === selectedBlockId}
              columnWidth={columnWidth}
              gutter={gridSettings.gutter}
              rowHeight={gridSettings.rowHeight}
              gridColumns={gridSettings.columns}
              onSelect={() => onSelectBlock(block.id)}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
              onRemove={() => onRemoveBlock(block.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
