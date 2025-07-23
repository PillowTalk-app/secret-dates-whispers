import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, MessageCircle, Users, Lightbulb, AlertTriangle } from 'lucide-react';

interface MemoryComparison {
  id: string;
  matchId: string;
  userAId: string;
  userBId: string;
  postAContent: string;
  postBContent: string;
  sharedPersonName: string;
  sharedPhoto: string | null;
}

interface MemoryComparisonProps {
  comparison: MemoryComparison;
  currentUserId?: string;
  onReaction: (comparisonId: string, reaction: 'helpful' | 'eye_opening' | 'concerning') => void;
}

export const MemoryComparison = ({
  comparison,
  currentUserId = 'user-a',
  onReaction
}: MemoryComparisonProps) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [hasReacted, setHasReacted] = useState(false);

  const isUserA = currentUserId === comparison.userAId;
  const userContent = isUserA ? comparison.postAContent : comparison.postBContent;
  const otherContent = isUserA ? comparison.postBContent : comparison.postAContent;

  const handleReaction = (reaction: 'helpful' | 'eye_opening' | 'concerning') => {
    setSelectedReaction(reaction);
    setHasReacted(true);
    onReaction(comparison.id, reaction);
  };

  const reactions = [
    { 
      id: 'helpful', 
      label: 'Helpful', 
      icon: Heart, 
      color: 'text-green-500 hover:bg-green-50 border-green-200' 
    },
    { 
      id: 'eye_opening', 
      label: 'Eye-opening', 
      icon: Lightbulb, 
      color: 'text-blue-500 hover:bg-blue-50 border-blue-200' 
    },
    { 
      id: 'concerning', 
      label: 'Concerning', 
      icon: AlertTriangle, 
      color: 'text-orange-500 hover:bg-orange-50 border-orange-200' 
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto border-2 border-accent/20 bg-gradient-card backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={comparison.sharedPhoto || '/placeholder.svg'} />
            <AvatarFallback>
              <Users className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">Shared Experience: {comparison.sharedPersonName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Two perspectives on the same person
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="mx-auto">
          <Eye className="h-3 w-3 mr-1" />
          Anonymous Comparison
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Experience */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-accent rounded-full" />
              <h3 className="font-semibold text-lg">Your Experience</h3>
            </div>
            <Card className="bg-accent/5 border border-accent/20">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{userContent}</p>
              </CardContent>
            </Card>
          </div>

          {/* Other Person's Experience */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-secondary rounded-full" />
              <h3 className="font-semibold text-lg">Another Person's Experience</h3>
            </div>
            <Card className="bg-secondary/5 border border-secondary/20">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{otherContent}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Reflection Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">How does this comparison feel?</h3>
            <p className="text-sm text-muted-foreground">
              Your reaction helps us understand the value of these shared experiences
            </p>
          </div>

          {!hasReacted ? (
            <div className="flex flex-wrap justify-center gap-3">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.id}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${reaction.color}`}
                  onClick={() => handleReaction(reaction.id as any)}
                >
                  <reaction.icon className="h-4 w-4" />
                  {reaction.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm font-medium">
                Thank you for your feedback! Your reaction: 
                <span className="ml-1 capitalize font-semibold text-accent">
                  {selectedReaction?.replace('_', ' ')}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This helps us improve the matching system for everyone
              </p>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Privacy Protection:</p>
              <p>
                This comparison is completely anonymous. Neither person can see the other's 
                profile, identity, or contact information. Only these specific experiences 
                about {comparison.sharedPersonName} are shared.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
