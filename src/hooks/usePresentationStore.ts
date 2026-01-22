import { useState, useCallback } from 'react';
import { Block, Page, GridSettings, PageFormat } from '@/types/presentation';

const defaultGridSettings: GridSettings = {
  columns: 24,
  marginTop: 40,
  marginRight: 40,
  marginBottom: 40,
  marginLeft: 40,
  gutter: 0,
  rowHeight: 20,
  showGrid: true,
};

export function usePresentationStore() {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', blocks: [], format: '16:9' },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [gridSettings, setGridSettings] = useState<GridSettings>(defaultGridSettings);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const currentPage = pages[currentPageIndex];

  const addBlock = useCallback((block: Block) => {
    setPages((prev) =>
      prev.map((page, idx) =>
        idx === currentPageIndex
          ? { ...page, blocks: [...page.blocks, block] }
          : page
      )
    );
  }, [currentPageIndex]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setPages((prev) =>
      prev.map((page, idx) =>
        idx === currentPageIndex
          ? {
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === id ? { ...block, ...updates } : block
              ),
            }
          : page
      )
    );
  }, [currentPageIndex]);

  const removeBlock = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page, idx) =>
        idx === currentPageIndex
          ? { ...page, blocks: page.blocks.filter((b) => b.id !== id) }
          : page
      )
    );
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  }, [currentPageIndex, selectedBlockId]);

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const setFormat = useCallback((format: PageFormat) => {
    setPages((prev) =>
      prev.map((page, idx) =>
        idx === currentPageIndex ? { ...page, format } : page
      )
    );
  }, [currentPageIndex]);

  const addPage = useCallback(() => {
    const newPage: Page = {
      id: Date.now().toString(),
      blocks: [],
      format: currentPage.format,
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  }, [currentPage.format, pages.length]);

  const deletePage = useCallback((index: number) => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, idx) => idx !== index));
    if (currentPageIndex >= index && currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  }, [pages.length, currentPageIndex]);

  const updateGridSettings = useCallback((updates: Partial<GridSettings>) => {
    setGridSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleGrid = useCallback(() => {
    setGridSettings((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(0.25, Math.min(2, prev + delta)));
  }, []);

  const getSelectedBlock = useCallback(() => {
    if (!selectedBlockId) return null;
    return currentPage.blocks.find((b) => b.id === selectedBlockId) || null;
  }, [selectedBlockId, currentPage.blocks]);

  return {
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
  };
}
