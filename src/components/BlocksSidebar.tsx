import { useState } from 'react';
import { 
  Heading1, Heading2, Type, Quote, List, MessageSquare, Bold,
  BarChart3, PieChart, LineChart, AreaChart, Table, Activity, GitBranch,
  Image, Shapes, Minus, Code, ChevronDown, ChevronRight, CircleDot
} from 'lucide-react';
import { blockTemplates, categoryLabels } from '@/data/blockTemplates';
import { BlockTemplate } from '@/types/presentation';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heading1, Heading2, Type, Quote, List, MessageSquare, Bold,
  BarChart3, PieChart, LineChart, AreaChart, Table, Activity, GitBranch,
  Image, Shapes, Minus, Code, CircleDot,
};

interface BlocksSidebarProps {
  onDragStart: (template: BlockTemplate) => void;
}

export function BlocksSidebar({ onDragStart }: BlocksSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['content', 'data', 'media', 'layout']);

  const categories = ['content', 'data', 'media', 'layout'];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (e: React.DragEvent, template: BlockTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground tracking-wide">
          Блоки
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Перетащите на холст
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category);
          const categoryBlocks = blockTemplates.filter((b) => b.category === category);

          return (
            <div key={category} className="space-y-2">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {categoryLabels[category]}
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-2">
                  {categoryBlocks.map((template) => {
                    const IconComponent = iconMap[template.icon] || CircleDot;
                    return (
                      <div
                        key={template.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, template)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-lg cursor-grab',
                          'bg-sidebar-accent/50 hover:bg-sidebar-accent',
                          'border border-transparent hover:border-sidebar-border',
                          'transition-all duration-150'
                        )}
                      >
                        <IconComponent className="w-5 h-5 text-sidebar-foreground" />
                        <span className="text-[10px] text-center text-sidebar-foreground/80 leading-tight">
                          {template.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
