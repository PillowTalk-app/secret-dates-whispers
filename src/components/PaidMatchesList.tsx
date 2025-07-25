import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Crown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Match {
  id: string;
  name: string;
  avatar: string;
  sharedMemory: string;
  matchedOn: string;
  location: string;
  canMessage: boolean;
  hasConversation: boolean;
  lastActivity?: string;
}

// Mock data for paid matches
const mockMatches: Match[] = [
  {
    id: "match-1",
    name: "MysticWaves",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "You both posted about dating Alex from downtown - discovered similar experiences about communication patterns",
    matchedOn: "2 days ago",
    location: "2 miles away",
    canMessage: true,
    hasConversation: false
  },
  {
    id: "match-2", 
    name: "SunsetDreamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "Both shared experiences about dating someone from the gym - found common red flags",
    matchedOn: "1 week ago",
    location: "5 miles away", 
    canMessage: true,
    hasConversation: true,
    lastActivity: "Active 2h ago"
  },
  {
    id: "match-3",
    name: "NightOwl23",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "Matched on experiences with someone from dating app - shared insights about messaging patterns",
    matchedOn: "3 days ago", 
    location: "1 mile away",
    canMessage: true,
    hasConversation: false
  }
];

export const PaidMatchesList = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleStartConversation = (matchId: string) => {
    // Update match to show conversation started
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, hasConversation: true, lastActivity: "Just started" }
        : match
    ));

    toast({
      title: "Conversation Started!",
      description: "You can now chat with this match. Head to Messages to continue.",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh matches
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    toast({
      title: "Matches Refreshed",
      description: "Checked for new matches and updates.",
    });
  };

  const activeChats = matches.filter(m => m.hasConversation).length;
  const newMatches = matches.filter(m => !m.hasConversation).length;

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="bg-gradient-accent border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-foreground/20 rounded-full">
                <Crown className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-accent-foreground">Messaging Unlocked!</CardTitle>
                <p className="text-accent-foreground/80 text-sm">
                  You can now message all your matches
                </p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-8 w-8 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeChats}</div>
            <div className="text-sm text-muted-foreground">Active Chats</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">{newMatches}</div>
            <div className="text-sm text-muted-foreground">New Matches</div>
          </CardContent>
        </Card>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Your Matches</h3>
          <Badge variant="outline">
            {matches.length} total matches
          </Badge>
        </div>

        {matches.length === 0 ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
              <p className="text-muted-foreground">
                Keep posting experiences and you'll start getting matches with people who share similar stories.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onStartConversation={handleStartConversation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <Card className="bg-muted/30 border-border/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">How messaging works:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• You can start conversations with all your matches</li>
                <li>• Others can message you back for free</li>
                <li>• New matches are automatically included</li>
                <li>• All conversations are private and secure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};