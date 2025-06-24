
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Send, MessageCircle, BarChart3, MessageSquare, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');

  // Mock data for charts
  const campaignData = [
    { name: 'Пн', sent: 120, delivered: 118, opened: 95 },
    { name: 'Вт', sent: 150, delivered: 145, opened: 120 },
    { name: 'Ср', sent: 180, delivered: 175, opened: 140 },
    { name: 'Чт', sent: 220, delivered: 210, opened: 180 },
    { name: 'Пт', sent: 200, delivered: 195, opened: 165 },
    { name: 'Сб', sent: 160, delivered: 155, opened: 130 },
    { name: 'Вс', sent: 140, delivered: 135, opened: 110 },
  ];

  const platformData = [
    { name: isInstagramMode ? 'DM' : 'Личные', value: 65, color: isInstagramMode ? '#E91E63' : '#3B82F6' },
    { name: isInstagramMode ? 'Stories' : 'Группы', value: 25, color: isInstagramMode ? '#9C27B0' : '#10B981' },
    { name: isInstagramMode ? 'Comments' : 'Каналы', value: 10, color: isInstagramMode ? '#FF9800' : '#F59E0B' },
  ];

  const stats = [
    { 
      title: "Всего отправлено", 
      value: "12,450", 
      change: "+12%", 
      icon: Send, 
      color: isInstagramMode ? "text-pink-600" : "text-blue-600" 
    },
    { 
      title: "Доставлено", 
      value: "11,890", 
      change: "+8%", 
      icon: TrendingUp, 
      color: "text-green-600" 
    },
    { 
      title: "Активные контакты", 
      value: "8,234", 
      change: "+15%", 
      icon: Users, 
      color: "text-purple-600" 
    },
    { 
      title: "Получили ответ", 
      value: "3,456", 
      change: "+22%", 
      icon: MessageCircle, 
      color: "text-orange-600" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {isInstagramMode ? <Instagram className="h-8 w-8 text-pink-600" /> : <MessageSquare className="h-8 w-8 text-blue-600" />}
            Аналитика
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstagramMode ? 'Статистика и аналитика Instagram рассылок' : 'Статистика и аналитика Telegram рассылок'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-sm text-green-600 mt-1">{stat.change} за неделю</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
          <TabsTrigger value="audience">Аудитория</TabsTrigger>
          <TabsTrigger value="performance">Эффективность</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Активность за неделю
                </CardTitle>
                <CardDescription>
                  Статистика отправленных и доставленных сообщений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill={isInstagramMode ? "#E91E63" : "#3B82F6"} name="Отправлено" />
                    <Bar dataKey="delivered" fill={isInstagramMode ? "#9C27B0" : "#10B981"} name="Доставлено" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Распределение по типам
                </CardTitle>
                <CardDescription>
                  {isInstagramMode ? 'Типы Instagram сообщений' : 'Типы Telegram сообщений'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Эффективность кампаний
              </CardTitle>
              <CardDescription>
                Динамика открытий и ответов по дням
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke={isInstagramMode ? "#E91E63" : "#3B82F6"} 
                    strokeWidth={2} 
                    name="Прочитано"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke={isInstagramMode ? "#9C27B0" : "#10B981"} 
                    strokeWidth={2} 
                    name="Доставлено"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Анализ аудитории
              </CardTitle>
              <CardDescription>
                Статистика по активности пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Анализ аудитории</h3>
                <p className="text-gray-500">Детальная аналитика аудитории будет доступна после первых рассылок</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Показатели эффективности
              </CardTitle>
              <CardDescription>
                Ключевые метрики производительности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Метрики эффективности</h3>
                <p className="text-gray-500">Данные о производительности появятся после запуска кампаний</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
