
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeTextInput } from '@/utils/inputValidation';

export interface TelegramAccount {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  api_token: string; // Это API ID + API Hash, а не bot token
  status: 'active' | 'inactive' | 'banned';
  last_activity?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const useTelegramAccounts = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<TelegramAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadAccounts();
    }
  }, [session?.user?.id]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('telegram_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedAccounts = (data || []).map(account => ({
        ...account,
        status: account.status as 'active' | 'inactive' | 'banned'
      }));
      
      setAccounts(typedAccounts);
    } catch (error) {
      console.error('Error loading Telegram accounts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить Telegram аккаунты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (accountData: {
    name: string;
    phone: string;
    api_id: string;
    api_hash: string;
  }) => {
    if (!accountData.name.trim() || !accountData.phone.trim() || !accountData.api_id.trim() || !accountData.api_hash.trim()) {
      toast({
        title: "Ошибка",
        description: "Все поля обязательны",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Комбинируем API ID и API Hash для хранения
      const combinedApiToken = `${accountData.api_id}:${accountData.api_hash}`;
      
      const { data, error } = await supabase
        .from('telegram_accounts')
        .insert({
          name: sanitizeTextInput(accountData.name),
          phone: sanitizeTextInput(accountData.phone),
          api_token: combinedApiToken,
          user_id: session?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const typedAccount = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'banned'
      };

      setAccounts([typedAccount, ...accounts]);
      toast({
        title: "Успешно",
        description: "Telegram аккаунт добавлен",
      });
      return typedAccount;
    } catch (error) {
      console.error('Error adding Telegram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить Telegram аккаунт",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAccount = async (id: string, updates: Partial<TelegramAccount>) => {
    try {
      const { data, error } = await supabase
        .from('telegram_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedAccount = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'banned'
      };

      setAccounts(accounts.map(account => 
        account.id === id ? { ...account, ...typedAccount } : account
      ));
      
      toast({
        title: "Успешно",
        description: "Telegram аккаунт обновлен",
      });
      return typedAccount;
    } catch (error) {
      console.error('Error updating Telegram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить Telegram аккаунт",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('telegram_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Telegram аккаунт удален",
        description: "Аккаунт успешно удален",
      });
    } catch (error) {
      console.error('Error deleting Telegram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить Telegram аккаунт",
        variant: "destructive",
      });
    }
  };

  const toggleAccountStatus = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    const newStatus = account.status === 'active' ? 'inactive' : 'active';
    await updateAccount(id, { status: newStatus });
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    refreshAccounts: loadAccounts
  };
};
