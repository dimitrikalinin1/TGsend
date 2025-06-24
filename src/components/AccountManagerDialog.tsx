
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, LogIn, LogOut, CheckCircle, XCircle } from "lucide-react";
import { useInstagramAccounts } from "@/hooks/useInstagramAccounts";
import InstagramAccountLogin from "./InstagramAccountLogin";

const AccountManagerDialog = () => {
  const { accounts } = useInstagramAccounts();
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [loggedInAccounts, setLoggedInAccounts] = useState<Set<string>>(new Set());

  const handleLoginSuccess = (accountId: string) => {
    setLoggedInAccounts(prev => new Set(prev).add(accountId));
  };

  const handleLogout = (accountId: string) => {
    setLoggedInAccounts(prev => {
      const newSet = new Set(prev);
      newSet.delete(accountId);
      return newSet;
    });
  };

  return (
    <Dialog open={showAccountManager} onOpenChange={setShowAccountManager}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Управление аккаунтами
          {loggedInAccounts.size > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {loggedInAccounts.size} активных
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Управление аккаунтами
          </DialogTitle>
          <DialogDescription>
            Войдите в аккаунты Instagram для управления постами
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {accounts.filter(acc => acc.status === 'active').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Нет активных аккаунтов</p>
              <p className="text-sm text-gray-400 mt-1">
                Добавьте аккаунты Instagram в разделе "Аккаунты"
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {accounts.filter(acc => acc.status === 'active').map((account) => {
                const isLoggedIn = loggedInAccounts.has(account.id);
                
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">@{account.username}</p>
                        <p className="text-sm text-gray-500">{account.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Вход выполнен
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Не авторизован
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isLoggedIn ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogout(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Выйти
                        </Button>
                      ) : (
                        <InstagramAccountLogin
                          accountId={account.id}
                          accountUsername={account.username}
                          onLoginSuccess={() => handleLoginSuccess(account.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountManagerDialog;
