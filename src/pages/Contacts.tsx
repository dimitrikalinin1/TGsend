
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Upload, Download, Plus, MessageSquare, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";
import TelegramContactsTab from "@/components/TelegramContactsTab";
import InstagramContactsTab from "@/components/InstagramContactsTab";

const Contacts = () => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 break-words">
            {isInstagramMode ? <Instagram className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-pink-600 flex-shrink-0" /> : <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />}
            <span className="min-w-0">Контакты</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
            {isInstagramMode ? 'Управление контактами для Instagram рассылок' : 'Управление контактами для Telegram рассылок'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2 lg:gap-3 justify-start sm:justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className={`flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3 py-2 h-8 sm:h-9 ${
              isInstagramMode 
                ? "border-pink-200 text-pink-600 hover:bg-pink-50" 
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Экспорт</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3 py-2 h-8 sm:h-9 ${
              isInstagramMode 
                ? "border-pink-200 text-pink-600 hover:bg-pink-50" 
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Импорт</span>
          </Button>
          <Button 
            size="sm"
            className={`flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3 py-2 h-8 sm:h-9 ${
              isInstagramMode 
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Добавить</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Все контакты</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Активные</span>
          </TabsTrigger>
          <TabsTrigger value="blocked" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Заблокированные</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Группы</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 sm:mt-6">
          {isInstagramMode ? <InstagramContactsTab /> : <TelegramContactsTab />}
        </TabsContent>

        <TabsContent value="active" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Активные контакты</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Контакты, готовые для получения сообщений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет активных контактов</h3>
                <p className="text-sm sm:text-base text-gray-500">Добавьте контакты для начала работы</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Заблокированные контакты</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Контакты, которые заблокировали рассылки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет заблокированных</h3>
                <p className="text-sm sm:text-base text-gray-500">Все контакты активны</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Группы контактов</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Организация контактов по группам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет групп</h3>
                <p className="text-sm sm:text-base text-gray-500">Создайте группы для лучшей организации</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contacts;
