
-- Создаем bucket для хранения загруженных изображений
INSERT INTO storage.buckets (id, name, public) 
VALUES ('autopost-media', 'autopost-media', true);

-- Создаем политики для bucket
CREATE POLICY "Users can upload autopost media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'autopost-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view autopost media" ON storage.objects
FOR SELECT USING (bucket_id = 'autopost-media');

CREATE POLICY "Users can update their autopost media" ON storage.objects
FOR UPDATE USING (bucket_id = 'autopost-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their autopost media" ON storage.objects
FOR DELETE USING (bucket_id = 'autopost-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Добавляем поле для указания, используется ли аккаунт в рассылках
ALTER TABLE instagram_accounts 
ADD COLUMN use_for_posting BOOLEAN DEFAULT true;
