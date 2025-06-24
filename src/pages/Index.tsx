
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Database, BarChart3, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Telegram аккаунты", 
      value: "0", 
      icon: () => (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ), 
      color: "from-brand-500 to-brand-600",
      bgColor: "from-brand-50 to-brand-100"
    },
    { 
      title: "Контакты", 
      value: "0", 
      icon: Users, 
      color: "from-success-500 to-success-600",
      bgColor: "from-success-50 to-success-100"
    },
    { 
      title: "Отправлено", 
      value: "0", 
      icon: () => (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ), 
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    { 
      title: "Кампании", 
      value: "0", 
      icon: BarChart3, 
      color: "from-accent-500 to-accent-600",
      bgColor: "from-accent-50 to-accent-100"
    },
  ];

  const quickActions = [
    { 
      title: "Добавить аккаунт", 
      description: "Подключите Telegram аккаунт", 
      action: () => navigate('/accounts'), 
      icon: () => (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      )
    },
    { title: "Импорт контактов", description: "Загрузите контакты", action: () => navigate('/contacts'), icon: Database },
    { 
      title: "Создать рассылку", 
      description: "Запустите кампанию", 
      action: () => navigate('/campaigns'), 
      icon: () => (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-telegram-50 via-white to-telegram-100/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-telegram-200/20 via-transparent to-transparent"></div>
        
        <div className="relative text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-telegram-600 via-telegram-500 to-telegram-700 bg-clip-text text-transparent">
                  Telegram
                </span>
                <br />
                <span className="text-ios-gray-900 font-light">для бизнеса</span>
              </h1>
              <p className="text-xl text-ios-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Элегантная платформа для автоматизации рассылок и управления контактами в Telegram
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-telegram-400 to-telegram-600 border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ios-green to-ios-teal border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ios-purple to-ios-pink border-2 border-white shadow-lg"></div>
                </div>
                <span className="text-sm text-ios-gray-500 font-medium ml-2">1000+ компаний</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="px-4 pb-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6 + (index * 0.1),
                ease: [0.4, 0, 0.2, 1] 
              }}
            >
              <div className="ios-card group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-30 rounded-3xl`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xs text-ios-gray-500 font-medium bg-white/50 px-2 py-1 rounded-full">
                      +12%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-ios-gray-700">{stat.title}</h3>
                    <div className="text-3xl font-bold text-ios-gray-900">{stat.value}</div>
                    <div className="text-xs text-ios-gray-500">За месяц</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-6xl mx-auto space-y-12"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ios-gray-900 mb-3 font-light">Начните за минуту</h2>
            <p className="text-ios-gray-600 max-w-lg mx-auto font-light">Выберите действие для быстрого старта</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + (index * 0.1),
                  ease: [0.4, 0, 0.2, 1] 
                }}
                onClick={action.action}
                className="ios-card cursor-pointer group"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-telegram-500 to-telegram-600 shadow-lg">
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-ios-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-ios-gray-900 font-medium">
                      {action.title}
                    </h3>
                    <p className="text-ios-gray-600 leading-relaxed font-light">
                      {action.description}
                    </p>
                  </div>
                  
                  <button className="ios-button-telegram w-full py-3 px-6 text-sm font-medium">
                    Начать
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="ios-card overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-12">
                <div className="inline-flex p-4 rounded-3xl bg-gradient-to-r from-telegram-500 to-telegram-600 shadow-xl mb-6">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-ios-gray-900 mb-3 font-light">
                  Возможности Telegram
                </h2>
                <p className="text-ios-gray-600 max-w-2xl mx-auto font-light">
                  Всё необходимое для эффективной автоматизации в одной платформе
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { emoji: '🤖', title: 'Автоматизация', items: ['Массовые рассылки', 'Умные сценарии', 'Планировщик'] },
                  { emoji: '👥', title: 'Управление', items: ['База контактов', 'Сегментация', 'Теги и фильтры'] },
                  { emoji: '📊', title: 'Аналитика', items: ['Статистика доставки', 'Отчеты кампаний', 'ROI метрики'] },
                  { emoji: '⚡', title: 'Производительность', items: ['Высокая скорость', 'Безопасность', 'Масштабируемость'] }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + (index * 0.1) }}
                    className="text-center space-y-4"
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-telegram-100 to-telegram-200 shadow-sm">
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ios-gray-900 mb-3 font-medium">{feature.title}</h3>
                      <ul className="text-sm text-ios-gray-600 space-y-2 font-light">
                        {feature.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
