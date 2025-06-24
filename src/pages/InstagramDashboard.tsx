
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Send, Users, Database, BarChart3, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const InstagramDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Активные аккаунты", 
      value: "0", 
      icon: Instagram, 
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-100"
    },
    { 
      title: "Контакты", 
      value: "0", 
      icon: Users, 
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-100"
    },
    { 
      title: "Отправлено DM", 
      value: "0", 
      icon: Send, 
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-50 to-yellow-100"
    },
    { 
      title: "Активные кампании", 
      value: "0", 
      icon: BarChart3, 
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-100"
    },
  ];

  const quickActions = [
    { title: "Добавить Instagram аккаунт", description: "Подключите новый Instagram аккаунт", action: () => navigate('/instagram/accounts'), icon: Instagram },
    { title: "Импорт контактов", description: "Загрузите контакты из файла", action: () => navigate('/instagram/contacts'), icon: Database },
    { title: "Создать рассылку", description: "Запустите новую DM кампанию", action: () => navigate('/instagram/campaigns'), icon: Send },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Instagram Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-instagram-50 via-white to-pink-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-instagram-200/20 via-transparent to-transparent"></div>
        
        <div className="relative text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-instagram-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Instagram
                </span>
                <br />
                <span className="text-ios-gray-900 font-light">для бизнеса</span>
              </h1>
              <p className="text-xl text-ios-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Профессиональная платформа для автоматизации Instagram Direct Messages и роста аудитории
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-instagram-400 to-pink-600 border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-600 border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-600 border-2 border-white shadow-lg"></div>
                </div>
                <span className="text-sm text-ios-gray-500 font-medium ml-2">Тысячи брендов</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="neo-card floating-card group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">За последний месяц</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Начните прямо сейчас</h2>
          <p className="text-gray-600 max-w-lg mx-auto">Выберите действие для запуска вашей Instagram-кампании</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="neo-card floating-card cursor-pointer group relative overflow-hidden border-0" 
              onClick={action.action}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-pink-50/30 group-hover:from-pink-50/50 group-hover:to-purple-50/30 transition-all duration-500"></div>
              
              <CardHeader className="relative z-10 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 group-hover:from-purple-500 group-hover:to-orange-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 mb-2">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 py-3 rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Начать работу
                </Button>
              </CardContent>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <Card className="neo-card border-0 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer"></div>
        
        <CardHeader className="relative z-10 text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-xl">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
            Мощные возможности Instagram
          </CardTitle>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Используйте все преимущества платформы для эффективного продвижения в Instagram
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-200 w-fit mx-auto">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Автоматизация</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Массовые DM рассылки</li>
                  <li>Персонализация</li>
                  <li>Отложенная отправка</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-200 w-fit mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Таргетинг</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Умная сегментация</li>
                  <li>Анализ аудитории</li>
                  <li>Geo-таргетинг</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-yellow-200 w-fit mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Аналитика</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Статистика доставки</li>
                  <li>Engagement metrics</li>
                  <li>Conversion tracking</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-100 to-cyan-200 w-fit mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Масштабирование</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Множественные аккаунты</li>
                  <li>Высокая скорость</li>
                  <li>Безопасность</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstagramDashboard;
