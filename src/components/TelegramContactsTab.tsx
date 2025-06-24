
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Trash2, MessageCircle } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";

const TelegramContactsTab = () => {
  const { contacts, loading } = useContacts();

  if (loading) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm sm:text-base text-gray-500">Загрузка контактов...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Контакты</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Здесь будут отображаться ваши Telegram контакты
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет контактов</h3>
            <p className="text-sm sm:text-base text-gray-500">Добавьте первый контакт для начала работы</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{contact.name}</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1 break-all">
                  {contact.username && `@${contact.username}`}
                  {contact.phone && ` • ${contact.phone}`}
                </CardDescription>
              </div>
              <Badge 
                variant={contact.is_active ? "default" : "secondary"}
                className="text-xs whitespace-nowrap flex-shrink-0"
              >
                {contact.is_active ? 'Активен' : 'Неактивен'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center gap-2">
              <div className="text-xs sm:text-sm text-gray-500 min-w-0 flex-1">
                {contact.group_name && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs inline-block truncate max-w-full">
                    {contact.group_name}
                  </span>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TelegramContactsTab;
