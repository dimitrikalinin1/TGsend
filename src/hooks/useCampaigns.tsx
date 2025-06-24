
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  message_template_id?: string | null;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  platform: 'telegram' | 'instagram';
  scheduled_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const useCampaigns = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadCampaigns();
    }
  }, [session?.user?.id]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedCampaigns = (data || []).map(campaign => ({
        ...campaign,
        status: campaign.status as 'draft' | 'scheduled' | 'running' | 'completed' | 'paused',
        platform: campaign.platform as 'telegram' | 'instagram' || 'telegram',
        total_recipients: campaign.total_recipients || 0,
        sent_count: campaign.sent_count || 0,
        delivered_count: campaign.delivered_count || 0,
        failed_count: campaign.failed_count || 0
      }));
      
      setCampaigns(typedCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить кампании",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (campaignData: {
    title: string;
    status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
    message_template_id?: string;
    total_recipients?: number;
    platform: 'telegram' | 'instagram';
  }) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaignData,
          user_id: session?.user?.id,
          total_recipients: campaignData.total_recipients || 0
        })
        .select()
        .single();

      if (error) throw error;

      const typedCampaign = {
        ...data,
        status: data.status as 'draft' | 'scheduled' | 'running' | 'completed' | 'paused',
        platform: data.platform as 'telegram' | 'instagram',
        total_recipients: data.total_recipients || 0,
        sent_count: data.sent_count || 0,
        delivered_count: data.delivered_count || 0,
        failed_count: data.failed_count || 0
      };

      setCampaigns([typedCampaign, ...campaigns]);
      toast({
        title: "Успешно",
        description: "Кампания создана",
      });
      return typedCampaign;
    } catch (error) {
      console.error('Error adding campaign:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать кампанию",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedCampaign = {
        ...data,
        status: data.status as 'draft' | 'scheduled' | 'running' | 'completed' | 'paused',
        platform: data.platform as 'telegram' | 'instagram',
        total_recipients: data.total_recipients || 0,
        sent_count: data.sent_count || 0,
        delivered_count: data.delivered_count || 0,
        failed_count: data.failed_count || 0
      };

      setCampaigns(campaigns.map(campaign => 
        campaign.id === id ? { ...campaign, ...typedCampaign } : campaign
      ));
      
      return typedCampaign;
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить кампанию",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      toast({
        title: "Кампания удалена",
        description: "Кампания успешно удалена",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить кампанию",
        variant: "destructive",
      });
    }
  };

  return {
    campaigns,
    loading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns: loadCampaigns
  };
};
