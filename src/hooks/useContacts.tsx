
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { validatePhoneNumber, validateTelegramUsername, sanitizeTextInput } from '@/utils/inputValidation';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  username?: string;
  telegram_id?: string;
  group_name?: string;
  is_active: boolean;
  created_at: string;
}

export const useContacts = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadContacts();
    }
  }, [session?.user?.id]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить контакты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    // Валидация
    if (!contactData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Имя контакта обязательно",
        variant: "destructive",
      });
      return null;
    }

    if (contactData.phone && !validatePhoneNumber(contactData.phone)) {
      toast({
        title: "Ошибка",
        description: "Неверный формат номера телефона",
        variant: "destructive",
      });
      return null;
    }

    if (contactData.username && !validateTelegramUsername(contactData.username)) {
      toast({
        title: "Ошибка",
        description: "Неверный формат Telegram username",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contactData,
          name: sanitizeTextInput(contactData.name),
          group_name: contactData.group_name ? sanitizeTextInput(contactData.group_name) : null,
          user_id: session?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setContacts([data, ...contacts]);
      toast({
        title: "Успешно",
        description: "Контакт добавлен",
      });
      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить контакт",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, ...data } : contact
      ));
      
      toast({
        title: "Успешно",
        description: "Контакт обновлен",
      });
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить контакт",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== id));
      toast({
        title: "Контакт удален",
        description: "Контакт успешно удален",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить контакт",
        variant: "destructive",
      });
    }
  };

  const toggleContactStatus = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    await updateContact(id, { is_active: !contact.is_active });
  };

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    toggleContactStatus,
    refreshContacts: loadContacts
  };
};
