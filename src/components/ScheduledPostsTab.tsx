
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Edit3 } from "lucide-react";
import { useInstagramAutoPosts } from "@/hooks/useInstagramAutoPosts";
import AutoPostCard from "./AutoPostCard";

const ScheduledPostsTab = () => {
  const { 
    autoPosts, 
    loading, 
    regeneratingPosts,
    publishingStatus,
    generateContent, 
    restorePreviousVersion,
    schedulePost, 
    deleteAutoPost,
    updateScheduledDate
  } = useInstagramAutoPosts();

  const scheduledPosts = autoPosts.filter(post => post.status === 'scheduled');

  const handleSchedulePost = async (postId: string, scheduledAt?: Date) => {
    if (scheduledAt) {
      await updateScheduledDate(postId, scheduledAt);
    } else {
      await schedulePost(postId, false);
    }
  };

  const handlePublishNow = async (postId: string) => {
    await schedulePost(postId, true);
  };

  if (loading) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-2 text-sm sm:text-base text-gray-500">Загрузка запланированных постов...</p>
      </div>
    );
  }

  if (scheduledPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Запланированные посты</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Посты, которые ожидают публикации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет запланированных постов</h3>
            <p className="text-sm sm:text-base text-gray-500 break-words">Созданные автопосты появятся здесь после планирования</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 break-words">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
          <span className="min-w-0">Запланированные посты</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base break-words">Управляйте запланированными к публикации постами</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {scheduledPosts.map((post) => (
          <AutoPostCard
            key={post.id}
            post={post}
            onGenerateContent={generateContent}
            onRestorePrevious={restorePreviousVersion}
            onSchedulePost={handleSchedulePost}
            onPublishNow={handlePublishNow}
            onDeletePost={deleteAutoPost}
            isRegenerating={regeneratingPosts.has(post.id)}
            showScheduleControls={true}
            publishingStatus={publishingStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduledPostsTab;
