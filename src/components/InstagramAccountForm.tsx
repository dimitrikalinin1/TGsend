
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Instagram, Eye, EyeOff } from "lucide-react";
import { useInstagramAccounts } from "@/hooks/useInstagramAccounts";

const InstagramAccountForm = () => {
  const { addAccount } = useInstagramAccounts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim() || !formData.name.trim()) return;
    
    setIsSubmitting(true);
    const result = await addAccount({
      username: formData.username.replace('@', ''),
      password: formData.password,
      name: formData.name,
      daily_dm_limit: 50,
      use_for_posting: true
    });
    
    if (result) {
      setFormData({ username: "", password: "", name: "" });
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Добавить аккаунт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            Добавить Instagram аккаунт
          </DialogTitle>
          <DialogDescription>
            Введите данные для входа в ваш Instagram аккаунт
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="username (без @)"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Пароль от Instagram"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="name">Название аккаунта *</Label>
            <Input
              id="name"
              placeholder="Мой основной аккаунт"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Безопасность:</strong> Ваши данные надежно шифруются и используются только для публикации постов. 
              Мы не храним пароли в открытом виде.
            </p>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={isSubmitting || !formData.username.trim() || !formData.password.trim() || !formData.name.trim()}
            >
              {isSubmitting ? "Добавляем..." : "Добавить аккаунт"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramAccountForm;
