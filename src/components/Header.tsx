import { Grid3X3, Download, Plus, Eye, EyeOff, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageFormat, GridSettings } from '@/types/presentation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  format: PageFormat;
  onFormatChange: (format: PageFormat) => void;
  gridSettings: GridSettings;
  onToggleGrid: () => void;
  onExport: () => void;
  onAddPage: () => void;
  currentPage: number;
  totalPages: number;
  zoom: number;
  onZoom: (delta: number) => void;
}

export function Header({
  format,
  onFormatChange,
  gridSettings,
  onToggleGrid,
  onExport,
  onAddPage,
  currentPage,
  totalPages,
  zoom,
  onZoom,
}: HeaderProps) {
  return (
    <header className="blueprint-header h-[8vh] min-h-[56px] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground tracking-wide">
            Blueprint<span className="text-primary">.</span>TZ
          </h1>
        </div>
        
        <div className="h-5 w-px bg-border mx-2" />
        
        <span className="text-sm text-muted-foreground tracking-wide">
          Страница {currentPage + 1} / {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg px-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onZoom(-0.1)}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onZoom(0.1)}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Format Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="w-4 h-4" />
              <span className="text-xs tracking-wide">{format}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem onClick={() => onFormatChange('16:9')}>
              16:9 (Презентация)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFormatChange('A3')}>
              A3 Альбомный
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFormatChange('A3-vertical')}>
              A3 Портретный
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFormatChange('A4-spread')}>
              A4 Разворот
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Grid toggle */}
        <Button variant="outline" size="icon" onClick={onToggleGrid}>
          {gridSettings.showGrid ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>

        {/* Add Page */}
        <Button variant="outline" size="icon" onClick={onAddPage}>
          <Plus className="w-4 h-4" />
        </Button>

        {/* Export */}
        <Button onClick={onExport} className="gap-2">
          <Download className="w-4 h-4" />
          <span className="text-sm">Экспорт PDF</span>
        </Button>
      </div>
    </header>
  );
}
