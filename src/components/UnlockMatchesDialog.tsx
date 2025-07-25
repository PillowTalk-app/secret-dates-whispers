import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Heart, MessageCircle, Users, Sparkles, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnlockMatchesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    name: string;
  };
  onPaymentSuccess?: () => void;
}

export const UnlockMatchesDialog = ({ isOpen, onClose, userData, onPaymentSuccess }: UnlockMatchesDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleUnlockMessaging = async () => {
    try {
      setIsProcessing(true);
      
      // Mock payment flow - in real app, this would call the Supabase edge function
      // const { data, error } = await supabase.functions.invoke('create-match-payment');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Stripe checkout URL for demonstration
      const mockStripeUrl = `https://checkout.stripe.com/pay/mock-messaging-unlock-${Date.now()}`;
      
      toast({
        title: "Redirecting to Payment",
        description: "You'll be redirected to Stripe checkout to unlock messaging.",
      });

      // In real implementation, this would open Stripe checkout
      // window.open(mockStripeUrl, '_blank');
      
      // For demo, simulate successful payment
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: "You can now message all your matches!",
        });
        onClose();
        onPaymentSuccess?.();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5" />
            Unlock Messaging with All Matches
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
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Start Conversations</p>
                  <p className="text-sm text-muted-foreground">Message all your current and future matches</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Forever Access</p>
                  <p className="text-sm text-muted-foreground">Conversations last indefinitely once started</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Free Responses</p>
                  <p className="text-sm text-muted-foreground">You can always respond to messages for free</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleUnlockMessaging} 
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
            >
              {isProcessing ? 'Processing...' : 'Unlock Messaging - $5.99'}
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
            Secure payment processed by Stripe. One-time payment lets you start conversations with all current and future matches. You can always respond to messages for free.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
