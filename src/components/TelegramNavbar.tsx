
"use client";

import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Users, MessageCircle, Database, BarChart3, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import PlatformToggle from "./PlatformToggle";

const TelegramNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/campaigns', label: 'Рассылки', icon: Send },
    { path: '/accounts', label: 'Аккаунты', icon: Users },
    { path: '/contacts', label: 'Контакты', icon: Database },
    { path: '/messages', label: 'Сообщения', icon: MessageCircle },
    { path: '/analytics', label: 'Аналитика', icon: BarChart3 },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="ios-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-telegram-500 to-telegram-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-ios-gray-900 text-lg sm:text-xl font-semibold">SMM AI</span>
                <span className="text-ios-gray-500 text-xs font-medium hidden sm:block">Telegram</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`text-ios-gray-700 hover:bg-ios-gray-100 ios-transition-fast rounded-xl font-medium ${
                    location.pathname === item.path ? 'bg-telegram-100 text-telegram-600' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:block">
              <PlatformToggle />
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-ios-gray-700 hover:bg-ios-gray-100 ios-transition-fast rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ios-transition overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-ios-gray-200 py-4">
            <div className="sm:hidden mb-4 flex justify-center">
              <PlatformToggle />
            </div>
            <div className="flex flex-col space-y-1">
              {navItems.map((item, index) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={`text-ios-gray-700 hover:bg-ios-gray-100 ios-transition-fast justify-start rounded-xl font-medium ${
                    location.pathname === item.path ? 'bg-telegram-100 text-telegram-600' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TelegramNavbar;
