
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Trash2, Clock, Zap, Edit3, Bot, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { AutoPost } from "@/hooks/useInstagramAutoPosts";
import PostScheduler from "./PostScheduler";
import GenerationControls from "./GenerationControls";
import PublishingProgress from "./PublishingProgress";

interface AutoPostCardProps {
  post: AutoPost;
  onGenerateContent: (id: string) => void;
  onRestorePrevious: (id: string, historyIndex: number) => void;
  onSchedulePost: (id: string, scheduledAt?: Date) => void;
  onPublishNow: (id: string) => void;
  onDeletePost: (id: string) => void;
  isRegenerating?: boolean;
  showScheduleControls?: boolean;
  isPublished?: boolean;
  publishingStatus?: {
    postId: string | null;
    status: 'idle' | 'starting' | 'logging_in' | 'uploading' | 'publishing' | 'success' | 'error';
    progress: number;
    message: string;
    error?: string;
  };
}

const AutoPostCard = ({ 
  post, 
  onGenerateContent,
  onRestorePrevious,
  onSchedulePost, 
  onPublishNow, 
  onDeletePost,
  isRegenerating = false,
  showScheduleControls = false,
  isPublished = false,
  publishingStatus
}: AutoPostCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'generated': return 'Сгенерирован';
      case 'scheduled': return 'Запланирован';
      case 'published': return 'Опубликован';
      case 'failed': return 'Ошибка';
      default: return status;
    }
  };

  // Парсим стиль и язык
  const [style, language] = post.style_prompt.split('|');
  const displayStyle = style || post.style_prompt;

  const isCurrentlyPublishing = publishingStatus?.postId === post.id && publishingStatus.status !== 'idle';

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-pink-600" />
            <CardTitle className="text-sm">Автопост</CardTitle>
          </div>
          <Badge className={`text-xs ${getStatusColor(post.status)}`}>
            {getStatusText(post.status)}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">
          Стиль: {displayStyle}
          {language && <span className="ml-2">Язык: {language.toUpperCase()}</span>}
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1">
        {post.content_url && (
          <div className="mb-3">
            <img 
              src={post.content_url} 
              alt="Post content" 
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}
        
        {post.generated_caption && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg flex-1">
            <h4 className="font-medium text-xs mb-1">Сгенерированный текст:</h4>
            <p className="text-xs text-gray-700 line-clamp-3">{post.generated_caption}</p>
            {post.generated_hashtags && (
              <p className="text-xs text-blue-600 mt-1 line-clamp-2">{post.generated_hashtags}</p>
            )}
          </div>
        )}

        {!isPublished && post.status !== 'published' && (
          <div className="mb-3">
            <GenerationControls
              currentCaption={post.generated_caption}
              currentHashtags={post.generated_hashtags}
              generationHistory={post.generation_history || []}
              onRegenerate={() => onGenerateContent(post.id)}
              onRestorePrevious={(index) => onRestorePrevious(post.id, index)}
              isRegenerating={isRegenerating}
            />
          </div>
        )}

        {post.scheduled_at && post.status === 'scheduled' && (
          <div className="mb-3 p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700">
              <Clock className="h-3 w-3 inline mr-1" />
              Запланировано: {new Date(post.scheduled_at).toLocaleString('ru-RU')}
            </p>
          </div>
        )}

        {post.published_at && post.status === 'published' && (
          <div className="mb-3 p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Опубликовано: {new Date(post.published_at).toLocaleString('ru-RU')}
            </p>
          </div>
        )}

        {post.status === 'failed' && (
          <div className="mb-3 p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Ошибка публикации
            </p>
          </div>
        )}
        
        <div className="mt-auto space-y-2">
          <div className="text-xs text-gray-500">
            <Clock className="h-3 w-3 inline mr-1" />
            {new Date(post.created_at).toLocaleDateString('ru-RU')}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {(post.status === 'generated' || post.status === 'failed') && !isPublished && post.generated_caption && (
              <>
                <PostScheduler
                  postId={post.id}
                  onSchedulePost={onSchedulePost}
                  onPublishNow={onPublishNow}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPublishNow(post.id)}
                  className="text-xs h-7 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                  title={post.status === 'failed' ? 'Попробовать снова' : 'Опубликовать сейчас'}
                  disabled={isCurrentlyPublishing}
                >
                  {isCurrentlyPublishing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                </Button>
              </>
            )}

            {post.status === 'scheduled' && showScheduleControls && (
              <>
                <PostScheduler
                  postId={post.id}
                  onSchedulePost={onSchedulePost}
                  onPublishNow={onPublishNow}
                  currentScheduledAt={post.scheduled_at ? new Date(post.scheduled_at) : undefined}
                  isEditing={true}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPublishNow(post.id)}
                  className="text-xs h-7 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                  title="Опубликовать сейчас"
                  disabled={isCurrentlyPublishing}
                >
                  {isCurrentlyPublishing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                </Button>
              </>
            )}
            
            {!isPublished && post.status !== 'published' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeletePost(post.id)}
                className="text-xs h-7"
                disabled={isCurrentlyPublishing}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoPostCard;
