
-- Добавляем поля для хранения реальной статистики Instagram аккаунта
ALTER TABLE instagram_accounts 
ADD COLUMN followers_count INTEGER DEFAULT 0,
ADD COLUMN following_count INTEGER DEFAULT 0,
ADD COLUMN posts_count INTEGER DEFAULT 0,
ADD COLUMN engagement_rate DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN bio TEXT,
ADD COLUMN profile_pic_url TEXT,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN is_private BOOLEAN DEFAULT FALSE,
ADD COLUMN stats_updated_at TIMESTAMP WITH TIME ZONE;

-- Добавляем комментарий для пояснения полей
COMMENT ON COLUMN instagram_accounts.followers_count IS 'Количество подписчиков';
COMMENT ON COLUMN instagram_accounts.following_count IS 'Количество подписок';
COMMENT ON COLUMN instagram_accounts.posts_count IS 'Количество постов';
COMMENT ON COLUMN instagram_accounts.engagement_rate IS 'Процент вовлеченности';
COMMENT ON COLUMN instagram_accounts.bio IS 'Биография аккаунта';
COMMENT ON COLUMN instagram_accounts.profile_pic_url IS 'URL аватарки';
COMMENT ON COLUMN instagram_accounts.is_verified IS 'Верифицированный аккаунт';
COMMENT ON COLUMN instagram_accounts.is_private IS 'Приватный аккаунт';
COMMENT ON COLUMN instagram_accounts.stats_updated_at IS 'Время последнего обновления статистики';
