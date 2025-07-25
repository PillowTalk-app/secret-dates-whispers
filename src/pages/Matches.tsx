import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Users, Clock, Lock } from 'lucide-react';
import { MemoryMatchNotification } from '@/components/MemoryMatchNotification';
import { MemoryComparison } from '@/components/MemoryComparison';
import { useMemoryMatches } from '@/hooks/useMemoryMatches';
import { useMatchPayments } from '@/hooks/useMatchPayments';
import { UnlockMatchesDialog } from '@/components/UnlockMatchesDialog';
import { PaidMatchesList } from '@/components/PaidMatchesList';

export const Matches = () => {
  const {
    pendingMatches,
    activeComparisons,
    isLoading,
    optInToMatch,
    declineMatch,
    addReaction
  } = useMemoryMatches();

  const [activeTab, setActiveTab] = useState('pending');
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [hasPaidAccess, setHasPaidAccess] = useState(false); // Mock paid status
  const navigate = useNavigate();
  
  const { hasUnlockedMatches, canAccessMatches } = useMatchPayments();

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleBack = () => {
    navigate('/', { replace: true });
  };

  const handleUnlockClick = () => {
    // Ensure we have user data, use mock data if not available
    if (!userData) {
      setUserData({
        email: 'demo@example.com',
        name: 'Demo User'
      });
    }
    setShowUnlockDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Memory Matches</h1>
            <p className="text-muted-foreground">
              Connect through shared experiences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <Badge variant="secondary">
              {pendingMatches.length + activeComparisons.length} total
            </Badge>
          </div>
        </div>

        {/* Content */}
        {!hasPaidAccess ? (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Lock className="h-16 w-16 text-primary" />
                  <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Unlock Messaging</h2>
                <p className="text-muted-foreground mb-4">
                  Start conversations with all your matches and discover meaningful connections
                </p>
                <p className="text-lg font-semibold text-primary">$5.99 - One Time Payment</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Message all your current matches</p>
                <p>✓ Future matches automatically included</p>
                <p>✓ Conversations last forever</p>
                <p>✓ Always respond to messages for free</p>
              </div>

              <Button 
                onClick={handleUnlockClick}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3"
              >
                Unlock Messaging - $5.99
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Paid Access - Show Specific Matches */
          <PaidMatchesList />
        )}

        <UnlockMatchesDialog 
          isOpen={showUnlockDialog}
          onClose={() => setShowUnlockDialog(false)}
          userData={userData || { email: 'demo@example.com', name: 'Demo User' }}
          onPaymentSuccess={() => {
            // Mock successful payment
            console.log('Payment successful! User can now message matches.');
            setHasPaidAccess(true);
            setShowUnlockDialog(false);
          }}
        />

        {/* How it Works */}
        <Card className="mt-8 bg-accent/5 border border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-accent" />
              How Memory Matches Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• When you post about someone, our system checks for similar posts by others</p>
            <p>• Matches are detected through photo similarity and name matching</p>
            <p>• Both people must agree before any comparison is shown</p>
            <p>• All comparisons are completely anonymous - no personal info is shared</p>
            <p>• This helps people learn from shared dating experiences safely</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};