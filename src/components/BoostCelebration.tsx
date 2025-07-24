import { useEffect, useState } from 'react';
import { Zap, Sparkles, Star, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BoostCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const BoostCelebration = ({ isVisible, onComplete }: BoostCelebrationProps) => {
  const [stage, setStage] = useState<'sparkles' | 'message' | 'complete'>('sparkles');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setStage('message'), 1000);
    const timer2 = setTimeout(() => setStage('complete'), 3000);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti/Sparkles Effect */}
      {stage === 'sparkles' && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${500 + Math.random() * 1000}ms`
              }}
            >
              {i % 4 === 0 && <Sparkles className="h-6 w-6 text-yellow-400" />}
              {i % 4 === 1 && <Star className="h-5 w-5 text-yellow-500" />}
              {i % 4 === 2 && <Zap className="h-4 w-4 text-orange-400" />}
              {i % 4 === 3 && <Heart className="h-4 w-4 text-pink-400" />}
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {stage === 'message' && (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="animate-scale-in bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 border-none shadow-2xl">
            <CardContent className="p-8 text-center text-white">
              <div className="relative">
                {/* Pulsing background effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                
                {/* Main icon */}
                <div className="relative bg-white/30 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
                  <TrendingUp className="h-12 w-12 text-white animate-bounce" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-3">🚀 BOOSTED! 🚀</h2>
              <p className="text-lg font-medium mb-2">Your post is now trending!</p>
              <p className="text-sm opacity-90">48 hours of premium visibility activated</p>
              
              {/* Floating sparkles around the card */}
              <div className="absolute -top-4 -right-4">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-spin" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute top-1/2 -left-6">
                <Zap className="h-7 w-7 text-orange-300 animate-bounce" />
              </div>
              <div className="absolute top-1/4 -right-6">
                <Heart className="h-5 w-5 text-pink-300 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};