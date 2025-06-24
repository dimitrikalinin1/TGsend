
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, MessageSquare, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import TelegramAccountsTab from "@/components/TelegramAccountsTab";
import InstagramAccountsTab from "@/components/InstagramAccountsTab";

const Accounts = () => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');
  const [activeTab, setActiveTab] = useState("active");

  const handleAddAccount = () => {
    // Переключаемся на активную вкладку и триггерим добавление
    setActiveTab("active");
    // Здесь можно добавить дополнительную логику если нужно
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {isInstagramMode ? <Instagram className="h-8 w-8 text-pink-600" /> : <MessageSquare className="h-8 w-8 text-blue-600" />}
            {isInstagramMode ? 'Instagram аккаунты' : 'Telegram аккаунты'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstagramMode ? 'Управление Instagram аккаунтами для рассылок' : 'Управление Telegram аккаунтами для рассылок'}
          </p>
        </div>
        <Button 
          className={isInstagramMode ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" : "bg-blue-600 hover:bg-blue-700"}
          onClick={handleAddAccount}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isInstagramMode ? 'Добавить аккаунт' : 'Добавить аккаунт'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="pending">Ожидают</TabsTrigger>
          <TabsTrigger value="blocked">Заблокированные</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isInstagramMode ? <InstagramAccountsTab /> : <TelegramAccountsTab />}
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ожидающие подтверждения
              </CardTitle>
              <CardDescription>
                {isInstagramMode ? 'Instagram аккаунты, ожидающие верификации' : 'Telegram аккаунты, ожидающие активации'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет ожидающих</h3>
                <p className="text-gray-500">
                  {isInstagramMode ? 'Все аккаунты активны или заблокированы' : 'Все аккаунты активны или заблокированы'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Заблокированные
              </CardTitle>
              <CardDescription>
                {isInstagramMode ? 'Instagram аккаунты с ограничениями' : 'Telegram аккаунты с ограничениями'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заблокированных</h3>
                <p className="text-gray-500">
                  {isInstagramMode ? 'Все аккаунты работают нормально' : 'Все аккаунты работают нормально'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounts;
