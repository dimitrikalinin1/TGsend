
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Trash2, Plus } from "lucide-react";
import { useTelegramAccounts } from "@/hooks/useTelegramAccounts";

const TelegramAccountsTab = () => {
  const { accounts, loading, addAccount, deleteAccount, toggleAccountStatus } = useTelegramAccounts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    phone: "",
    api_id: "",
    api_hash: ""
  });

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addAccount(newAccount);
    if (result) {
      setNewAccount({ name: "", phone: "", api_id: "", api_hash: "" });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'banned': return 'Заблокирован';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Загрузка аккаунтов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Telegram Аккаунты</h2>
          <p className="text-slate-600">Управление аккаунтами для рассылки</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить аккаунт
        </Button>
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Добавить Telegram аккаунт</CardTitle>
            <CardDescription>
              Для работы нужны API ID и API Hash из my.telegram.org
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccount}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    placeholder="Мой аккаунт"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="api_id">API ID</Label>
                  <Input
                    id="api_id"
                    placeholder="12345678"
                    value={newAccount.api_id}
                    onChange={(e) => setNewAccount({...newAccount, api_id: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="api_hash">API Hash</Label>
                  <Input
                    id="api_hash"
                    placeholder="abcdef123456..."
                    value={newAccount.api_hash}
                    onChange={(e) => setNewAccount({...newAccount, api_hash: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Как получить данные аккаунта:</h4>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                  <li>Зайдите на <a href="https://my.telegram.org" target="_blank" className="underline">my.telegram.org</a></li>
                  <li>Авторизуйтесь с вашим номером телефона</li>
                  <li>Создайте новое приложение в разделе "API development tools"</li>
                  <li>Скопируйте API ID и API Hash</li>
                </ol>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  Добавить аккаунт
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Telegram аккаунты
            </CardTitle>
            <CardDescription>
              Добавьте свои Telegram аккаунты для рассылок. Рассылка будет происходить как будто вы лично отправляете сообщения.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет аккаунтов</h3>
              <p className="text-gray-500 mb-4">Добавьте первый аккаунт для начала работы</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первый аккаунт
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {account.name}
                      </h3>
                      <p className="text-slate-600">{account.phone}</p>
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
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Последняя активность</p>
                    <p className="text-sm text-slate-800">
                      {account.last_activity ? 
                        new Date(account.last_activity).toLocaleDateString('ru-RU') : 
                        'Никогда'
                      }
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Добавлен</p>
                    <p className="text-sm text-slate-800">
                      {new Date(account.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelegramAccountsTab;
