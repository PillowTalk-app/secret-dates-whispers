import { Sparkles, Zap, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BoostedPostEffectProps {
  children: React.ReactNode;
  timeRemaining?: string;
}

export const BoostedPostEffect = ({ children, timeRemaining }: BoostedPostEffectProps) => {
  return (
    <div className="relative">
      {/* Glowing border effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-lg opacity-75 animate-pulse"></div>
      
      {/* Floating sparkles */}
      <div className="absolute -top-2 -right-2 z-10">
        <div className="relative">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-spin" />
          <div className="absolute top-0 left-0 h-5 w-5 bg-yellow-400/30 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Premium badge */}
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none shadow-lg">
          <Crown className="h-3 w-3 mr-1" />
          BOOSTED
        </Badge>
      </div>

      {/* Time remaining indicator */}
      {timeRemaining && (
        <div className="absolute bottom-2 right-2 z-10">
          <Badge variant="secondary" className="bg-yellow-400/90 text-black border border-yellow-500/50 font-semibold">
            <Zap className="h-3 w-3 mr-1" />
            {timeRemaining}
          </Badge>
        </div>
      )}

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -z-10 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-slide-in-right"></div>
      </div>

      {/* Main content */}
      <div className="relative z-0 bg-background rounded-lg">
        {children}
      </div>
    </div>
  );
};