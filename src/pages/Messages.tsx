
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Plus, Edit, Trash2, MessageSquare, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";

const Messages = () => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');
  const { templates, loading } = useMessageTemplates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {isInstagramMode ? <Instagram className="h-8 w-8 text-pink-600" /> : <MessageSquare className="h-8 w-8 text-blue-600" />}
            Шаблоны сообщений
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstagramMode ? 'Создание и управление шаблонами для Instagram DM' : 'Создание и управление шаблонами для Telegram'}
          </p>
        </div>
        <Button className={isInstagramMode ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" : "bg-blue-600 hover:bg-blue-700"}>
          <Plus className="h-4 w-4 mr-2" />
          Создать шаблон
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все шаблоны</TabsTrigger>
          <TabsTrigger value="text">Текстовые</TabsTrigger>
          <TabsTrigger value="media">С медиа</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Загрузка шаблонов...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет шаблонов</h3>
                <p className="text-gray-500">Создайте первый шаблон сообщения</p>
              </div>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Тип: {template.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {template.content}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {template.type === 'text' ? 'Текст' : 'Медиа'}
                      </span>
                      <Button variant="outline" size="sm">
                        Использовать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Текстовые шаблоны
              </CardTitle>
              <CardDescription>
                Шаблоны только с текстом
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет текстовых шаблонов</h3>
                <p className="text-gray-500">Создайте текстовый шаблон</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Медиа шаблоны
              </CardTitle>
              <CardDescription>
                Шаблоны с изображениями или видео
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет медиа шаблонов</h3>
                <p className="text-gray-500">Создайте шаблон с медиа</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
