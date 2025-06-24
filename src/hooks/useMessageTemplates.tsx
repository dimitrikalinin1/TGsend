
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { validateMessageContent, sanitizeTextInput } from '@/utils/inputValidation';

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'media';
  media_url?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to map database row to MessageTemplate interface
const mapDatabaseToTemplate = (dbRow: any): MessageTemplate => {
  return {
    id: dbRow.id,
    title: dbRow.title,
    content: dbRow.content,
    type: (dbRow.type || 'text') as MessageTemplate['type'],
    media_url: dbRow.media_url || undefined,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at || dbRow.created_at
  };
};

export const useMessageTemplates = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadTemplates();
    }
  }, [session?.user?.id]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedTemplates = (data || []).map(mapDatabaseToTemplate);
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить шаблоны",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (templateData: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    // Валидация
    if (!templateData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Название шаблона обязательно",
        variant: "destructive",
      });
      return null;
    }

    const contentError = validateMessageContent(templateData.content);
    if (contentError) {
      toast({
        title: "Ошибка",
        description: contentError,
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          title: sanitizeTextInput(templateData.title),
          content: sanitizeTextInput(templateData.content),
          type: templateData.type,
          media_url: templateData.media_url || null,
          user_id: session?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const newTemplate = mapDatabaseToTemplate(data);
      setTemplates([newTemplate, ...templates]);
      toast({
        title: "Успешно",
        description: "Шаблон создан",
      });
      return newTemplate;
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать шаблон",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<MessageTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTemplate = mapDatabaseToTemplate(data);
      setTemplates(templates.map(template => 
        template.id === id ? updatedTemplate : template
      ));
      
      toast({
        title: "Успешно",
        description: "Шаблон обновлен",
      });
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить шаблон",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(templates.filter(template => template.id !== id));
      toast({
        title: "Шаблон удален",
        description: "Шаблон успешно удален",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить шаблон",
        variant: "destructive",
      });
    }
  };

  return {
    templates,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: loadTemplates
  };
};
