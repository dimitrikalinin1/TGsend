
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, Play, Pause, Square, BarChart3, MessageSquare, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";

const Campaigns = () => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');
  const { campaigns, loading } = useCampaigns();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Активна';
      case 'paused': return 'Приостановлена';
      case 'completed': return 'Завершена';
      case 'draft': return 'Черновик';
      case 'scheduled': return 'Запланирована';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {isInstagramMode ? <Instagram className="h-8 w-8 text-pink-600" /> : <MessageSquare className="h-8 w-8 text-blue-600" />}
            Кампании
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstagramMode ? 'Управление Instagram DM кампаниями' : 'Управление Telegram рассылками'}
          </p>
        </div>
        <Button className={isInstagramMode ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" : "bg-blue-600 hover:bg-blue-700"}>
          <Plus className="h-4 w-4 mr-2" />
          Создать кампанию
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все кампании</TabsTrigger>
          <TabsTrigger value="running">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="draft">Черновики</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Загрузка кампаний...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет кампаний</h3>
                <p className="text-gray-500">Создайте первую кампанию для начала работы</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{campaign.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Платформа: {campaign.platform}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.total_recipients || 0}</div>
                        <div className="text-sm text-gray-500">Получателей</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{campaign.sent_count || 0}</div>
                        <div className="text-sm text-gray-500">Отправлено</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{campaign.delivered_count || 0}</div>
                        <div className="text-sm text-gray-500">Доставлено</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{campaign.failed_count || 0}</div>
                        <div className="text-sm text-gray-500">Ошибки</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Создана: {new Date(campaign.created_at).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'running' && (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-1" />
                            Пауза
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Продолжить
                          </Button>
                        )}
                        {(campaign.status === 'draft' || campaign.status === 'paused') && (
                          <Button variant="outline" size="sm">
                            <Square className="h-4 w-4 mr-1" />
                            Остановить
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Статистика
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="running">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Активные кампании
              </CardTitle>
              <CardDescription>
                Кампании, которые сейчас выполняются
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет активных кампаний</h3>
                <p className="text-gray-500">Запустите кампанию для начала рассылки</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Завершенные кампании
              </CardTitle>
              <CardDescription>
                История выполненных рассылок
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет завершенных кампаний</h3>
                <p className="text-gray-500">Завершенные кампании появятся здесь</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Черновики кампаний
              </CardTitle>
              <CardDescription>
                Незавершенные кампании
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет черновиков</h3>
                <p className="text-gray-500">Создайте новую кампанию</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Campaigns;
