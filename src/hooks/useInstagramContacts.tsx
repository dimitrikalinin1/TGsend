
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeTextInput } from '@/utils/inputValidation';

export interface InstagramContact {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  user_id_instagram?: string;
  is_active: boolean;
  group_name?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export const useInstagramContacts = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<InstagramContact[]>([]);
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
        .from('instagram_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading Instagram contacts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить Instagram контакты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: {
    username: string;
    display_name?: string;
    group_name?: string;
    notes?: string;
  }) => {
    if (!contactData.username.trim()) {
      toast({
        title: "Ошибка",
        description: "Username обязателен",
        variant: "destructive",
      });
      return null;
    }

    // Проверяем, что username начинается с @
    const username = contactData.username.startsWith('@') 
      ? contactData.username.slice(1) 
      : contactData.username;

    try {
      const { data, error } = await supabase
        .from('instagram_contacts')
        .insert({
          username: sanitizeTextInput(username),
          display_name: contactData.display_name ? sanitizeTextInput(contactData.display_name) : null,
          group_name: contactData.group_name ? sanitizeTextInput(contactData.group_name) : null,
          notes: contactData.notes ? sanitizeTextInput(contactData.notes) : null,
          user_id: session?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setContacts([data, ...contacts]);
      toast({
        title: "Успешно",
        description: "Instagram контакт добавлен",
      });
      return data;
    } catch (error) {
      console.error('Error adding Instagram contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить Instagram контакт",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContact = async (id: string, updates: Partial<InstagramContact>) => {
    try {
      const { data, error } = await supabase
        .from('instagram_contacts')
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
        description: "Instagram контакт обновлен",
      });
      return data;
    } catch (error) {
      console.error('Error updating Instagram contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить Instagram контакт",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('instagram_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== id));
      toast({
        title: "Instagram контакт удален",
        description: "Контакт успешно удален",
      });
    } catch (error) {
      console.error('Error deleting Instagram contact:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить Instagram контакт",
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
