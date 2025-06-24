
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2 } from "lucide-react";

interface InstagramAccountLoginProps {
  accountId: string;
  accountUsername: string;
  onLoginSuccess?: () => void;
}

const InstagramAccountLogin = ({ accountId, accountUsername, onLoginSuccess }: InstagramAccountLoginProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    
    try {
      // Здесь будет интеграция с Instagram API
      // Пока что симулируем успешный логин
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Успешно",
        description: `Вход в аккаунт @${accountUsername} выполнен`,
      });
      
      setIsOpen(false);
      setCredentials({ username: '', password: '' });
      onLoginSuccess?.();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось войти в аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Войти в аккаунт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Вход в Instagram</DialogTitle>
          <DialogDescription>
            Войдите в аккаунт @{accountUsername} для управления постами
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="username"
              required
              disabled={isLogging}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="password"
              required
              disabled={isLogging}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLogging}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLogging}>
              {isLogging ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramAccountLogin;
