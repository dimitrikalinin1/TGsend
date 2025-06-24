
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, User, Shield, CheckCircle, Zap } from "lucide-react";

const InstagramApiWarning = () => {
  return (
    <div className="space-y-4">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Рекомендуется: Instagram Graph API</AlertTitle>
        <AlertDescription className="text-green-700">
          <p className="mb-2">Для надежной публикации используйте официальный Instagram Graph API.</p>
          <p>✅ Стабильная работа</p>
          <p>✅ Высокая скорость публикации</p>
          <p>✅ Официальная поддержка Instagram</p>
        </AlertDescription>
      </Alert>
      
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">Альтернатива: Браузерная автоматизация</AlertTitle>
        <AlertDescription className="text-orange-700">
          <p className="mb-2">Instagram может блокировать автоматизацию публикации постов.</p>
          <p>⚠️ Нестабильная работа</p>
          <p>⚠️ Возможные блокировки</p>
          <p>⚠️ Требует логин/пароль</p>
        </AlertDescription>
      </Alert>
      
      <Alert className="border-blue-200 bg-blue-50">
        <User className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Как использовать систему</AlertTitle>
        <AlertDescription className="text-blue-700 space-y-2">
          <p><strong>Вариант 1 (рекомендуется):</strong></p>
          <p>1. Настройте Instagram Graph API через кнопку "Instagram API"</p>
          <p>2. Создавайте автопосты с ИИ-генерацией контента</p>
          <p>3. Публикуйте автоматически через официальный API</p>
          
          <p className="mt-3"><strong>Вариант 2 (резервный):</strong></p>
          <p>1. Добавьте Instagram аккаунт с логином и паролем</p>
          <p>2. Создавайте автопосты с ИИ-генерацией</p>
          <p>3. При неудаче копируйте контент для ручной публикации</p>
        </AlertDescription>
      </Alert>

      <Alert className="border-purple-200 bg-purple-50">
        <Zap className="h-4 w-4 text-purple-600" />
        <AlertTitle className="text-purple-800">Быстрая настройка API</AlertTitle>
        <AlertDescription className="text-purple-700">
          <p className="mb-2">У вас есть готовый токен Instagram? Используйте быструю настройку!</p>
          <p>• Нажмите кнопку "Instagram API"</p>
          <p>• Выберите "Заполнить данными из инструкции"</p>
          <p>• Сохраните настройки</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InstagramApiWarning;
