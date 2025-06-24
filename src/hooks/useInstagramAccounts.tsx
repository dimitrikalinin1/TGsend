import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeTextInput } from '@/utils/inputValidation';

export interface InstagramAccount {
  id: string;
  user_id: string;
  username: string;
  password?: string;
  name: string;
  session_data?: any;
  proxy_config?: any;
  status: 'active' | 'inactive' | 'banned' | 'limited';
  last_activity?: string | null;
  daily_dm_count: number;
  daily_dm_limit: number;
  last_dm_reset?: string | null;
  use_for_posting?: boolean;
  created_at: string;
  updated_at?: string | null;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  engagement_rate?: number;
  bio?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  is_private?: boolean;
  stats_updated_at?: string | null;
  // OAuth поля
  oauth_access_token?: string | null;
  oauth_refresh_token?: string | null;
  oauth_token_expires_at?: string | null;
  oauth_connected_at?: string | null;
  oauth_provider?: string | null;
  facebook_page_id?: string | null;
}

export const useInstagramAccounts = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
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
        .from('instagram_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedAccounts = (data || []).map(account => ({
        ...account,
        status: account.status as 'active' | 'inactive' | 'banned' | 'limited',
        daily_dm_count: account.daily_dm_count || 0,
        daily_dm_limit: account.daily_dm_limit || 50,
        followers_count: account.followers_count || 0,
        following_count: account.following_count || 0,
        posts_count: account.posts_count || 0,
        engagement_rate: account.engagement_rate || 0.0,
        is_verified: account.is_verified || false,
        is_private: account.is_private || false
      }));
      
      setAccounts(typedAccounts);
    } catch (error) {
      console.error('Error loading Instagram accounts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить Instagram аккаунты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (accountData: {
    username: string;
    password?: string;
    name: string;
    daily_dm_limit?: number;
    use_for_posting?: boolean;
  }) => {
    if (!accountData.username.trim() || !accountData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Username и название аккаунта обязательны",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Создаем зашифрованный объект для хранения пароля
      const sessionData = accountData.password ? {
        encrypted_password: btoa(accountData.password), // Базовое кодирование (в продакшене нужно реальное шифрование)
        login_required: true
      } : null;

      const { data, error } = await supabase
        .from('instagram_accounts')
        .insert({
          username: sanitizeTextInput(accountData.username),
          name: sanitizeTextInput(accountData.name),
          session_data: sessionData,
          daily_dm_limit: accountData.daily_dm_limit || 50,
          use_for_posting: accountData.use_for_posting ?? true,
          user_id: session?.user?.id,
          status: 'active' // Сразу активируем если есть пароль
        })
        .select()
        .single();

      if (error) throw error;

      const typedAccount = {
        ...data,
        password: accountData.password, // Только для локального состояния
        status: data.status as 'active' | 'inactive' | 'banned' | 'limited',
        daily_dm_count: data.daily_dm_count || 0,
        daily_dm_limit: data.daily_dm_limit || 50,
        followers_count: data.followers_count || 0,
        following_count: data.following_count || 0,
        posts_count: data.posts_count || 0,
        engagement_rate: data.engagement_rate || 0.0,
        is_verified: data.is_verified || false,
        is_private: data.is_private || false
      };

      setAccounts([typedAccount, ...accounts]);
      toast({
        title: "Успешно",
        description: "Instagram аккаунт добавлен и готов к публикации",
      });
      return typedAccount;
    } catch (error) {
      console.error('Error adding Instagram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить Instagram аккаунт",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAccount = async (id: string, updates: Partial<InstagramAccount>) => {
    try {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedAccount = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'banned' | 'limited',
        daily_dm_count: data.daily_dm_count || 0,
        daily_dm_limit: data.daily_dm_limit || 50,
        followers_count: data.followers_count || 0,
        following_count: data.following_count || 0,
        posts_count: data.posts_count || 0,
        engagement_rate: data.engagement_rate || 0.0,
        is_verified: data.is_verified || false,
        is_private: data.is_private || false
      };

      setAccounts(accounts.map(account => 
        account.id === id ? { ...account, ...typedAccount } : account
      ));
      
      toast({
        title: "Успешно",
        description: "Instagram аккаунт обновлен",
      });
      return typedAccount;
    } catch (error) {
      console.error('Error updating Instagram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить Instagram аккаунт",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('instagram_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Instagram аккаунт удален",
        description: "Аккаунт успешно удален",
      });
    } catch (error) {
      console.error('Error deleting Instagram account:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить Instagram аккаунт",
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
