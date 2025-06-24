
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useInstagramAutoPosts } from "@/hooks/useInstagramAutoPosts";
import AutoPostCreateForm from "./AutoPostCreateForm";
import AutoPostCard from "./AutoPostCard";
import AccountManagerDialog from "./AccountManagerDialog";
import BrowserAutomationSettings from "./BrowserAutomationSettings";
import InstagramApiSettings from "./InstagramApiSettings";

const InstagramAutoPostsTab = () => {
  const { 
    autoPosts, 
    loading, 
    regeneratingPosts,
    publishingStatus,
    generateContent, 
    restorePreviousVersion,
    schedulePost, 
    deleteAutoPost 
  } = useInstagramAutoPosts();

  const handleSchedulePost = async (postId: string, scheduledAt?: Date) => {
    await schedulePost(postId, false);
  };

  const handlePublishNow = async (postId: string) => {
    await schedulePost(postId, true);
  };

  if (loading) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-2 text-sm sm:text-base text-gray-500">Загрузка автопостов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 break-words">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600 flex-shrink-0" />
            <span className="min-w-0">ИИ Автопосты</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base break-words">Автоматическое создание и публикация постов с помощью ИИ</p>
        </div>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-start sm:justify-end">
          <div className="hidden sm:flex gap-2">
            <InstagramApiSettings />
            <BrowserAutomationSettings />
            <AccountManagerDialog />
          </div>
          <AutoPostCreateForm />
        </div>
      </div>

      {/* Мобильные настройки */}
      <div className="flex sm:hidden gap-2 flex-wrap">
        <InstagramApiSettings />
        <BrowserAutomationSettings />
        <AccountManagerDialog />
      </div>

      {autoPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет автопостов</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Создайте первый автопост с помощью ИИ</p>
            <div className="flex justify-center">
              <AutoPostCreateForm />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {autoPosts.map((post) => (
            <AutoPostCard
              key={post.id}
              post={post}
              onGenerateContent={generateContent}
              onRestorePrevious={restorePreviousVersion}
              onSchedulePost={handleSchedulePost}
              onPublishNow={handlePublishNow}
              onDeletePost={deleteAutoPost}
              isRegenerating={regeneratingPosts.has(post.id)}
              publishingStatus={publishingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstagramAutoPostsTab;
