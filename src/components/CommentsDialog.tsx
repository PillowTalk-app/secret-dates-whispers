import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Send, MessageCircle, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  isAnonymous: boolean;
}

interface Post {
  id: string;
  authorName: string;
  authorGender: 'male' | 'female';
  authorImage?: string;
  targetName: string;
  targetImage?: string;
  targetPhone?: string;
  content: string;
  timestamp: string;
  responses: number;
  isActive: boolean;
  images?: string[];
  location: string;
}

interface CommentsDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsDialog = ({ post, isOpen, onClose }: CommentsDialogProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Anonymous',
      content: 'Thanks for sharing this. I had a similar experience with this person.',
      timestamp: '2 hours ago',
      likes: 3,
      isAnonymous: true
    },
    {
      id: '2',
      author: 'Community Member',
      content: 'This is really helpful information. Appreciate you being honest about your experience.',
      timestamp: '5 hours ago',
      likes: 1,
      isAnonymous: true
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'You',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isAnonymous: true
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
    
    toast({
      title: "Comment added",
      description: "Your anonymous comment has been posted",
      duration: 3000,
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments on {post.authorName}'s post about {post.targetName}
          </DialogTitle>
        </DialogHeader>

        {/* Original Post */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{post.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{post.authorName}</span>
                  <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="text-sm font-medium mb-3">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </div>
          
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.isAnonymous ? '?' : comment.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-card border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.isAnonymous ? 'Anonymous' : comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div className="border-t pt-4 mt-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add an anonymous comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Your comment will be posted anonymously
                </p>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};