import { useState } from 'react';
import { Block, GridSettings } from '@/types/presentation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Sparkles, Settings, FileText, Loader2, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  gridSettings: GridSettings;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onUpdateGridSettings: (updates: Partial<GridSettings>) => void;
}

export function PropertiesPanel({
  selectedBlock,
  gridSettings,
  onUpdateBlock,
  onUpdateGridSettings,
}: PropertiesPanelProps) {
  const [taskDescription, setTaskDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSuggestion = async () => {
    if (!taskDescription.trim() || !selectedBlock) return;
    
    setIsGenerating(true);
    
    // Simulate AI suggestion
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBlock || !e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdateBlock(selectedBlock.id, {
        content: {
          ...selectedBlock.content,
          images: [imageUrl],
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const renderBlockProperties = () => {
    if (!selectedBlock) return null;

    const { type, content, id } = selectedBlock;

    switch (type) {
      case 'title':
      case 'subtitle':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Текст</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => onUpdateBlock(id, { content: { ...content, title: e.target.value } })}
                placeholder="Введите заголовок"
              />
            </div>
          </div>
        );

      case 'text':
      case 'accent-text':
      case 'quote':
      case 'callout':
      case 'code':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Текст</Label>
              <Textarea
                value={content.text || ''}
                onChange={(e) => onUpdateBlock(id, { content: { ...content, text: e.target.value } })}
                placeholder="Введите текст"
                rows={4}
              />
            </div>
            {type === 'text' && (
              <div className="space-y-2">
                <Label>Цвет текста</Label>
                <div className="flex gap-2">
                  {(['blue', 'green', 'red'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => onUpdateBlock(id, { content: { ...content, textColor: color } })}
                      className={cn(
                        'w-8 h-8 rounded border-2',
                        color === 'blue' && 'bg-blue-500',
                        color === 'green' && 'bg-green-500',
                        color === 'red' && 'bg-red-500',
                        content.textColor === color ? 'border-foreground' : 'border-transparent'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'list':
      case 'timeline':
        const items = content.items || [];
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Элементы списка</Label>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index] = e.target.value;
                      onUpdateBlock(id, { content: { ...content, items: newItems } });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== index);
                      onUpdateBlock(id, { content: { ...content, items: newItems } });
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdateBlock(id, { content: { ...content, items: [...items, 'Новый пункт'] } });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Изображение</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Загрузить изображение</p>
                </label>
              </div>
            </div>
            {content.images?.[0] && (
              <>
                <div className="space-y-2">
                  <Label>Масштаб: {Math.round((content.imageScale || 1) * 100)}%</Label>
                  <Slider
                    value={[(content.imageScale || 1) * 100]}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={([value]) => {
                      onUpdateBlock(id, { content: { ...content, imageScale: value / 100 } });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Смещение X: {content.imageOffsetX || 0}%</Label>
                  <Slider
                    value={[content.imageOffsetX || 0]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={([value]) => {
                      onUpdateBlock(id, { content: { ...content, imageOffsetX: value } });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Смещение Y: {content.imageOffsetY || 0}%</Label>
                  <Slider
                    value={[content.imageOffsetY || 0]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={([value]) => {
                      onUpdateBlock(id, { content: { ...content, imageOffsetY: value } });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'metrics':
        const metrics = content.metrics || [{ label: 'Метрика', value: '100' }];
        return (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
                <Input
                  value={metric.value}
                  onChange={(e) => {
                    const newMetrics = [...metrics];
                    newMetrics[index] = { ...metric, value: e.target.value };
                    onUpdateBlock(id, { content: { ...content, metrics: newMetrics } });
                  }}
                  placeholder="Значение"
                />
                <Input
                  value={metric.label}
                  onChange={(e) => {
                    const newMetrics = [...metrics];
                    newMetrics[index] = { ...metric, label: e.target.value };
                    onUpdateBlock(id, { content: { ...content, metrics: newMetrics } });
                  }}
                  placeholder="Название"
                />
                <div className="flex gap-2">
                  {(['blue', 'green', 'red'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const newMetrics = [...metrics];
                        newMetrics[index] = { ...metric, valueColor: color };
                        onUpdateBlock(id, { content: { ...content, metrics: newMetrics } });
                      }}
                      className={cn(
                        'w-6 h-6 rounded border-2',
                        color === 'blue' && 'bg-blue-500',
                        color === 'green' && 'bg-green-500',
                        color === 'red' && 'bg-red-500',
                        metric.valueColor === color ? 'border-foreground' : 'border-transparent'
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <p className="text-sm text-muted-foreground">
            Свойства для этого типа блока пока не доступны.
          </p>
        );
    }
  };

  return (
    <aside className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col h-full">
      <Tabs defaultValue="block" className="flex-1 flex flex-col">
        <TabsList className="m-4 grid grid-cols-3">
          <TabsTrigger value="block">
            <FileText className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Settings className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="block" className="m-0 p-4">
            {selectedBlock ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Свойства блока
                  </h3>
                  <span className="text-xs text-muted-foreground uppercase">
                    {selectedBlock.type}
                  </span>
                </div>
                {renderBlockProperties()}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Выберите блок для редактирования
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="m-0 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                AI Ассистент
              </h3>
              <Textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Опишите задачу для контента..."
                rows={4}
              />
              <Button
                onClick={handleGenerateSuggestion}
                disabled={!taskDescription.trim() || !selectedBlock || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Сгенерировать
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="grid" className="m-0 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Настройки сетки
              </h3>
              
              <div className="space-y-2">
                <Label>Колонки: {gridSettings.columns}</Label>
                <Slider
                  value={[gridSettings.columns]}
                  min={6}
                  max={36}
                  step={1}
                  onValueChange={([value]) => onUpdateGridSettings({ columns: value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Высота строки: {gridSettings.rowHeight}px</Label>
                <Slider
                  value={[gridSettings.rowHeight]}
                  min={10}
                  max={40}
                  step={2}
                  onValueChange={([value]) => onUpdateGridSettings({ rowHeight: value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Отступ сверху: {gridSettings.marginTop}px</Label>
                <Slider
                  value={[gridSettings.marginTop]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([value]) => onUpdateGridSettings({ marginTop: value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Отступ снизу: {gridSettings.marginBottom}px</Label>
                <Slider
                  value={[gridSettings.marginBottom]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([value]) => onUpdateGridSettings({ marginBottom: value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Отступ слева: {gridSettings.marginLeft}px</Label>
                <Slider
                  value={[gridSettings.marginLeft]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([value]) => onUpdateGridSettings({ marginLeft: value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Отступ справа: {gridSettings.marginRight}px</Label>
                <Slider
                  value={[gridSettings.marginRight]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([value]) => onUpdateGridSettings({ marginRight: value })}
                />
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
