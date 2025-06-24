import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Instagram, Trash2, Eye, Users, MessageSquare, Calendar, CheckCircle, Lock, AlertTriangle } from "lucide-react";
import { useInstagramAccounts } from "@/hooks/useInstagramAccounts";
import InstagramAccountForm from "./InstagramAccountForm";

const InstagramAccountsTab = () => {
  const { accounts, loading, deleteAccount, toggleAccountStatus } = useInstagramAccounts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'banned': return 'Заблокирован';
      case 'limited': return 'Ограничен';
      default: return 'Неизвестно';
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const hasLoginCredentials = (account: any) => {
    return account.session_data?.encrypted_password || account.session_data?.login_required;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Загрузка аккаунтов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Instagram Аккаунты</h2>
          <p className="text-slate-600">Управление аккаунтами для публикации постов</p>
        </div>
        <InstagramAccountForm />
      </div>

      {/* Информация о простой публикации */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Простая публикация готова
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-700">
          <div className="space-y-2">
            <p><strong>Никаких сложных настроек API не нужно:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Просто логин и пароль</strong> - добавьте ваш Instagram аккаунт</li>
              <li><strong>Автоматическая публикация</strong> - система сама публикует посты</li>
              <li><strong>Безопасное хранение</strong> - данные зашифрованы</li>
              <li><strong>Работает как обычный пользователь</strong> - через веб-интерфейс</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative">
                    {account.profile_pic_url ? (
                      <img 
                        src={account.profile_pic_url} 
                        alt={`@${account.username}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Instagram className="h-6 w-6 text-white" />
                    )}
                    {account.is_verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        @{account.username}
                      </h3>
                      {account.is_private && (
                        <Lock className="h-4 w-4 text-slate-500" />
                      )}
                      {hasLoginCredentials(account) && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Готов к публикации
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600">{account.name}</p>
                    {account.bio && (
                      <p className="text-sm text-slate-500 mt-1 max-w-md truncate">{account.bio}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(account.status)}>
                    {getStatusText(account.status)}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Активен</span>
                    <Switch
                      checked={account.status === 'active'}
                      onCheckedChange={() => toggleAccountStatus(account.id)}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Статус готовности к публикации */}
              {!hasLoginCredentials(account) && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Требуется настройка</span>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Добавьте пароль для возможности публикации постов
                  </p>
                </div>
              )}
              
              {/* Детальная информация об аккаунте */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <MessageSquare className="h-4 w-4 mx-auto mb-1 text-slate-600" />
                  <p className="text-sm text-slate-600">DM сегодня</p>
                  <p className="text-lg font-bold text-slate-800">
                    {account.daily_dm_count} / {account.daily_dm_limit}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-slate-600" />
                  <p className="text-sm text-slate-600">Последняя активность</p>
                  <p className="text-xs text-slate-800">
                    {account.last_activity ? 
                      new Date(account.last_activity).toLocaleDateString('ru-RU') : 
                      'Никогда'
                    }
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <Eye className="h-4 w-4 mx-auto mb-1 text-slate-600" />
                  <p className="text-sm text-slate-600">Вовлеченность</p>
                  <p className="text-xs text-slate-800">{account.engagement_rate?.toFixed(1) || '0.0'}%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <Users className="h-4 w-4 mx-auto mb-1 text-slate-600" />
                  <p className="text-sm text-slate-600">Для публикаций</p>
                  <p className="text-xs text-slate-800">
                    {account.use_for_posting ? 'Да' : 'Нет'}
                  </p>
                </div>
              </div>

              {/* Реальная статистика аккаунта */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm text-slate-700">Статистика аккаунта</h4>
                  {account.stats_updated_at && (
                    <span className="text-xs text-slate-500">
                      Обновлено: {new Date(account.stats_updated_at).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      {formatNumber(account.posts_count)}
                    </div>
                    <div className="text-xs text-slate-600">постов</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      {formatNumber(account.followers_count)}
                    </div>
                    <div className="text-xs text-slate-600">подписчиков</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      {formatNumber(account.following_count)}
                    </div>
                    <div className="text-xs text-slate-600">подписок</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Instagram className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Нет добавленных аккаунтов
            </h3>
            <p className="text-slate-500 mb-4">
              Добавьте Instagram аккаунт с логином и паролем для публикации постов
            </p>
            <InstagramAccountForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstagramAccountsTab;
