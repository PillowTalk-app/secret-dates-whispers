import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Heart, MessageCircle, Users, Sparkles } from 'lucide-react';
import { useMatchPayments } from '@/hooks/useMatchPayments';

interface UnlockMatchesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    name: string;
  };
}

export const UnlockMatchesDialog = ({ isOpen, onClose, userData }: UnlockMatchesDialogProps) => {
  const { createPayment, isLoading } = useMatchPayments();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlockMatches = async () => {
    setIsProcessing(true);
    const success = await createPayment(userData.email, userData.name);
    if (success) {
      // Keep dialog open - user will return from Stripe checkout
    }
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5" />
            Unlock All Matches & Messaging
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Sparkles className="h-12 w-12 text-primary" />
                    <div className="absolute -top-1 -right-1">
                      <div className="h-4 w-4 bg-accent rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-primary">$5.99</h3>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold text-center">What You'll Get:</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">All Memory Matches</p>
                  <p className="text-sm text-muted-foreground">See everyone you have in common</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Unlimited Messaging</p>
                  <p className="text-sm text-muted-foreground">Chat with all your matches</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Compare Experiences</p>
                  <p className="text-sm text-muted-foreground">Share and learn from each other</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleUnlockMatches} 
              disabled={isLoading || isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
            >
              {isProcessing ? 'Processing...' : 'Unlock for $5.99'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processed by Stripe. One-time payment gives you lifetime access to all current and future matches.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
