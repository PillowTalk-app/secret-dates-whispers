
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TopNavigation } from "@/components/TopNavigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MyPosts } from "./pages/MyPosts";
import { Messages } from "./pages/Messages";
import { Polls } from "./pages/Polls";
import { CreatePost } from "./pages/CreatePost";
import { Safety } from "./pages/Safety";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { About } from "./pages/About";
import { Matches } from "./pages/Matches";
import { UserProfile } from "@/components/UserProfile";
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
  const [appState, setAppState] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Safe navigation to home - always goes to authenticated home page
  const navigateToHome = () => {
    navigate('/', { replace: true });
  };

  // Listen for authentication state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const authState = localStorage.getItem('isAuthenticated');
      const currentAppState = localStorage.getItem('appState');
      setIsAuthenticated(authState === 'true');
      setAppState(currentAppState || '');
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

  // Only show bottom navigation when fully authenticated and specifically in home state
  // Hide during loading, verification, auth-choice, signin, messaging, and profile states
  const showNavigation = isAuthenticated && location.pathname === '/' && appState === 'home';
  const showTopNavigation = (isAuthenticated && location.pathname !== '/' && appState !== 'loading' && appState !== 'verification' && appState !== 'auth-choice' && appState !== 'signin') || location.pathname === '/about';

  return (
    <div className="min-h-screen bg-background">
      {showTopNavigation && (
        <TopNavigation 
          userData={userData} 
          onProfile={() => {}} 
        />
      )}
      <Routes>
        <Route path="/" element={<Index onAuthComplete={() => setIsAuthenticated(true)} />} />
        <Route path="/create" element={<CreatePost userData={userData} />} />
        <Route path="/my-posts" element={<MyPosts userData={userData} />} />
        <Route path="/messages" element={<Messages userData={userData} />} />
        <Route path="/polls" element={<Polls userData={userData} />} />
        <Route path="/safety" element={<Safety userData={userData} />} />
        <Route path="/reports" element={<Reports userData={userData} />} />
        <Route path="/profile" element={<UserProfile userData={userData} onBack={navigateToHome} onNavigateToSettings={() => navigate('/settings')} />} />
        <Route path="/settings" element={<Settings userData={userData} />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/about" element={<About />} />
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
