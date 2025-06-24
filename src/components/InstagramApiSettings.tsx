import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, ExternalLink, CheckCircle, AlertCircle, Copy, Search, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSecureApi } from "@/hooks/useSecureApi";

interface ApiConfig {
  app_id: string;
  app_secret: string;
  access_token: string;
  instagram_account_id: string;
}

const InstagramApiSettings = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { makeSecureRequest } = useSecureApi();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [searchingAccounts, setSearchingAccounts] = useState(false);
  const [foundAccounts, setFoundAccounts] = useState<any[]>([]);
  const [config, setConfig] = useState<ApiConfig>({
    app_id: '',
    app_secret: '',
    access_token: '',
    instagram_account_id: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkApiConfiguration();
  }, [session?.user?.id]);

  const checkApiConfiguration = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('user_id', session.user.id)
        .eq('setting_key', 'instagram_graph_api')
        .maybeSingle();

      if (!error && data && data.setting_value) {
        const savedConfig = data.setting_value as Record<string, any>;
        if (savedConfig && typeof savedConfig === 'object' && 
            'app_id' in savedConfig && 'app_secret' in savedConfig) {
          setConfig(savedConfig as ApiConfig);
          setIsConfigured(!!savedConfig.instagram_account_id && !!savedConfig.access_token);
        }
      } else {
        setIsConfigured(false);
      }
    } catch (error) {
      console.error('Error checking API configuration:', error);
      setIsConfigured(false);
    }
  };

  const testApiConnection = async () => {
    if (!config.access_token || !config.instagram_account_id) {
      toast({
        title: "Ошибка",
        description: "Заполните токен доступа и ID аккаунта",
        variant: "destructive",
      });
      return;
    }

    try {
      setTestingApi(true);
      
      // Проверяем доступность Instagram аккаунта
      const checkResponse = await fetch(`https://graph.facebook.com/v18.0/${config.instagram_account_id}?fields=id,username,name&access_token=${config.access_token}`);
      const checkData = await checkResponse.json();
      
      if (checkData.error) {
        throw new Error(checkData.error.message);
      }

      toast({
        title: "Подключение успешно!",
        description: `Аккаунт @${checkData.username} готов к использованию`,
      });
    } catch (error) {
      console.error('API test error:', error);
      toast({
        title: "Ошибка подключения",
        description: error instanceof Error ? error.message : "Не удалось подключиться к Instagram API",
        variant: "destructive",
      });
    } finally {
      setTestingApi(false);
    }
  };

  const searchInstagramAccounts = async () => {
    if (!config.access_token) {
      toast({
        title: "Ошибка",
        description: "Сначала введите Access Token",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearchingAccounts(true);
      setFoundAccounts([]);

      const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${config.access_token}`);
      const pagesData = await pagesResponse.json();

      console.log('Facebook Pages:', pagesData);

      if (pagesData.error) {
        throw new Error(pagesData.error.message);
      }

      if (!pagesData.data || pagesData.data.length === 0) {
        toast({
          title: "Страницы Facebook не найдены",
          description: "У вас нет доступных страниц Facebook. Создайте страницу Facebook и подключите к ней Instagram Business аккаунт.",
          variant: "destructive",
        });
        return;
      }

      const allInstagramAccounts = [];
      
      for (const page of pagesData.data) {
        try {
          const instagramResponse = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${config.access_token}`);
          const instagramData = await instagramResponse.json();
          
          if (instagramData.instagram_business_account) {
            const detailsResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramData.instagram_business_account.id}?fields=id,username,name,profile_picture_url&access_token=${config.access_token}`);
            const details = await detailsResponse.json();
            
            allInstagramAccounts.push({
              id: instagramData.instagram_business_account.id,
              username: details.username || 'Unknown',
              name: details.name || 'Unknown',
              profile_picture_url: details.profile_picture_url,
              facebook_page: page.name
            });
          }
        } catch (error) {
          console.error(`Error fetching Instagram for page ${page.name}:`, error);
        }
      }

      setFoundAccounts(allInstagramAccounts);

      if (allInstagramAccounts.length === 0) {
        toast({
          title: "Instagram Business аккаунты не найдены",
          description: "К вашим страницам Facebook не подключены Instagram Business аккаунты.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Аккаунты найдены",
          description: `Найдено ${allInstagramAccounts.length} Instagram Business аккаунт(ов)`,
        });
      }

    } catch (error) {
      console.error('Error searching Instagram accounts:', error);
      toast({
        title: "Ошибка поиска",
        description: error instanceof Error ? error.message : "Не удалось найти Instagram аккаунты",
        variant: "destructive",
      });
    } finally {
      setSearchingAccounts(false);
    }
  };

  const selectAccount = (accountId: string) => {
    setConfig(prev => ({ ...prev, instagram_account_id: accountId }));
    toast({
      title: "Аккаунт выбран",
      description: "Instagram Business Account ID установлен",
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      const configData = {
        app_id: config.app_id,
        app_secret: config.app_secret,
        access_token: config.access_token,
        instagram_account_id: config.instagram_account_id
      };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          setting_key: 'instagram_graph_api',
          setting_value: configData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsConfigured(true);
      setIsOpen(false);
      
      toast({
        title: "Настройки сохранены",
        description: "Instagram Graph API успешно настроен",
      });
    } catch (error) {
      console.error('Error saving API config:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ApiConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    });
  };

  const quickSetup = () => {
    setConfig({
      app_id: '',
      app_secret: '',
      access_token: 'IGAAJSZAxT6SrtBZAE55QnkyMTZANR0QwVUhyaEFwaFNxMGR2VmxIQlJITTRPdEVPLUZAMRWF6cmpreEh2LVl0N0VoRVhCYWxxalVPamtocjhFVHNzVjJ5c3U4NXpsYk1kMklhUWpOb1NOSUhzekhpem9TSVBZAbmR5dUY1N0pMdjVtTQZDZD',
      instagram_account_id: '17841474910662082'
    });
    toast({
      title: "Быстрая настройка",
      description: "Новый токен и ID аккаунта заполнены автоматически",
    });
  };

  const isFormValid = config.access_token && config.instagram_account_id;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Instagram API
          {isConfigured ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-orange-600" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Настройка Instagram Graph API
          </DialogTitle>
          <DialogDescription>
            Подключите официальный Instagram Graph API для публикации постов
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Быстрая настройка */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Быстрая настройка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 mb-3">
                У вас есть готовый токен доступа? Используйте быструю настройку!
              </p>
              <Button onClick={quickSetup} className="bg-blue-600 hover:bg-blue-700">
                Заполнить данными из инструкции
              </Button>
            </CardContent>
          </Card>

          {/* Форма настройки */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app_id">App ID (необязательно)</Label>
              <Input
                id="app_id"
                placeholder="App ID из Meta for Developers"
                value={config.app_id}
                onChange={(e) => handleInputChange('app_id', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app_secret">App Secret (необязательно)</Label>
              <Input
                id="app_secret"
                type="password"
                placeholder="App Secret"
                value={config.app_secret}
                onChange={(e) => handleInputChange('app_secret', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access_token">Access Token *</Label>
              <Input
                id="access_token"
                type="password"
                placeholder="Вставьте ваш токен доступа"
                value={config.access_token}
                onChange={(e) => handleInputChange('access_token', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="instagram_account_id">Instagram Business Account ID *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={searchInstagramAccounts}
                    disabled={!config.access_token || searchingAccounts}
                    className="gap-2"
                  >
                    {searchingAccounts ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        Поиск...
                      </>
                    ) : (
                      <>
                        <Search className="h-3 w-3" />
                        Найти
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={testApiConnection}
                    disabled={!config.access_token || !config.instagram_account_id || testingApi}
                    className="gap-2"
                  >
                    {testingApi ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                        Тест...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-3 w-3" />
                        Тест
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Input
                id="instagram_account_id"
                placeholder="17841474910662082"
                value={config.instagram_account_id}
                onChange={(e) => handleInputChange('instagram_account_id', e.target.value)}
              />

              {/* Найденные аккаунты */}
              {foundAccounts.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-medium text-green-800">Найденные Instagram Business аккаунты:</p>
                  {foundAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center gap-2">
                        {account.profile_picture_url && (
                          <img src={account.profile_picture_url} alt={account.username} className="w-8 h-8 rounded-full" />
                        )}
                        <div>
                          <p className="text-xs font-medium">@{account.username}</p>
                          <p className="text-xs text-gray-600">{account.name}</p>
                          <p className="text-xs text-gray-400 font-mono">ID: {account.id}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => selectAccount(account.id)}
                        className="text-xs"
                      >
                        Выбрать
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Статус готовности */}
            {isFormValid ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-2">🎉 Instagram Graph API готов!</p>
                      <p>Теперь вы можете публиковать посты через официальный API Instagram</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium mb-2">Заполните обязательные поля:</p>
                      <p>• Access Token</p>
                      <p>• Instagram Business Account ID</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Кнопки действий */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isFormValid || loading}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {loading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramApiSettings;
