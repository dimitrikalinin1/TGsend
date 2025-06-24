
-- Проверим и исправим ограничения для таблицы instagram_auto_posts
ALTER TABLE instagram_auto_posts 
ALTER COLUMN instagram_account_id DROP NOT NULL;

-- Убедимся, что внешний ключ позволяет NULL значения
ALTER TABLE instagram_auto_posts 
DROP CONSTRAINT IF EXISTS instagram_auto_posts_instagram_account_id_fkey;

-- Создаем новый внешний ключ, который позволяет NULL
ALTER TABLE instagram_auto_posts 
ADD CONSTRAINT instagram_auto_posts_instagram_account_id_fkey 
FOREIGN KEY (instagram_account_id) 
REFERENCES instagram_accounts(id) 
ON DELETE SET NULL;
