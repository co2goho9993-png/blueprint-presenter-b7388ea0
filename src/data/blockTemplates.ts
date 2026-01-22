import { BlockTemplate } from '@/types/presentation';

export const blockTemplates: BlockTemplate[] = [
  // Content blocks
  {
    type: 'title',
    label: 'Заголовок',
    icon: 'Heading1',
    defaultWidth: 12,
    defaultHeight: 3,
    category: 'content',
  },
  {
    type: 'subtitle',
    label: 'Заголовок блока',
    icon: 'Heading2',
    defaultWidth: 8,
    defaultHeight: 2,
    category: 'content',
  },
  {
    type: 'text',
    label: 'Текст',
    icon: 'Type',
    defaultWidth: 8,
    defaultHeight: 4,
    category: 'content',
  },
  {
    type: 'accent-text',
    label: 'Акцентный текст',
    icon: 'Bold',
    defaultWidth: 4,
    defaultHeight: 4,
    category: 'content',
  },
  {
    type: 'quote',
    label: 'Цитата',
    icon: 'Quote',
    defaultWidth: 8,
    defaultHeight: 4,
    category: 'content',
  },
  {
    type: 'list',
    label: 'Список',
    icon: 'List',
    defaultWidth: 8,
    defaultHeight: 6,
    category: 'content',
  },
  {
    type: 'callout',
    label: 'Выноска',
    icon: 'MessageSquare',
    defaultWidth: 6,
    defaultHeight: 4,
    category: 'content',
  },

  // Data blocks
  {
    type: 'chart-bar',
    label: 'Столбчатая диаграмма',
    icon: 'BarChart3',
    defaultWidth: 8,
    defaultHeight: 10,
    category: 'data',
  },
  {
    type: 'chart-pie',
    label: 'Круговая диаграмма',
    icon: 'PieChart',
    defaultWidth: 5,
    defaultHeight: 10,
    category: 'data',
  },
  {
    type: 'chart-line',
    label: 'Линейный график',
    icon: 'LineChart',
    defaultWidth: 8,
    defaultHeight: 10,
    category: 'data',
  },
  {
    type: 'chart-area',
    label: 'Площадная диаграмма',
    icon: 'AreaChart',
    defaultWidth: 8,
    defaultHeight: 10,
    category: 'data',
  },
  {
    type: 'table',
    label: 'Таблица',
    icon: 'Table',
    defaultWidth: 10,
    defaultHeight: 6,
    category: 'data',
  },
  {
    type: 'metrics',
    label: 'Метрики',
    icon: 'Activity',
    defaultWidth: 2,
    defaultHeight: 3,
    category: 'data',
  },
  {
    type: 'timeline',
    label: 'Таймлайн',
    icon: 'GitBranch',
    defaultWidth: 12,
    defaultHeight: 3,
    category: 'data',
  },

  // Media blocks
  {
    type: 'image',
    label: 'Изображение',
    icon: 'Image',
    defaultWidth: 6,
    defaultHeight: 8,
    category: 'media',
  },
  {
    type: 'logos',
    label: 'Логотипы',
    icon: 'Shapes',
    defaultWidth: 8,
    defaultHeight: 4,
    category: 'media',
  },

  // Layout blocks
  {
    type: 'divider',
    label: 'Разделитель',
    icon: 'Minus',
    defaultWidth: 12,
    defaultHeight: 1,
    category: 'layout',
  },
  {
    type: 'code',
    label: 'Код',
    icon: 'Code',
    defaultWidth: 8,
    defaultHeight: 6,
    category: 'layout',
  },
];

export const categoryLabels: Record<string, string> = {
  content: 'Контент',
  data: 'Данные',
  media: 'Медиа',
  layout: 'Разметка',
};
