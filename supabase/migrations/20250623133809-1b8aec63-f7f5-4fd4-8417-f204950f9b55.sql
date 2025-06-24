
-- Добавляем поле для хранения истории генераций в таблицу instagram_auto_posts
ALTER TABLE instagram_auto_posts 
ADD COLUMN generation_history JSONB DEFAULT '[]'::jsonb;

-- Добавляем индекс для производительности
CREATE INDEX IF NOT EXISTS idx_instagram_auto_posts_generation_history 
ON instagram_auto_posts USING gin(generation_history);
