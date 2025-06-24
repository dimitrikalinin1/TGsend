
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Loader2, Eye, X, Download, Copy, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PublishingProgressProps {
  status: 'idle' | 'starting' | 'logging_in' | 'uploading' | 'publishing' | 'success' | 'error';
  progress: number;
  message: string;
  error?: string;
  screenshots?: string[];
  postContent?: {
    caption: string;
    hashtags: string;
    imageUrl?: string;
  };
}

const PublishingProgress = ({ 
  status, 
  progress, 
  message, 
  error, 
  screenshots = [],
  postContent
}: PublishingProgressProps) => {
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'idle':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-orange-200 bg-orange-50'; // Изменили на оранжевый для информации о ручной публикации
      case 'idle':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getDetailedMessage = () => {
    switch (status) {
      case 'starting':
        return 'Инициализация процесса публикации...';
      case 'logging_in':
        return 'Авторизация в Instagram через браузер...';
      case 'uploading':
        return 'Загрузка изображения и заполнение формы...';
      case 'publishing':
        return 'Финальная публикация поста...';
      case 'success':
        return 'Пост успешно опубликован в Instagram!';
      case 'error':
        return message || 'Произошла ошибка при публикации';
      default:
        return message;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  const copyFullContent = () => {
    if (postContent) {
      const fullText = `${postContent.caption}\n\n${postContent.hashtags}`;
      copyToClipboard(fullText);
    }
  };

  const copyCaption = () => {
    if (postContent?.caption) {
      copyToClipboard(postContent.caption);
    }
  };

  const copyHashtags = () => {
    if (postContent?.hashtags) {
      copyToClipboard(postContent.hashtags);
    }
  };

  const openInstagram = () => {
    window.open('https://www.instagram.com', '_blank');
  };

  if (status === 'idle') return null;

  return (
    <>
      <Card className={`${getStatusColor()} border`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {getStatusIcon()}
            <div className="flex-1">
              <span className="font-medium text-sm">{getDetailedMessage()}</span>
              {status !== 'success' && status !== 'error' && (
                <div className="text-xs text-gray-600 mt-1">
                  Процесс выполняется в реальном браузере...
                </div>
              )}
            </div>
          </div>
          
          {status !== 'success' && status !== 'error' && (
            <div className="mb-3">
              <Progress value={progress} className="w-full mb-2" />
              <div className="text-xs text-gray-600 text-center">
                {progress}% завершено
              </div>
            </div>
          )}

          {/* Контент поста - показываем всегда, когда он есть */}
          {postContent && (
            <div className="mb-4 p-4 bg-white rounded-lg border-2 border-dashed border-orange-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Контент для публикации:</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyFullContent}
                  className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать всё
                </Button>
              </div>
              
              {/* Описание */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Описание:</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyCaption}
                    className="h-5 text-xs px-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy className="h-2 w-2 mr-1" />
                    Копировать
                  </Button>
                </div>
                <div className="text-sm bg-gray-50 p-2 rounded border max-h-24 overflow-y-auto">
                  {postContent.caption}
                </div>
              </div>

              {/* Хештеги */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Хештеги:</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyHashtags}
                    className="h-5 text-xs px-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy className="h-2 w-2 mr-1" />
                    Копировать
                  </Button>
                </div>
                <div className="text-sm bg-blue-50 p-2 rounded border text-blue-700">
                  {postContent.hashtags}
                </div>
              </div>

              {/* Изображение */}
              {postContent.imageUrl && (
                <div>
                  <span className="text-xs font-medium text-gray-700 block mb-1">Изображение:</span>
                  <img 
                    src={postContent.imageUrl} 
                    alt="Изображение для поста"
                    className="w-full max-w-xs rounded border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(postContent.imageUrl, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Нажмите для открытия в полном размере</p>
                </div>
              )}
            </div>
          )}

          {/* Кнопки управления */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {screenshots.length > 0 && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowScreenshots(true)}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Скриншоты ({screenshots.length})
              </Button>
            )}
            
            {status === 'error' && postContent && (
              <Button 
                size="sm" 
                variant="default" 
                onClick={openInstagram}
                className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Открыть Instagram
              </Button>
            )}
          </div>
          
          {error && (
            <div className="text-orange-700 text-xs bg-orange-100 p-3 rounded border-orange-200 border">
              <div className="font-medium mb-1">📋 Инструкция:</div>
              <div className="mb-2">{error}</div>
              <div className="text-orange-600 font-medium">
                1. Скопируйте текст и хештеги выше<br/>
                2. Сохраните изображение<br/>
                3. Откройте Instagram и создайте новый пост
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-green-600 text-xs bg-green-100 p-3 rounded">
              <div className="font-medium mb-1">✅ Успешно опубликовано!</div>
              <div>Пост появился в вашем Instagram профиле</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог со скриншотами */}
      <Dialog open={showScreenshots} onOpenChange={setShowScreenshots}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Скриншоты процесса публикации</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.map((screenshot, index) => (
              <div 
                key={index}
                className="cursor-pointer border rounded overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => setSelectedScreenshot(screenshot)}
              >
                <img 
                  src={screenshot} 
                  alt={`Скриншот ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-xs text-center text-gray-600">
                  Шаг {index + 1}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Полноэкранный просмотр скриншота */}
      <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => setSelectedScreenshot(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {selectedScreenshot && (
              <img 
                src={selectedScreenshot} 
                alt="Полный скриншот"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishingProgress;
