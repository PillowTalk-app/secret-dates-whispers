import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Users, MessageCircle, Heart, Bookmark } from 'lucide-react';
import { useMessagingEligibility, type MessagingEligibility } from '@/hooks/useMessagingEligibility';

interface MessagingRestrictionsProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onProceedToMessage?: () => void;
}

export const MessagingRestrictions = ({
  userId,
  userName,
  isOpen,
  onClose,
  onProceedToMessage
}: MessagingRestrictionsProps) => {
  const { canMessageUser } = useMessagingEligibility();
  const eligibility = canMessageUser(userId);

  const getContextIcon = (type: string) => {
    switch (type) {
      case 'memory_match':
        return <Users className="h-4 w-4" />;
      case 'post_comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'post_interaction':
        return <Heart className="h-4 w-4" />;
      case 'mutual_save':
        return <Bookmark className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getContextColor = (type: string) => {
    switch (type) {
      case 'memory_match':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'post_comment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'post_interaction':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'mutual_save':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Message {userName}
          </DialogTitle>
        </DialogHeader>

        {eligibility.canMessage ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-800">
                You can message this user
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Your shared connections:</h3>
              <div className="space-y-2">
                {eligibility.sharedContexts.map((context) => (
                  <Card key={context.id} className="border border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${getContextColor(context.type)}`}>
                          {getContextIcon(context.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getContextColor(context.type)}>
                              {context.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {context.establishedAt}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {context.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onProceedToMessage} className="flex-1">
                Send Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 mb-1">
                  Cannot message this user
                </h3>
                <p className="text-sm text-orange-700">
                  {eligibility.reason}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">How to establish shared context:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Get matched through similar posts (Memory Matches)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Comment on their posts anonymously</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save posts from users you're interested in</span>
                </div>
              </div>
            </div>

            <Button onClick={onClose} className="w-full" variant="outline">
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};