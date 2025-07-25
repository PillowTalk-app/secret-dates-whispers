import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Crown, RefreshCw, Sparkles, TrendingUp, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Match {
  id: string;
  username: string; // The other user's screen name
  mutualPersonName: string; // Name of person they both dated
  mutualPersonPhoto: string; // Photo of person they both dated
  sharedMemory: string;
  matchedOn: string;
  canMessage: boolean;
  hasConversation: boolean;
  lastActivity?: string;
}

// Enhanced mock data showing mutual people they both dated
const mockMatches: Match[] = [
  {
    id: "match-1",
    username: "MysticWaves",
    mutualPersonName: "Alex Chen",
    mutualPersonPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "You both posted about dating Alex from downtown - discovered similar experiences about communication patterns and how they handled conflict resolution",
    matchedOn: "2 days ago",
    canMessage: true,
    hasConversation: false
  },
  {
    id: "match-2", 
    username: "SunsetDreamer",
    mutualPersonName: "Jordan Martinez",
    mutualPersonPhoto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "Both shared experiences about dating someone from the gym - found common red flags including inconsistent texting and mixed signals about commitment",
    matchedOn: "1 week ago",
    canMessage: true,
    hasConversation: true,
    lastActivity: "Active 2h ago"
  },
  {
    id: "match-3",
    username: "NightOwl23",
    mutualPersonName: "Taylor Kim",
    mutualPersonPhoto: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face",
    sharedMemory: "Matched on experiences with someone from dating app - shared insights about messaging patterns and discovered similar experiences with love bombing behavior",
    matchedOn: "3 days ago",
    canMessage: true,
    hasConversation: false
  }
];

export const PaidMatchesList = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'active'>('all');
  const { toast } = useToast();

  const handleStartConversation = (matchId: string) => {
    // Update match to show conversation started
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, hasConversation: true, lastActivity: "Just started" }
        : match
    ));

    toast({
      title: "🎉 Conversation Started!",
      description: "You can now chat with this match. Head to Messages to continue.",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh matches
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    
    toast({
      title: "✨ Matches Updated",
      description: "Found new matches and activity updates!",
    });
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'new') return !match.hasConversation;
    if (filter === 'active') return match.hasConversation;
    return true;
  });

  const activeChats = matches.filter(m => m.hasConversation).length;
  const newMatches = matches.filter(m => !m.hasConversation).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Status Header */}
      <Card className="bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 border-accent/30 shadow-luxury">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-accent rounded-full shadow-lg">
                <Crown className="h-8 w-8 text-accent-foreground" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground flex items-center">
                  Messaging Unlocked!
                  <Sparkles className="h-5 w-5 ml-2 text-accent animate-pulse" />
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  You can now message all your matches • Conversations last forever
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{matches.length}</div>
            <div className="text-xs text-muted-foreground">Total Matches</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeChats}</div>
            <div className="text-xs text-muted-foreground">Active Chats</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-foreground">{newMatches}</div>
            <div className="text-xs text-muted-foreground">New Matches</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground flex items-center">
          Your Matches
          <Badge variant="outline" className="ml-3">
            {filteredMatches.length} showing
          </Badge>
        </h3>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex bg-muted/30 rounded-lg p-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              All
            </Button>
            <Button
              variant={filter === 'new' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('new')}
              className="text-xs"
            >
              New ({newMatches})
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
              className="text-xs"
            >
              Active ({activeChats})
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches in this filter</h3>
              <p className="text-muted-foreground">
                Try switching to "All" to see your complete matches list.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onStartConversation={handleStartConversation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Helper Section */}
      <Card className="bg-gradient-to-r from-muted/30 to-accent/10 border-accent/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-accent/20 rounded-full">
              <MessageCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                How Your Premium Messaging Works
                <Crown className="h-4 w-4 ml-2 text-accent" />
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p>✨ Start conversations with all current matches</p>
                  <p>🔄 New matches automatically included</p>
                  <p>💬 Responses are always free for others</p>
                </div>
                <div className="space-y-2">
                  <p>🔒 All conversations are private & secure</p>
                  <p>♾️ Conversations last forever once started</p>
                  <p>📱 Get notified of replies instantly</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};