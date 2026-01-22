import { Page } from '@/types/presentation';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface PageThumbnailsProps {
  pages: Page[];
  currentIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export function PageThumbnails({
  pages,
  currentIndex,
  onSelectPage,
  onAddPage,
  onDeletePage,
}: PageThumbnailsProps) {
  return (
    <div className="h-24 bg-sidebar border-t border-sidebar-border flex items-center gap-3 px-4 overflow-x-auto">
      {pages.map((page, index) => (
        <div
          key={page.id}
          className={cn(
            'relative group flex-shrink-0 w-32 h-18 rounded border-2 cursor-pointer transition-all',
            'bg-card/50 hover:border-primary/50',
            index === currentIndex ? 'border-primary' : 'border-border'
          )}
          onClick={() => onSelectPage(index)}
        >
          {/* Mini preview */}
          <div className="absolute inset-2 flex items-center justify-center">
            <span className="text-xs font-mono text-muted-foreground">
              {index + 1}
            </span>
          </div>

          {/* Blocks preview dots */}
          <div className="absolute bottom-1 left-1 right-1 flex gap-0.5">
            {page.blocks.slice(0, 5).map((block) => (
              <div
                key={block.id}
                className="w-1 h-1 rounded-full bg-primary/50"
              />
            ))}
          </div>

          {/* Delete button */}
          {pages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePage(index);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Trash2 className="w-2 h-2 text-destructive-foreground" />
            </button>
          )}
        </div>
      ))}

      {/* Add page button */}
      <button
        onClick={onAddPage}
        className="flex-shrink-0 w-32 h-18 rounded border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">Добавить</span>
      </button>
    </div>
  );
}
