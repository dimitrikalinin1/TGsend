
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Bot, Shield, Clock } from "lucide-react";
import { useInstagramAccounts } from "@/hooks/useInstagramAccounts";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BrowserAutomationSettings = () => {
  const { accounts } = useInstagramAccounts();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Настройки автоматизации
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Браузерная автоматизация Instagram
          </DialogTitle>
          <DialogDescription>
            Настройки для автоматической публикации постов через виртуальный браузер
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Система использует headless браузер для имитации действий пользователя. 
              Все данные авторизации хранятся в зашифрованном виде.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Общие настройки
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="delay">Задержка между действиями (сек)</Label>
                <Input
                  id="delay"
                  type="number"
                  placeholder="2-5"
                  defaultValue="3"
                />
              </div>
              <div>
                <Label htmlFor="timeout">Таймаут операции (мин)</Label>
                <Input
                  id="timeout"
                  type="number"
                  placeholder="5-10"
                  defaultValue="7"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Статус аккаунтов
            </h4>
            
            {accounts.filter(acc => acc.status === 'active').length === 0 ? (
              <p className="text-sm text-gray-500">Нет активных аккаунтов для автоматизации</p>
            ) : (
              <div className="space-y-2">
                {accounts.filter(acc => acc.status === 'active').map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">@{account.username}</p>
                      <p className="text-xs text-gray-500">{account.name}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Готов к автоматизации
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Закрыть
            </Button>
            <Button>
              Сохранить настройки
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrowserAutomationSettings;
