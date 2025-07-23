import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Note: In a real implementation, this would use the actual Supabase client
// For now, we'll mock the payment flow

interface PostBoostButtonProps {
  postId: string;
  isOwner: boolean;
  isBoosted?: boolean;
  boostEndTime?: string;
}

export const PostBoostButton = ({ postId, isOwner, isBoosted, boostEndTime }: PostBoostButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBoost = async () => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "You can only boost your own posts",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Mock payment flow - in a real app, this would call the Supabase edge function
      // const { data, error } = await supabase.functions.invoke('create-boost-payment', {
      //   body: { postId },
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Stripe checkout URL for demonstration
      const mockStripeUrl = `https://checkout.stripe.com/pay/mock-session-${postId}`;
      
      // Open Stripe checkout in a new tab
      window.open(mockStripeUrl, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Complete your payment to boost this post for 48 hours",
      });
    } catch (error) {
      console.error('Error creating boost payment:', error);
      toast({
        title: "Error",
        description: "Failed to create boost payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingTime = () => {
    if (!boostEndTime) return null;
    
    const endTime = new Date(boostEndTime);
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (isBoosted) {
    const remainingTime = getRemainingTime();
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="default" className="bg-gradient-primary text-primary-foreground">
          <Zap className="h-3 w-3 mr-1" />
          Boosted
        </Badge>
        {remainingTime && (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {remainingTime} left
          </Badge>
        )}
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <Button
      onClick={handleBoost}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="border-primary/30 hover:border-primary hover:bg-primary/10"
    >
      <Zap className="h-4 w-4 mr-2" />
      <DollarSign className="h-3 w-3" />
      2.99 Boost 48h
      {isLoading && <span className="ml-2">...</span>}
    </Button>
  );
};