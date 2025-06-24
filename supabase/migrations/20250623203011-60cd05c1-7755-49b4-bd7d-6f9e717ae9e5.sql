
-- Добавляем колонки для OAuth токенов в таблицу instagram_accounts
ALTER TABLE public.instagram_accounts 
ADD COLUMN oauth_access_token TEXT,
ADD COLUMN oauth_refresh_token TEXT,
ADD COLUMN oauth_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN oauth_connected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN oauth_provider TEXT DEFAULT 'instagram', -- 'instagram' или 'facebook'
ADD COLUMN facebook_page_id TEXT; -- для Business аккаунтов через Facebook

-- Добавляем индекс для быстрого поиска по OAuth токенам
CREATE INDEX idx_instagram_accounts_oauth_token ON public.instagram_accounts(oauth_access_token);

-- Обновляем функцию для сброса ежедневных лимитов
CREATE OR REPLACE FUNCTION public.refresh_oauth_tokens()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Здесь в будущем можно добавить логику для обновления истекающих OAuth токенов
  -- через refresh_token перед тем как они истекут
  UPDATE instagram_accounts 
  SET updated_at = NOW()
  WHERE oauth_token_expires_at IS NOT NULL 
    AND oauth_token_expires_at < NOW() + INTERVAL '7 days'; -- обновляем за неделю до истечения
END;
$function$;
