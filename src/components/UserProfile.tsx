import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Bell, ArrowLeft, Plus, Bookmark, MessageCircle, Clock, Trash2, Edit3 } from "lucide-react";

interface UserProfileProps {
  userData: { name: string; gender: 'male' | 'female'; phone: string; email: string };
  onBack: () => void;
}

interface Post {
  id: string;
  targetName: string;
  targetPhone?: string;
  content: string;
  timestamp: string;
  responses: number;
  category: 'dating' | 'relationship' | 'hookup';
  isActive: boolean;
}

interface SavedPost extends Post {
  originalAuthor: string;
  savedAt: string;
  hasNewResponses: boolean;
}

interface Notification {
  id: string;
  postId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const UserProfile = ({ userData, onBack }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState('my-posts');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState<{
    targetName: string;
    targetPhone: string;
    content: string;
    category: 'dating' | 'relationship' | 'hookup';
  }>({
    targetName: '',
    targetPhone: '',
    content: '',
    category: 'dating'
  });

  // Mock data - in real app this would come from backend
  const [myPosts, setMyPosts] = useState<Post[]>([
    {
      id: '1',
      targetName: 'Jamie Chen',
      targetPhone: '+1 (555) 234-5678',
      content: 'Had a wonderful 4-month relationship. Very respectful, great communication, and we parted on good terms. Would recommend for serious dating.',
      timestamp: '2 days ago',
      responses: 8,
      category: 'relationship',
      isActive: true
    }
  ]);

  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([
    {
      id: '2',
      targetName: 'Alex Johnson',
      targetPhone: '+1 (555) 123-4567',
      content: 'Went on 3 dates with this person. They seemed genuine at first but turned out to be quite manipulative. Be careful if you match with them.',
      timestamp: '2 hours ago',
      responses: 5,
      category: 'dating',
      isActive: true,
      originalAuthor: 'Anonymous User',
      savedAt: '1 day ago',
      hasNewResponses: true
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      postId: '2',
      message: 'New response on saved post about Alex Johnson',
      timestamp: '30 minutes ago',
      isRead: false
    },
    {
      id: '2',
      postId: '1',
      message: 'Your post about Jamie Chen received a new response',
      timestamp: '2 hours ago',
      isRead: false
    }
  ]);

  const handleCreatePost = () => {
    if (!newPost.targetName || !newPost.content) return;
    
    // Content moderation check
    const moderatedContent = moderateContent(newPost.content);
    if (!moderatedContent.isAllowed) {
      alert(`Content not allowed: ${moderatedContent.reason}`);
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      targetName: newPost.targetName,
      targetPhone: newPost.targetPhone || undefined,
      content: newPost.content,
      timestamp: 'Just now',
      responses: 0,
      category: newPost.category,
      isActive: true
    };

    setMyPosts(prev => [post, ...prev]);
    setNewPost({ targetName: '', targetPhone: '', content: '', category: 'dating' });
    setShowNewPostForm(false);
  };

  const moderateContent = (content: string) => {
    const prohibitedWords = ['violence', 'threat', 'harm', 'illegal', 'drugs', 'revenge'];
    const extremeLanguage = /\b(hate|kill|die|destroy|revenge)\b/gi;
    
    const hasProhibited = prohibitedWords.some(word => 
      content.toLowerCase().includes(word)
    );
    
    const hasExtremeLanguage = extremeLanguage.test(content);
    
    if (hasProhibited || hasExtremeLanguage) {
      return {
        isAllowed: false,
        reason: 'Content contains prohibited language or extreme statements'
      };
    }
    
    return { isAllowed: true };
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dating': return 'bg-primary/20 text-primary';
      case 'relationship': return 'bg-accent/20 text-accent-foreground';
      case 'hookup': return 'bg-secondary/50 text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">My Profile</h1>
                <p className="text-sm text-muted-foreground">not gossip just experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              
              <Avatar className="border-2 border-primary/30">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {userData.gender === 'male' ? 'M' : 'F'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Info */}
        <Card className="bg-gradient-card border-border/50 shadow-card mb-6">
          <CardHeader className="text-center">
            <Avatar className="h-20 w-20 mx-auto border-4 border-primary/30 mb-3">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                {userData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userData.name}</CardTitle>
            <CardDescription className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Verified {userData.gender === 'male' ? 'Male' : 'Female'}
              </Badge>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/50">
            <TabsTrigger value="my-posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Posts ({myPosts.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bookmark className="h-4 w-4 mr-1" />
              Saved ({savedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
              <Bell className="h-4 w-4 mr-1" />
              Alerts
              {unreadCount > 0 && (
                <Badge className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-accent">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* My Posts Tab */}
          <TabsContent value="my-posts" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Experiences</h3>
              <Button onClick={() => setShowNewPostForm(true)} className="h-9">
                <Plus className="h-4 w-4 mr-1" />
                New Post
              </Button>
            </div>

            {showNewPostForm && (
              <Card className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Share Your Experience</CardTitle>
                  <CardDescription>Help others with factual, respectful information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Person's Name</label>
                      <Input
                        placeholder="Full name"
                        value={newPost.targetName}
                        onChange={(e) => setNewPost(prev => ({ ...prev, targetName: e.target.value }))}
                        className="bg-card/50 border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={newPost.targetPhone}
                        onChange={(e) => setNewPost(prev => ({ ...prev, targetPhone: e.target.value }))}
                        className="bg-card/50 border-border/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['dating', 'relationship', 'hookup'] as const).map((cat) => (
                        <Button
                          key={cat}
                          variant={newPost.category === cat ? 'default' : 'outline'}
                          onClick={() => setNewPost(prev => ({ ...prev, category: cat }))}
                          className="capitalize"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Experience</label>
                    <Textarea
                      placeholder="Share factual information about your experience. Keep it respectful and constructive."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-card/50 border-border/50 min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Content is moderated. Extreme language or harmful content is not allowed.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" onClick={() => setShowNewPostForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>
                      Share Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} isOwn={true} />
            ))}
          </TabsContent>

          {/* Saved Posts Tab */}
          <TabsContent value="saved" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Saved Experiences</h3>
            {savedPosts.map((post) => (
              <SavedPostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markNotificationAsRead}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PostCard = ({ post, isOwn }: { post: Post; isOwn?: boolean }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dating': return 'bg-primary/20 text-primary';
      case 'relationship': return 'bg-accent/20 text-accent-foreground';
      case 'hookup': return 'bg-secondary/50 text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg">{post.targetName}</CardTitle>
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
              {isOwn && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  Your Post
                </Badge>
              )}
            </div>
            {post.targetPhone && (
              <p className="text-sm text-muted-foreground">{post.targetPhone}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {post.timestamp}
            </Badge>
            {isOwn && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="mb-4 leading-relaxed">
          {post.content}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.responses} responses
            </span>
            {post.isActive && (
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SavedPostCard = ({ post }: { post: SavedPost }) => {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg">{post.targetName}</CardTitle>
              <Badge className="bg-primary/20 text-primary">
                {post.category}
              </Badge>
              <Bookmark className="h-4 w-4 text-accent" />
              {post.hasNewResponses && (
                <Badge className="bg-accent text-accent-foreground text-xs">
                  New Activity
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Saved {post.savedAt} • by {post.originalAuthor}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {post.timestamp}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="mb-4 leading-relaxed">
          {post.content}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.responses} responses
            </span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationCard = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) => {
  return (
    <Card 
      className={`bg-gradient-card border-border/50 cursor-pointer transition-all duration-200 ${
        !notification.isRead ? 'shadow-luxury border-primary/30' : 'shadow-card'
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
              {notification.message}
            </p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {notification.timestamp}
            </div>
          </div>
          {!notification.isRead && (
            <div className="h-2 w-2 bg-primary rounded-full"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};