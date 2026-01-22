import { useRef, useState, useCallback } from 'react';
import { Block } from '@/types/presentation';
import { cn } from '@/lib/utils';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  columnWidth: number;
  gutter: number;
  rowHeight: number;
  gridColumns: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onRemove: () => void;
}

const CHART_COLORS = ['hsl(210 80% 50%)', 'hsl(210 60% 40%)', 'hsl(210 50% 35%)', 'hsl(210 40% 30%)', 'hsl(210 30% 25%)'];

export function BlockRenderer({
  block,
  isSelected,
  columnWidth,
  gutter,
  rowHeight,
  gridColumns,
  onSelect,
  onUpdate,
  onRemove,
}: BlockRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef({ x: 0, y: 0, blockX: 0, blockY: 0, width: 0, height: 0 });

  const left = block.x * columnWidth;
  const top = block.y * rowHeight;
  const width = block.width * columnWidth;
  const height = block.height * rowHeight;

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.stopPropagation();
    e.preventDefault();
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = action === 'drag' ? 'grabbing' : 'se-resize';
    
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      blockX: block.x,
      blockY: block.y,
      width: block.width,
      height: block.height,
    };

    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;

      const cellWidth = columnWidth;
      const cellHeight = rowHeight;

      if (action === 'drag') {
        const newX = Math.max(0, Math.min(gridColumns - block.width, 
          startPos.current.blockX + Math.round(deltaX / cellWidth)));
        const newY = Math.max(0, startPos.current.blockY + Math.round(deltaY / cellHeight));
        
        onUpdate({ x: newX, y: newY });
      } else {
        const newWidth = Math.max(1, Math.min(gridColumns - block.x,
          startPos.current.width + Math.round(deltaX / cellWidth)));
        const newHeight = Math.max(1, startPos.current.height + Math.round(deltaY / cellHeight));
        
        onUpdate({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setIsDragging(false);
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [block, columnWidth, rowHeight, gridColumns, onUpdate]);

  const renderContent = () => {
    const { content, type } = block;
    
    switch (type) {
      case 'title':
        return (
          <h1 className="text-2xl font-bold text-canvas-foreground leading-tight">
            {content.title || 'Заголовок'}
          </h1>
        );
      
      case 'subtitle':
        return (
          <h2 className="text-lg font-semibold text-canvas-foreground">
            {content.title || 'Подзаголовок'}
          </h2>
        );
      
      case 'text':
        return (
          <p className={cn(
            "text-sm leading-relaxed",
            content.textColor === 'blue' && 'text-blue-600',
            content.textColor === 'green' && 'text-green-600',
            content.textColor === 'red' && 'text-red-600',
            !content.textColor && 'text-canvas-foreground'
          )}>
            {content.text || 'Текст блока'}
          </p>
        );

      case 'accent-text':
        return (
          <p className="text-lg font-semibold text-primary">
            {content.text || 'Акцентный текст'}
          </p>
        );
      
      case 'list':
        return (
          <ul className="space-y-1 text-sm text-canvas-foreground">
            {(content.items || ['Пункт 1', 'Пункт 2', 'Пункт 3']).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary pl-4 italic text-canvas-foreground/80">
            {content.text || '"Цитата"'}
          </blockquote>
        );

      case 'callout':
        return (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-canvas-foreground">
              {content.text || 'Важная информация'}
            </p>
          </div>
        );
      
      case 'chart-bar':
        const barData = content.chartData || [
          { label: 'A', value: 30 },
          { label: 'B', value: 50 },
          { label: 'C', value: 40 },
          { label: 'D', value: 70 },
        ];
        return (
          <div className="w-full h-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="hsl(210 80% 50%)">
                  <LabelList dataKey="value" position="top" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'chart-pie':
        const pieData = content.chartData || [
          { label: 'A', value: 30 },
          { label: 'B', value: 25 },
          { label: 'C', value: 45 },
        ];
        return (
          <div className="w-full h-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'chart-line':
        const lineData = content.chartData || [
          { label: 'Янв', value: 30 },
          { label: 'Фев', value: 45 },
          { label: 'Мар', value: 35 },
          { label: 'Апр', value: 60 },
        ];
        return (
          <div className="w-full h-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="hsl(210 80% 50%)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'chart-area':
        const areaData = content.chartData || [
          { label: 'Янв', value: 30 },
          { label: 'Фев', value: 45 },
          { label: 'Мар', value: 35 },
          { label: 'Апр', value: 60 },
        ];
        return (
          <div className="w-full h-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="value" fill="hsl(210 80% 50% / 0.3)" stroke="hsl(210 80% 50%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'metrics':
        const metrics = content.metrics || [{ label: 'Метрика', value: '100', trend: 'up' as const }];
        return (
          <div className="flex flex-col justify-center h-full gap-1">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center">
                <p className={cn(
                  "text-2xl font-bold",
                  metric.valueColor === 'blue' && 'text-blue-600',
                  metric.valueColor === 'green' && 'text-green-600',
                  metric.valueColor === 'red' && 'text-red-600',
                  !metric.valueColor && 'text-canvas-foreground'
                )}>
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                {metric.change && (
                  <div className={cn(
                    "flex items-center justify-center gap-1 text-xs",
                    metric.trend === 'up' && 'text-green-600',
                    metric.trend === 'down' && 'text-red-600'
                  )}>
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {metric.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'table':
        const tableData = content.tableData || {
          headers: ['Колонка 1', 'Колонка 2'],
          rows: [['Ячейка 1', 'Ячейка 2'], ['Ячейка 3', 'Ячейка 4']]
        };
        return (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {tableData.headers.map((header, i) => (
                  <th key={i} className="border border-border p-2 bg-muted/50 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'image':
        return (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center rounded overflow-hidden">
            {content.images?.[0] ? (
              <img 
                src={content.images[0]} 
                alt="" 
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${content.imageScale || 1}) translate(${content.imageOffsetX || 0}%, ${content.imageOffsetY || 0}%)`
                }}
              />
            ) : (
              <span className="text-xs text-muted-foreground">Изображение</span>
            )}
          </div>
        );

      case 'logos':
        const logoCount = content.logoCount || 3;
        return (
          <div className="flex items-center justify-around h-full gap-4 px-4">
            {Array.from({ length: logoCount }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-muted/30 rounded flex items-center justify-center">
                {content.logoImages?.[i] ? (
                  <img src={content.logoImages[i]} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">Logo</span>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'divider':
        return <hr className="border-t border-border w-full" />;
      
      case 'code':
        return (
          <pre className="bg-muted/50 rounded p-3 text-xs font-mono overflow-auto h-full">
            <code>{content.text || '// Код'}</code>
          </pre>
        );

      case 'timeline':
        const items = content.items || ['Этап 1', 'Этап 2', 'Этап 3'];
        return (
          <div className="flex items-center justify-between w-full h-full px-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-canvas-foreground">{item}</span>
                {i < items.length - 1 && (
                  <div className="w-8 h-0.5 bg-border ml-2" />
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return <span className="text-xs text-muted-foreground">{type}</span>;
    }
  };

  return (
    <div
      className={cn(
        'block-item absolute rounded transition-all',
        'border border-block-border hover:border-block-border-hover',
        isSelected && 'selected border-block-border-selected ring-2 ring-primary/20',
        isDragging && 'cursor-grabbing opacity-80',
        isResizing && 'opacity-80'
      )}
      style={{
        left,
        top,
        width,
        height,
        backgroundColor: 'var(--block-bg)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
    >
      <div className="w-full h-full p-2 overflow-hidden">
        {renderContent()}
      </div>

      {/* Delete button */}
      {isSelected && (
        <button
          className="delete-btn absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-3 h-3 text-destructive-foreground" />
        </button>
      )}

      {/* Resize handle */}
      {isSelected && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}
