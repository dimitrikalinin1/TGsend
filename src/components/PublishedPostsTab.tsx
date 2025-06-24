
import { useState, useMemo } from "react";
import { useInstagramAutoPosts } from "@/hooks/useInstagramAutoPosts";
import AutoPostCard from "./AutoPostCard";
import PublishingProgress from "./PublishingProgress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PublishedPostsTab = () => {
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

  const publishedPosts = useMemo(() => 
    autoPosts.filter(post => post.status === 'published'),
    [autoPosts]
  );

  const failedPosts = useMemo(() => 
    autoPosts.filter(post => post.status === 'failed'),
    [autoPosts]
  );

  const handleSchedulePost = async (postId: string, scheduledAt?: Date) => {
    // For now, just publish immediately since we're not using scheduled dates
    await schedulePost(postId, false);
  };

  const handlePublishNow = async (postId: string) => {
    await schedulePost(postId, true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {publishingStatus.status !== 'idle' && (
        <PublishingProgress
          status={publishingStatus.status}
          progress={publishingStatus.progress}
          message={publishingStatus.message}
          error={publishingStatus.error}
        />
      )}

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published">
            Опубликованные ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            С ошибками ({failedPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6">
          {publishedPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Пока нет опубликованных постов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedPosts.map((post) => (
                <AutoPostCard
                  key={post.id}
                  post={post}
                  onGenerateContent={generateContent}
                  onRestorePrevious={restorePreviousVersion}
                  onSchedulePost={handleSchedulePost}
                  onPublishNow={handlePublishNow}
                  onDeletePost={deleteAutoPost}
                  isRegenerating={regeneratingPosts.has(post.id)}
                  isPublished={true}
                  publishingStatus={publishingStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          {failedPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Нет постов с ошибками</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">Посты с ошибками публикации</h3>
                <p className="text-sm text-red-600 mb-3">
                  Эти посты не удалось опубликовать. Вы можете попробовать опубликовать их снова или удалить.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {failedPosts.map((post) => (
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
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublishedPostsTab;
