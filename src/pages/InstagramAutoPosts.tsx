
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Calendar, CheckCircle, Clock } from "lucide-react";
import InstagramAutoPostsTab from "@/components/InstagramAutoPostsTab";
import ScheduledPostsTab from "@/components/ScheduledPostsTab";
import PublishedPostsTab from "@/components/PublishedPostsTab";

const InstagramAutoPosts = () => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 break-words">
          <Bot className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-pink-600 flex-shrink-0" />
          <span className="min-w-0">ИИ Автопосты</span>
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
          Автоматическое создание и публикация постов в Instagram с помощью искусственного интеллекта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600 flex-shrink-0" />
              <span className="truncate">ИИ Генерация</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              Автоматическое создание привлекательных описаний и хештегов на основе вашего контента
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
              <span className="truncate">Умное планирование</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              ИИ определяет оптимальное время для публикации ваших постов
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-teal-50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <span className="truncate">Автопубликация</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              Полная автоматизация процесса публикации постов в назначенное время
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="autoposts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="autoposts" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Автопосты</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Запланированные</span>
          </TabsTrigger>
          <TabsTrigger value="published" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="truncate">Опубликованные</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="autoposts" className="mt-4 sm:mt-6">
          <InstagramAutoPostsTab />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4 sm:mt-6">
          <ScheduledPostsTab />
        </TabsContent>

        <TabsContent value="published" className="mt-4 sm:mt-6">
          <PublishedPostsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstagramAutoPosts;
