import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, User, Sparkles } from "lucide-react";
import { useMemoryMatches } from '@/hooks/useMemoryMatches';

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface TopNavigationProps {
  userData: UserData;
  onProfile?: () => void; // Made optional since we're not using it
}

export const TopNavigation = ({ userData, onProfile }: TopNavigationProps) => {
  const { pendingMatches } = useMemoryMatches();
  
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Pillow Talk
            </span>
            <p className="text-xs text-muted-foreground ml-2">Not gossip just experience</p>
            <Badge variant="secondary" className="bg-accent/20 text-accent text-xs ml-1">
              Verified
            </Badge>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {/* Matches Link */}
            <div className="relative">
              <NavLink
                to="/matches"
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`
                }
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Matches</span>
              </NavLink>
              {pendingMatches.length > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">
                    {pendingMatches.length}
                  </span>
                </div>
              )}
            </div>
            
            {/* About Link */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`
              }
            >
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">About</span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};