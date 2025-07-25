import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Clock, MapPin } from "lucide-react";
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

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-glow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={match.avatar} alt={match.name} />
              <AvatarFallback className="bg-gradient-accent text-accent-foreground">
                {match.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{match.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {match.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="secondary" className="text-xs">
              {match.hasConversation ? 'Active Chat' : 'New Match'}
            </Badge>
            {match.lastActivity && (
              <span className="text-xs text-muted-foreground mt-1">
                {match.lastActivity}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Shared Memory */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-start space-x-2">
              <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Shared Experience</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {match.sharedMemory}
                </p>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Matched {match.matchedOn}
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleMessage}
            className="w-full"
            variant={match.hasConversation ? "outline" : "default"}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {match.hasConversation ? 'Continue Chat' : 'Start Conversation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};