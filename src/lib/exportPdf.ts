import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Canvas dimensions for layout (screen-friendly)
const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'A3': { width: 1191, height: 842 },        // A3 landscape
  'A3-vertical': { width: 842, height: 1191 }, // A3 portrait
  'A4-spread': { width: 1191, height: 842 },   // 2 x A4 pages (same canvas as A3)
  '16:9': { width: 1280, height: 720 },
};

// For print quality (~300 DPI), we need high scale factors
const PRINT_QUALITY_SCALE = 5;

export async function exportToPdf(
  canvasElement: HTMLElement,
  format: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const dimensions = FORMAT_DIMENSIONS[format] || FORMAT_DIMENSIONS['16:9'];
  
  const isLandscape = dimensions.width > dimensions.height;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'px',
    format: [dimensions.width, dimensions.height],
  });

  onProgress?.(1, 1);

  // Wait a bit for any rendering to complete
  await new Promise(resolve => setTimeout(resolve, 200));

  const canvas = await html2canvas(canvasElement, {
    width: dimensions.width,
    height: dimensions.height,
    scale: PRINT_QUALITY_SCALE,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 0,
    removeContainer: true,
    onclone: (clonedDoc, clonedElement) => {
      // Reset any transforms on the cloned canvas
      clonedElement.style.transform = 'none';
      clonedElement.style.width = `${dimensions.width}px`;
      clonedElement.style.height = `${dimensions.height}px`;
      
      // Remove selection styling and controls
      const selectedBlocks = clonedElement.querySelectorAll('.block-item.selected');
      selectedBlocks.forEach((block) => {
        block.classList.remove('selected');
      });
      
      // Hide delete buttons and resize handles
      const controls = clonedElement.querySelectorAll('.delete-btn, .resize-handle');
      controls.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Hide grid
      const gridElements = clonedElement.querySelectorAll('.blueprint-grid');
      gridElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    },
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  
  pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height, undefined, 'FAST');

  const filename = `blueprint-${format}-${Date.now()}.pdf`;
  pdf.save(filename);
}
