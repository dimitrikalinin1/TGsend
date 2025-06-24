
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Accounts from "./pages/Accounts";
import Contacts from "./pages/Contacts";
import Messages from "./pages/Messages";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import InstagramDashboard from "./pages/InstagramDashboard";
import InstagramAutoPosts from "./pages/InstagramAutoPosts";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import TelegramLayout from "./components/TelegramLayout";
import InstagramLayout from "./components/InstagramLayout";

const queryClient = new QueryClient();

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isInstagramMode = location.pathname.startsWith('/instagram');
  
  if (isInstagramMode) {
    return <InstagramLayout>{children}</InstagramLayout>;
  }
  
  return <TelegramLayout>{children}</TelegramLayout>;
};

const ProtectedLayoutRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedLayoutRoute><Index /></ProtectedLayoutRoute>} />
          <Route path="/accounts" element={<ProtectedLayoutRoute><Accounts /></ProtectedLayoutRoute>} />
          <Route path="/contacts" element={<ProtectedLayoutRoute><Contacts /></ProtectedLayoutRoute>} />
          <Route path="/messages" element={<ProtectedLayoutRoute><Messages /></ProtectedLayoutRoute>} />
          <Route path="/campaigns" element={<ProtectedLayoutRoute><Campaigns /></ProtectedLayoutRoute>} />
          <Route path="/analytics" element={<ProtectedLayoutRoute><Analytics /></ProtectedLayoutRoute>} />
          <Route path="/instagram" element={<ProtectedLayoutRoute><InstagramDashboard /></ProtectedLayoutRoute>} />
          <Route path="/instagram/accounts" element={<ProtectedLayoutRoute><Accounts /></ProtectedLayoutRoute>} />
          <Route path="/instagram/contacts" element={<ProtectedLayoutRoute><Contacts /></ProtectedLayoutRoute>} />
          <Route path="/instagram/autoposts" element={<ProtectedLayoutRoute><InstagramAutoPosts /></ProtectedLayoutRoute>} />
          <Route path="/instagram/campaigns" element={<ProtectedLayoutRoute><Campaigns /></ProtectedLayoutRoute>} />
          <Route path="/instagram/messages" element={<ProtectedLayoutRoute><Messages /></ProtectedLayoutRoute>} />
          <Route path="/instagram/analytics" element={<ProtectedLayoutRoute><Analytics /></ProtectedLayoutRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
