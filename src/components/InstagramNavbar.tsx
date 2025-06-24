
"use client";

import { Button } from "@/components/ui/button";
import { Instagram, Users, Send, BarChart3, Bot, MessageSquare, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PlatformToggle from "./PlatformToggle";

const InstagramNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Instagram, label: "Главная", path: "/instagram" },
    { icon: Users, label: "Аккаунты", path: "/instagram/accounts" },
    { icon: MessageSquare, label: "Контакты", path: "/instagram/contacts" },
    { icon: Bot, label: "ИИ Автопосты", path: "/instagram/autoposts" },
    { icon: Send, label: "Кампании", path: "/instagram/campaigns" },
    { icon: BarChart3, label: "Аналитика", path: "/instagram/analytics" },
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-instagram-500 to-pink-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-ios-gray-900 text-lg sm:text-xl font-semibold">SMM AI</span>
                <span className="text-ios-gray-500 text-xs font-medium hidden sm:block">Instagram</span>
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
                    location.pathname === item.path ? 'bg-instagram-100 text-instagram-600' : ''
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
              className="md:hidden text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-white/20 py-4">
            <div className="sm:hidden mb-4">
              <PlatformSwitcher />
            </div>
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={`text-white hover:bg-white/20 transition-all duration-200 justify-start hover:scale-105 active:scale-95 animate-fade-in ${
                    location.pathname === item.path ? 'bg-white/20' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
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

export default InstagramNavbar;
