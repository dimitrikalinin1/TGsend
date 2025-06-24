import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useSecureApi } from './useSecureApi';
import type { Database } from '@/integrations/supabase/types';

type AutoPostRow = Database['public']['Tables']['instagram_auto_posts']['Row'];

interface GenerationHistory {
  timestamp: string;
  caption: string;
  hashtags: string;
  version: number;
}

export interface AutoPost {
  id: string;
  user_id: string;
  title: string;
  style_prompt: string;
  content_url: string;
  content_type: 'image' | 'video';
  generated_caption?: string | null;
  generated_hashtags?: string | null;
  generation_history: GenerationHistory[];
  status: 'pending' | 'generated' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string | null;
  published_at?: string | null;
  instagram_account_id: string | null;
  created_at: string;
  updated_at?: string | null;
}

const parseGenerationHistory = (history: any): GenerationHistory[] => {
  if (!history || !Array.isArray(history)) return [];
  return history.filter((item: any) => 
    item && 
    typeof item === 'object' && 
    item.timestamp && 
    item.caption && 
    item.hashtags &&
    typeof item.version === 'number'
  );
};

export interface PublishingStatus {
  postId: string | null;
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

export const useInstagramAutoPosts = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { makeSecureRequest } = useSecureApi();
  const [autoPosts, setAutoPosts] = useState<AutoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingPosts, setRegeneratingPosts] = useState<Set<string>>(new Set());
  const [publishingStatus, setPublishingStatus] = useState<PublishingStatus>({
    postId: null,
    status: 'idle',
    progress: 0,
    message: '',
    error: undefined,
    screenshots: [],
    postContent: undefined
  });

  useEffect(() => {
    if (session?.user?.id) {
      loadAutoPosts();
    }
  }, [session?.user?.id]);

  const loadAutoPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('instagram_auto_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Преобразуем данные из базы в наш тип AutoPost
      const typedData: AutoPost[] = (data || []).map((post: AutoPostRow) => ({
        ...post,
        content_type: post.content_type as 'image' | 'video',
        status: post.status as 'pending' | 'generated' | 'scheduled' | 'published' | 'failed',
        generated_caption: post.generated_caption || undefined,
        generated_hashtags: post.generated_hashtags || undefined,
        generation_history: parseGenerationHistory(post.generation_history),
        scheduled_at: post.scheduled_at || undefined,
        published_at: post.published_at || undefined,
        updated_at: post.updated_at || undefined,
        instagram_account_id: post.instagram_account_id
      }));
      
      setAutoPosts(typedData);
    } catch (error) {
      console.error('Error loading auto posts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить автопосты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAutoPost = async (postData: {
    title: string;
    style_prompt: string;
    content_url: string;
    content_type: 'image' | 'video';
    instagram_account_id?: string;
  }) => {
    try {
      console.log('Creating auto post with data:', postData);
      console.log('User ID:', session?.user?.id);

      if (!session?.user?.id) {
        throw new Error('Пользователь не авторизован');
      }

      const insertData = {
        title: postData.title,
        style_prompt: postData.style_prompt,
        content_url: postData.content_url,
        content_type: postData.content_type,
        instagram_account_id: postData.instagram_account_id || null,
        user_id: session.user.id,
        status: 'pending'
      };

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('instagram_auto_posts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Created post data:', data);

      // Преобразуем данные из базы в наш тип AutoPost
      const typedPost: AutoPost = {
        ...data,
        content_type: data.content_type as 'image' | 'video',
        status: data.status as 'pending' | 'generated' | 'scheduled' | 'published' | 'failed',
        generated_caption: data.generated_caption || undefined,
        generated_hashtags: data.generated_hashtags || undefined,
        generation_history: parseGenerationHistory(data.generation_history),
        scheduled_at: data.scheduled_at || undefined,
        published_at: data.published_at || undefined,
        updated_at: data.updated_at || undefined,
        instagram_account_id: data.instagram_account_id
      };

      setAutoPosts([typedPost, ...autoPosts]);
      toast({
        title: "Успешно",
        description: "Автопост создан",
      });
      return typedPost;
    } catch (error) {
      console.error('Error creating auto post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast({
        title: "Ошибка",
        description: `Не удалось создать автопост: ${errorMessage}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const generateContent = async (postId: string) => {
    try {
      setRegeneratingPosts(prev => new Set(prev).add(postId));
      
      // Сохраняем текущую версию в историю перед генерацией новой
      const currentPost = autoPosts.find(post => post.id === postId);
      if (currentPost && currentPost.generated_caption) {
        await saveToHistory(postId, currentPost.generated_caption, currentPost.generated_hashtags || '');
      }
      
      const result = await makeSecureRequest('generate-instagram-content', { postId });
      
      await loadAutoPosts(); // Refresh the list
      
      toast({
        title: "Успешно",
        description: "Контент сгенерирован ИИ",
      });
      
      return result;
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать контент",
        variant: "destructive",
      });
      return null;
    } finally {
      setRegeneratingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const saveToHistory = async (postId: string, caption: string, hashtags: string) => {
    try {
      const currentPost = autoPosts.find(post => post.id === postId);
      if (!currentPost) return;

      const newHistoryItem: GenerationHistory = {
        timestamp: new Date().toISOString(),
        caption,
        hashtags,
        version: (currentPost.generation_history.length || 0) + 1
      };

      // Оставляем только последние 5 версий
      const updatedHistory = [...currentPost.generation_history, newHistoryItem].slice(-5);

      await supabase
        .from('instagram_auto_posts')
        .update({ generation_history: updatedHistory as any })
        .eq('id', postId);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const restorePreviousVersion = async (postId: string, historyIndex: number) => {
    try {
      const currentPost = autoPosts.find(post => post.id === postId);
      if (!currentPost || !currentPost.generation_history[historyIndex]) return;

      const selectedVersion = currentPost.generation_history[historyIndex];
      
      // Сохраняем текущую версию в историю
      if (currentPost.generated_caption) {
        await saveToHistory(postId, currentPost.generated_caption, currentPost.generated_hashtags || '');
      }

      // Восстанавливаем выбранную версию
      await supabase
        .from('instagram_auto_posts')
        .update({
          generated_caption: selectedVersion.caption,
          generated_hashtags: selectedVersion.hashtags,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      await loadAutoPosts();
      
      toast({
        title: "Успешно",
        description: `Восстановлена версия ${selectedVersion.version}`,
      });
    } catch (error) {
      console.error('Error restoring previous version:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось восстановить версию",
        variant: "destructive",
      });
    }
  };

  const schedulePost = async (postId: string, publishNow: boolean = false) => {
    try {
      const currentPost = autoPosts.find(post => post.id === postId);
      if (!currentPost) {
        throw new Error('Пост не найден');
      }

      // Сохраняем контент поста для отображения
      const postContent = {
        caption: currentPost.generated_caption || '',
        hashtags: currentPost.generated_hashtags || '',
        imageUrl: currentPost.content_url
      };

      setPublishingStatus({
        postId,
        status: 'starting',
        progress: 10,
        message: 'Подготовка к публикации...',
        error: undefined,
        screenshots: [],
        postContent
      });

      if (currentPost.status !== 'generated' && currentPost.status !== 'scheduled' && currentPost.status !== 'failed') {
        throw new Error('Пост должен быть сгенерирован перед публикацией');
      }

      if (!currentPost.generated_caption) {
        throw new Error('Сначала нужно сгенерировать контент для поста');
      }

      // Проверяем настройки Instagram Graph API (только если они есть)
      setPublishingStatus(prev => ({
        ...prev,
        status: 'logging_in',
        progress: 25,
        message: 'Проверка доступных методов публикации...'
      }));

      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('user_id', session?.user?.id)
        .eq('setting_key', 'instagram_graph_api')
        .single();

      let useGraphApi = false;
      
      // Пытаемся использовать Graph API только если настройки полностью корректны
      if (!settingsError && settingsData?.setting_value) {
        const apiConfig = settingsData.setting_value as any;
        if (apiConfig.access_token && apiConfig.instagram_account_id && apiConfig.app_id) {
          setPublishingStatus(prev => ({
            ...prev,
            status: 'uploading',
            progress: 40,
            message: 'Попытка публикации через Instagram Graph API...'
          }));

          try {
            const result = await makeSecureRequest('instagram-graph-api', { postId }, { showErrorToast: false });
            
            if (result.success) {
              setPublishingStatus(prev => ({
                ...prev,
                status: 'success',
                progress: 100,
                message: 'Пост успешно опубликован через Instagram API!',
                screenshots: result.screenshots || []
              }));

              setTimeout(() => {
                setPublishingStatus({
                  postId: null,
                  status: 'idle',
                  progress: 0,
                  message: '',
                  error: undefined,
                  screenshots: [],
                  postContent: undefined
                });
              }, 5000);

              toast({
                title: "Успешно",
                description: `Пост опубликован в аккаунте @${result.instagram_account}`,
              });

              await loadAutoPosts();
              return result;
            }
          } catch (apiError) {
            console.log('Graph API недоступен, используем браузерную автоматизацию:', apiError);
            // Продолжаем с браузерной автоматизацией без показа ошибки
          }
        }
      }

      // Используем браузерную автоматизацию как основной метод
      setPublishingStatus(prev => ({
        ...prev,
        status: 'logging_in',
        progress: 50,
        message: 'Поиск аккаунта для публикации...'
      }));

      let accountId = currentPost.instagram_account_id;
      
      if (!accountId) {
        const { data: accounts, error: accountsError } = await supabase
          .from('instagram_accounts')
          .select('id')
          .eq('status', 'active')
          .eq('use_for_posting', true)
          .limit(1);

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
          throw new Error('Ошибка при получении аккаунтов Instagram');
        }

        if (!accounts || accounts.length === 0) {
          throw new Error('Нет активных аккаунтов Instagram для публикации. Добавьте аккаунт с логином и паролем в настройках.');
        }

        accountId = accounts[0].id;
        
        await supabase
          .from('instagram_auto_posts')
          .update({ instagram_account_id: accountId })
          .eq('id', postId);
      }

      setPublishingStatus(prev => ({
        ...prev,
        status: 'uploading',
        progress: 80,
        message: 'Попытка публикации через браузер...'
      }));

      try {
        const result = await makeSecureRequest('instagram-browser-automation', { 
          postId, 
          accountId: accountId
        }, { showErrorToast: false });

        // Обрабатываем ответ независимо от статуса
        if (result.success) {
          setPublishingStatus(prev => ({
            ...prev,
            status: 'success',
            progress: 100,
            message: 'Пост успешно опубликован!',
            screenshots: result.screenshots || []
          }));

          setTimeout(() => {
            setPublishingStatus({
              postId: null,
              status: 'idle',
              progress: 0,
              message: '',
              error: undefined,
              screenshots: [],
              postContent: undefined
            });
          }, 5000);

          toast({
            title: "Успешно",
            description: "Пост опубликован",
          });
        } else {
          // Это ожидаемая ситуация - Instagram блокирует автоматизацию
          setPublishingStatus(prev => ({
            ...prev,
            status: 'error',
            progress: 100,
            message: 'Instagram блокирует автоматизацию. Контент готов для ручной публикации.',
            error: 'Используйте контент выше для ручной публикации в Instagram',
            screenshots: result.screenshots || [],
            postContent: result.postContent || prev.postContent
          }));

          toast({
            title: "Информация",
            description: "Контент готов для ручной публикации в Instagram",
            variant: "default",
          });

          setTimeout(() => {
            setPublishingStatus({
              postId: null,
              status: 'idle',
              progress: 0,
              message: '',
              error: undefined,
              screenshots: [],
              postContent: undefined
            });
          }, 20000); // Дольше показываем для ручной публикации
        }
      } catch (automationError) {
        console.error('Browser automation error:', automationError);
        
        setPublishingStatus(prev => ({
          ...prev,
          status: 'error',
          progress: 0,
          message: 'Контент готов для ручной публикации',
          error: 'Скопируйте текст и изображение для публикации в Instagram вручную'
        }));

        setTimeout(() => {
          setPublishingStatus({
            postId: null,
            status: 'idle',
            progress: 0,
            message: '',
            error: undefined,
            screenshots: [],
            postContent: undefined
          });
        }, 15000);

        toast({
          title: "Информация",
          description: "Контент готов для ручной публикации",
          variant: "default",
        });
      }
      
      await loadAutoPosts();
      return { success: true };
      
    } catch (error) {
      console.error('Error publishing post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      setPublishingStatus(prev => ({
        ...prev,
        status: 'error',
        progress: 0,
        message: 'Ошибка при подготовке к публикации',
        error: errorMessage
      }));

      setTimeout(() => {
        setPublishingStatus({
          postId: null,
          status: 'idle',
          progress: 0,
          message: '',
          error: undefined,
          screenshots: [],
          postContent: undefined
        });
      }, 8000);

      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateScheduledDate = async (postId: string, scheduledAt: Date) => {
    try {
      const { error } = await supabase
        .from('instagram_auto_posts')
        .update({ 
          scheduled_at: scheduledAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      await loadAutoPosts();
      
      toast({
        title: "Успешно",
        description: "Время публикации обновлено",
      });
    } catch (error) {
      console.error('Error updating scheduled date:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить время публикации",
        variant: "destructive",
      });
    }
  };

  const deleteAutoPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('instagram_auto_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAutoPosts(autoPosts.filter(post => post.id !== id));
      toast({
        title: "Автопост удален",
        description: "Автопост успешно удален",
      });
    } catch (error) {
      console.error('Error deleting auto post:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автопост",
        variant: "destructive",
      });
    }
  };

  return {
    autoPosts,
    loading,
    regeneratingPosts,
    publishingStatus,
    createAutoPost,
    generateContent,
    restorePreviousVersion,
    schedulePost,
    updateScheduledDate,
    deleteAutoPost,
    refreshAutoPosts: loadAutoPosts
  };
};
