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
        {!hasUnlockedMatches ? (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Lock className="h-16 w-16 text-primary" />
                  <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Unlock Your Matches</h2>
                <p className="text-muted-foreground mb-4">
                  Discover people you have in common and start meaningful conversations
                </p>
                <p className="text-lg font-semibold text-primary">$5.99 - One Time Payment</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ See all your memory matches</p>
                <p>✓ Unlimited messaging with matches</p>
                <p>✓ Compare experiences safely</p>
              </div>

              <Button 
                onClick={handleUnlockClick}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3"
              >
                Unlock All Matches
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingMatches.length})
              </TabsTrigger>
              <TabsTrigger value="comparisons" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Comparisons ({activeComparisons.length})
              </TabsTrigger>
            </TabsList>

          {/* Pending Matches */}
          <TabsContent value="pending" className="space-y-4">
            {pendingMatches.length === 0 ? (
              <Card className="bg-gradient-card backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending matches</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    When someone posts about the same person you've written about, 
                    you'll get a notification here to compare experiences.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingMatches.map((match) => (
                  <MemoryMatchNotification
                    key={match.id}
                    match={match}
                    onOptIn={(matchId, postId) => optInToMatch(matchId, postId)}
                    onDecline={declineMatch}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Comparisons */}
          <TabsContent value="comparisons" className="space-y-6">
            {activeComparisons.length === 0 ? (
              <Card className="bg-gradient-card backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active comparisons</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    When both you and another person agree to compare experiences, 
                    the anonymous side-by-side view will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {activeComparisons.map((comparison) => (
                  <MemoryComparison
                    key={comparison.id}
                    comparison={comparison}
                    onReaction={addReaction}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        )}

        <UnlockMatchesDialog 
          isOpen={showUnlockDialog}
          onClose={() => setShowUnlockDialog(false)}
          userData={userData || { email: 'demo@example.com', name: 'Demo User' }}
          onPaymentSuccess={() => {
            // Mock successful payment
            console.log('Payment successful! User can now message matches.');
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