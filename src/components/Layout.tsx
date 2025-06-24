
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <div className="text-sm text-gray-600">
          Добро пожаловать, {user?.email}
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
