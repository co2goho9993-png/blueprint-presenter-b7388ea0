import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { BlocksSidebar } from '@/components/BlocksSidebar';
import { Canvas } from '@/components/Canvas';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { PageThumbnails } from '@/components/PageThumbnails';
import { usePresentationStore } from '@/hooks/usePresentationStore';
import { BlockTemplate } from '@/types/presentation';
import { useToast } from '@/hooks/use-toast';
import { exportToPdf } from '@/lib/exportPdf';

const Index = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    pages,
    currentPage,
    currentPageIndex,
    setCurrentPageIndex,
    gridSettings,
    selectedBlockId,
    zoom,
    handleZoom,
    addBlock,
    updateBlock,
    removeBlock,
    selectBlock,
    setFormat,
    addPage,
    deletePage,
    updateGridSettings,
    toggleGrid,
    getSelectedBlock,
  } = usePresentationStore();

  const [draggingTemplate, setDraggingTemplate] = useState<BlockTemplate | null>(null);

  const handleDragStart = useCallback((template: BlockTemplate) => {
    setDraggingTemplate(template);
  }, []);

  const handleExport = useCallback(async () => {
    if (isExporting) return;
    
    const canvasElement = document.querySelector('.blueprint-border') as HTMLElement;
    if (!canvasElement) {
      toast({
        title: 'Ошибка экспорта',
        description: 'Не найден элемент холста',
        variant: 'destructive',
      });
      return;
    }
    
    setIsExporting(true);
    toast({
      title: 'Экспорт в PDF',
      description: 'Захват содержимого...',
    });

    try {
      await exportToPdf(canvasElement, currentPage.format, (current, total) => {
        console.log(`Экспорт страницы ${current} из ${total}`);
      });
      
      toast({
        title: 'Готово!',
        description: 'PDF успешно сохранён.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось создать PDF. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [currentPage.format, isExporting, toast]);

  const selectedBlock = getSelectedBlock();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        format={currentPage.format}
        onFormatChange={setFormat}
        gridSettings={gridSettings}
        onToggleGrid={toggleGrid}
        onExport={handleExport}
        onAddPage={addPage}
        currentPage={currentPageIndex}
        totalPages={pages.length}
        zoom={zoom}
        onZoom={handleZoom}
      />

      <div className="flex-1 flex overflow-hidden">
        <BlocksSidebar onDragStart={handleDragStart} />

        <Canvas
          blocks={currentPage.blocks}
          gridSettings={gridSettings}
          format={currentPage.format}
          selectedBlockId={selectedBlockId}
          zoom={zoom}
          onZoom={handleZoom}
          onSelectBlock={selectBlock}
          onAddBlock={addBlock}
          onUpdateBlock={updateBlock}
          onRemoveBlock={removeBlock}
        />

        <PropertiesPanel
          selectedBlock={selectedBlock}
          gridSettings={gridSettings}
          onUpdateBlock={updateBlock}
          onUpdateGridSettings={updateGridSettings}
        />
      </div>

      <PageThumbnails
        pages={pages}
        currentIndex={currentPageIndex}
        onSelectPage={setCurrentPageIndex}
        onAddPage={addPage}
        onDeletePage={deletePage}
      />
    </div>
  );
};

export default Index;
