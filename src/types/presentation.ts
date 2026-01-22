export type BlockType = 
  | 'title'
  | 'subtitle'
  | 'text'
  | 'accent-text'
  | 'chart-bar'
  | 'chart-pie'
  | 'chart-line'
  | 'chart-area'
  | 'image'
  | 'table'
  | 'list'
  | 'quote'
  | 'code'
  | 'timeline'
  | 'metrics'
  | 'icons'
  | 'logos'
  | 'divider'
  | 'callout';

export interface Block {
  id: string;
  type: BlockType;
  x: number; // Column position (0-11)
  y: number; // Row position
  width: number; // Number of columns (1-12)
  height: number; // Number of rows
  content: BlockContent;
  isSelected?: boolean;
}

export interface BlockContent {
  title?: string;
  text?: string;
  textColor?: 'blue' | 'green' | 'red';
  items?: string[];
  chartData?: ChartDataPoint[];
  chartSettings?: { segments: number };
  images?: string[];
  tableData?: TableData;
  metrics?: MetricItem[];
  lineChartData?: LineChartSeries[];
  unit?: string;
  // Image positioning
  imageScale?: number; // 1 = 100%
  imageOffsetX?: number; // percentage offset
  imageOffsetY?: number; // percentage offset
  // Logos block
  logoImages?: string[]; // Array of logo image URLs
  logoCount?: number; // Number of logo placeholders (default 3)
}

export interface LineChartSeries {
  name: string;
  color: string;
  data: ChartDataPoint[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface MetricItem {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  valueColor?: 'blue' | 'green' | 'red';
}

export type PageFormat = 'A3' | 'A3-vertical' | 'A4-spread' | '16:9';

export interface Page {
  id: string;
  blocks: Block[];
  format: PageFormat;
}

export interface GridSettings {
  columns: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gutter: number;
  rowHeight: number;
  showGrid: boolean;
}

export interface BlockTemplate {
  type: BlockType;
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  category: 'content' | 'data' | 'media' | 'layout';
}
