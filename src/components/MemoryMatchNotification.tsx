import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Users, Sparkles } from 'lucide-react';

interface MemoryMatch {
  id: string;
  postAId: string;
  postBId: string;
  confidenceScore: number;
  matchType: 'face_match' | 'name_match' | 'hybrid';
  status: 'pending' | 'both_opted_in' | 'declined' | 'expired';
  sharedPersonName: string | null;
  expiresAt: string;
  createdAt: string;
}

interface MemoryMatchNotificationProps {
  match: MemoryMatch;
  onOptIn: (matchId: string, postId: string) => void;
  onDecline: (matchId: string) => void;
  isLoading?: boolean;
}

export const MemoryMatchNotification = ({
  match,
  onOptIn,
  onDecline,
  isLoading = false
}: MemoryMatchNotificationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTimeUntilExpiry = () => {
    const expiryDate = new Date(match.expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getMatchTypeDescription = () => {
    switch (match.matchType) {
      case 'face_match':
        return 'Photo similarity detected';
      case 'name_match':
        return 'Same person name';
      case 'hybrid':
        return 'Photo + name match';
      default:
        return 'Potential match';
    }
  };

  const getConfidenceColor = () => {
    if (match.confidenceScore >= 0.8) return 'bg-green-500';
    if (match.confidenceScore >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Card className="border-2 border-accent/20 bg-gradient-card backdrop-blur-sm hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">You've had a match!</CardTitle>
              <p className="text-sm text-muted-foreground">
                Someone else posted about {match.sharedPersonName || 'the same person'}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeUntilExpiry()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{getMatchTypeDescription()}</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-16 rounded-full ${getConfidenceColor()}`}>
                  <div 
                    className="h-full bg-white/30 rounded-full transition-all"
                    style={{ width: `${match.confidenceScore * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(match.confidenceScore * 100)}% match
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full"
          >
            Learn more about this match
          </Button>
        )}

        {isExpanded && (
          <div className="space-y-3">
            <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
              <h4 className="font-medium text-sm mb-2">How this works:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Both of you must agree to see the comparison</li>
                <li>• Your identities remain completely anonymous</li>
                <li>• Only the experiences about this person are shared</li>
                <li>• This helps you both learn from shared dating history</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => onOptIn(match.id, match.postAId)}
                disabled={isLoading}
                className="flex-1"
                variant="default"
              >
                {isLoading ? 'Processing...' : 'Yes, compare experiences'}
              </Button>
              <Button
                onClick={() => onDecline(match.id)}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                Not interested
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};