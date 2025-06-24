
import { Switch } from "@/components/ui/switch";
import { useNavigate, useLocation } from "react-router-dom";
import { Instagram } from "lucide-react";

const PlatformSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Определяем текущую платформу на основе URL
  const isInstagramMode = location.pathname.startsWith('/instagram');
  
  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      // Переключаемся на Instagram
      navigate('/instagram');
    } else {
      // Переключаемся на Telegram
      navigate('/');
    }
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl min-h-[36px] sm:min-h-[40px]">
      <div className={`flex items-center transition-all duration-300 ${
        !isInstagramMode ? 'text-blue-600 scale-110' : 'text-gray-400 scale-100'
      }`}>
        <svg className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      </div>
      
      <Switch
        checked={isInstagramMode}
        onCheckedChange={handleSwitchChange}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-500 data-[state=unchecked]:bg-blue-500 transition-all duration-200 scale-75 sm:scale-90 lg:scale-100"
      />
      
      <div className={`flex items-center transition-all duration-300 ${
        isInstagramMode ? 'text-pink-600 scale-110' : 'text-gray-400 scale-100'
      }`}>
        <Instagram className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
      </div>
    </div>
  );
};

export default PlatformSwitcher;
