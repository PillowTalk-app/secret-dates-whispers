import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Clock, MapPin, Sparkles, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface MatchCardProps {
  match: Match;
  onStartConversation: (matchId: string) => void;
}

export const MatchCard = ({ match, onStartConversation }: MatchCardProps) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    if (match.hasConversation) {
      // Navigate to existing conversation
      navigate('/messages', { state: { userId: match.id } });
    } else {
      // Start new conversation
      onStartConversation(match.id);
    }
  };

  const getStatusBadge = () => {
    if (match.hasConversation) {
      return (
        <Badge className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">
          <Activity className="h-3 w-3 mr-1" />
          Active Chat
        </Badge>
      );
    }
    return (
      <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 animate-pulse">
        <Sparkles className="h-3 w-3 mr-1" />
        New Match
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-glow hover:scale-[1.02] group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all">
                <AvatarImage src={match.avatar} alt={match.name} />
                <AvatarFallback className="bg-gradient-accent text-accent-foreground text-lg font-semibold">
                  {match.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!match.hasConversation && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full animate-pulse border-2 border-background" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                {match.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {match.location}
              </div>
              {match.lastActivity && (
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  {match.lastActivity}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge()}
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {match.matchedOn}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Shared Memory - Enhanced */}
        <div className="relative">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-4 border border-accent/20 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-accent/20 rounded-full flex-shrink-0">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  Shared Experience
                  <Sparkles className="h-4 w-4 ml-2 text-accent" />
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {match.sharedMemory}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        <Button
          onClick={handleMessage}
          className={`w-full h-12 font-semibold transition-all duration-300 ${
            match.hasConversation 
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl" 
              : "bg-gradient-accent hover:shadow-luxury hover:scale-105 active:scale-95"
          }`}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {match.hasConversation ? 'Continue Chat' : 'Start Conversation'}
        </Button>

        {/* Conversation Preview for Active Chats */}
        {match.hasConversation && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last message</span>
              <span className="text-xs text-muted-foreground">{match.lastActivity}</span>
            </div>
            <p className="text-sm text-foreground mt-1 truncate">
              "Thanks for sharing that experience..."
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};