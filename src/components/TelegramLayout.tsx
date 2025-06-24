
"use client";

import { useAuth } from '@/hooks/useAuth';
import TelegramNavbar from './TelegramNavbar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface TelegramLayoutProps {
  children: React.ReactNode;
}

const TelegramLayout = ({ children }: TelegramLayoutProps) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-gray-50 to-telegram-50">
      <TelegramNavbar />
      
      {/* Header с информацией пользователя */}
      <div className="glass border-b border-ios-gray-200/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="text-xs sm:text-sm text-ios-gray-700 font-medium w-full sm:w-auto">
              <span className="hidden xs:inline">Добро пожаловать, </span>
              <span className="break-all text-2xs xs:text-xs sm:text-sm font-semibold">{user?.email}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut} 
              className="text-ios-gray-600 hover:bg-ios-gray-100 ios-transition-fast rounded-xl font-medium self-end sm:self-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">Выйти</span>
            </Button>
          </div>
        </div>
      </div>
      
      <main className="w-full max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="animate-blur-in w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelegramLayout;
