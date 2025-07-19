import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MyPosts } from "./pages/MyPosts";
import { Messages } from "./pages/Messages";
import { Polls } from "./pages/Polls";
import { CreatePost } from "./pages/CreatePost";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Mock user data - in a real app this would come from authentication
const mockUserData = {
  name: 'Jane Smith',
  screenName: 'MidnightMuse',
  gender: 'female' as const,
  phone: '+1 (555) 987-6543',
  email: 'jane@example.com'
};

const AppContent = () => {
  const [userData] = useState(mockUserData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Listen for authentication state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const authState = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authState === 'true');
    };

    // Check initial state
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
    };
  }, []);

  // Show navigation when authenticated
  const showNavigation = isAuthenticated;

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index onAuthComplete={() => setIsAuthenticated(true)} />} />
        <Route path="/create" element={<CreatePost userData={userData} />} />
        <Route path="/my-posts" element={<MyPosts userData={userData} />} />
        <Route path="/messages" element={<Messages userData={userData} />} />
        <Route path="/polls" element={<Polls userData={userData} />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNavigation && <BottomNavigation />}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
