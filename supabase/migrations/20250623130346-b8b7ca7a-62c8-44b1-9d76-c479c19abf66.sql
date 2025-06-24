
-- Создаем таблицу для Instagram автопостов
CREATE TABLE public.instagram_auto_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  style_prompt TEXT NOT NULL,
  content_url TEXT NOT NULL, -- URL на Google Drive или другое облако
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video')),
  generated_caption TEXT,
  generated_hashtags TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'scheduled', 'published', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  instagram_account_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id) ON DELETE CASCADE
);

-- Создаем индексы для производительности
CREATE INDEX idx_instagram_auto_posts_user_id ON instagram_auto_posts(user_id);
CREATE INDEX idx_instagram_auto_posts_status ON instagram_auto_posts(status);
CREATE INDEX idx_instagram_auto_posts_scheduled_at ON instagram_auto_posts(scheduled_at);
CREATE INDEX idx_instagram_auto_posts_account_id ON instagram_auto_posts(instagram_account_id);

-- Добавляем триггер для updated_at
CREATE TRIGGER update_instagram_auto_posts_updated_at 
  BEFORE UPDATE ON instagram_auto_posts 
  FOR EACH ROW EXECUTE PROCEDURE update_instagram_updated_at_column();

-- Функция для автоматической публикации запланированных постов (для будущего использования)
CREATE OR REPLACE FUNCTION process_scheduled_auto_posts()
RETURNS void AS $$
BEGIN
  -- Здесь в будущем можно добавить логику для автоматической публикации
  -- постов через Instagram API когда придет назначенное время
  UPDATE instagram_auto_posts 
  SET status = 'published', published_at = NOW()
  WHERE status = 'scheduled' 
    AND scheduled_at <= NOW()
    AND scheduled_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
