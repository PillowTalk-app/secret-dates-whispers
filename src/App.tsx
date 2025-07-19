import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MyPosts } from "./pages/MyPosts";
import { Messages } from "./pages/Messages";
import { Polls } from "./pages/Polls";
import { CreatePost } from "./pages/CreatePost";
import { useState } from "react";

const queryClient = new QueryClient();

// Mock user data - in a real app this would come from authentication
const mockUserData = {
  name: 'Jane Smith',
  screenName: 'MidnightMuse',
  gender: 'female' as const,
  phone: '+1 (555) 987-6543',
  email: 'jane@example.com'
};

const App = () => {
  const [userData] = useState(mockUserData);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreatePost userData={userData} />} />
              <Route path="/my-posts" element={<MyPosts userData={userData} />} />
              <Route path="/messages" element={<Messages userData={userData} />} />
              <Route path="/polls" element={<Polls userData={userData} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
