
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Users, MessageCircle, Database, BarChart3, Home } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/campaigns', label: 'Рассылки', icon: Send },
    { path: '/accounts', label: 'Аккаунты', icon: Users },
    { path: '/contacts', label: 'Контакты', icon: Database },
    { path: '/messages', label: 'Сообщения', icon: MessageCircle },
    { path: '/analytics', label: 'Аналитика', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Send className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">TG Sender</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? "bg-slate-100 text-slate-800 hover:bg-slate-200" 
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Статус: <span className="text-green-600 font-medium">Онлайн</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
