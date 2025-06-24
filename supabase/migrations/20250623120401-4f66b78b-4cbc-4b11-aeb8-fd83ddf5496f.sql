
-- Создаем таблицу для Instagram аккаунтов
CREATE TABLE public.instagram_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  session_data JSONB, -- Храним данные сессии для авторизации
  proxy_config JSONB, -- Настройки прокси если нужны
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'banned', 'limited')),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  daily_dm_count INTEGER DEFAULT 0,
  daily_dm_limit INTEGER DEFAULT 50, -- Лимит DM в день
  last_dm_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу для Instagram контактов
CREATE TABLE public.instagram_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  user_id_instagram TEXT, -- Instagram internal user ID
  is_active BOOLEAN DEFAULT true,
  group_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, username)
);

-- Создаем таблицу для логов Instagram сообщений
CREATE TABLE public.instagram_message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  instagram_account_id UUID NOT NULL,
  instagram_contact_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (instagram_contact_id) REFERENCES instagram_contacts(id) ON DELETE CASCADE
);

-- Добавляем поле platform в таблицу campaigns для различения Telegram и Instagram кампаний
ALTER TABLE public.campaigns 
ADD COLUMN platform TEXT DEFAULT 'telegram' CHECK (platform IN ('telegram', 'instagram'));

-- Создаем индексы для производительности
CREATE INDEX idx_instagram_accounts_user_id ON instagram_accounts(user_id);
CREATE INDEX idx_instagram_accounts_status ON instagram_accounts(status);
CREATE INDEX idx_instagram_contacts_user_id ON instagram_contacts(user_id);
CREATE INDEX idx_instagram_contacts_username ON instagram_contacts(username);
CREATE INDEX idx_instagram_message_logs_campaign_id ON instagram_message_logs(campaign_id);
CREATE INDEX idx_instagram_message_logs_status ON instagram_message_logs(status);

-- Добавляем триггеры для updated_at
CREATE OR REPLACE FUNCTION update_instagram_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instagram_accounts_updated_at 
  BEFORE UPDATE ON instagram_accounts 
  FOR EACH ROW EXECUTE PROCEDURE update_instagram_updated_at_column();

CREATE TRIGGER update_instagram_contacts_updated_at 
  BEFORE UPDATE ON instagram_contacts 
  FOR EACH ROW EXECUTE PROCEDURE update_instagram_updated_at_column();

-- Функция для сброса дневного счетчика DM
CREATE OR REPLACE FUNCTION reset_daily_dm_counts()
RETURNS void AS $$
BEGIN
  UPDATE instagram_accounts 
  SET daily_dm_count = 0, last_dm_reset = CURRENT_DATE
  WHERE last_dm_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
