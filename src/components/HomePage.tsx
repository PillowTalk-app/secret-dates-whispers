import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageCircle, Clock, TrendingUp, Phone, User, Send, Bookmark, Plus, Camera, X } from "lucide-react";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface HomePageProps {
  userData: UserData;
  onMessage: (postId: string) => void;
  onProfile: () => void;
}

interface Post {
  id: string;
  authorName: string;
  authorGender: 'male' | 'female';
  targetName: string;
  targetPhone?: string;
  content: string;
  timestamp: string;
  responses: number;
  isActive: boolean;
  category: 'dating' | 'relationship' | 'hookup';
  images?: string[];
}

export const HomePage = ({ userData, onMessage, onProfile }: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('new');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    targetName: '',
    targetPhone: '',
    content: '',
    category: 'dating' as Post['category'],
    images: [] as string[]
  });

  // Initialize with mock posts
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: '1',
        authorName: 'MysticWaves',
        authorGender: userData.gender === 'male' ? 'female' : 'male',
        targetName: 'Alex Johnson',
        targetPhone: '+1 (555) 123-4567',
        content: 'Went on 3 dates with this person. They seemed genuine at first but turned out to be quite manipulative. Be careful if you match with them.',
        timestamp: '2 hours ago',
        responses: 5,
        isActive: true,
        category: 'dating'
      },
      {
        id: '2',
        authorName: 'SunsetDreamer',
        authorGender: userData.gender === 'male' ? 'female' : 'male',
        targetName: 'Sam Wilson',
        content: "Amazing partner for 6 months. Very honest, caring, and respectful. Highly recommend if you're looking for something serious.",
        timestamp: '4 hours ago',
        responses: 12,
        isActive: true,
        category: 'relationship'
      },
      {
        id: '3',
        authorName: 'NightOwl',
        authorGender: userData.gender === 'male' ? 'female' : 'male',
        targetName: 'Jordan Smith',
        targetPhone: '+1 (555) 987-6543',
        content: 'Had a casual encounter. They were respectful and communicated well about boundaries. Safe and consensual experience.',
        timestamp: '1 day ago',
        responses: 3,
        isActive: false,
        category: 'hookup',
        images: [`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop`]
      }
    ];
    setPosts(mockPosts);
  }, [userData.gender]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.targetPhone && post.targetPhone.includes(searchQuery));
    
    const matchesTab = activeTab === 'new' || 
      (activeTab === 'active' && post.isActive);
    
    return matchesSearch && matchesTab;
  });

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCreatePost = () => {
    if (!newPost.targetName || !newPost.content) return;

    const post: Post = {
      id: Date.now().toString(),
      authorName: userData.screenName,
      authorGender: userData.gender,
      targetName: newPost.targetName,
      targetPhone: newPost.targetPhone || undefined,
      content: newPost.content,
      timestamp: 'Just now',
      responses: 0,
      isActive: true,
      category: newPost.category,
      images: newPost.images.length > 0 ? newPost.images : undefined
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      targetName: '',
      targetPhone: '',
      content: '',
      category: 'dating',
      images: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleAddImage = () => {
    // Mock image upload - in real app would handle file upload
    const mockImages = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop'
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setNewPost(prev => ({ ...prev, images: [...prev.images, randomImage] }));
  };

  const removeImage = (index: number) => {
    setNewPost(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </span>
              <p className="text-xs text-muted-foreground ml-2">Not gossip just experience</p>
              <Badge variant="secondary" className="bg-accent/20 text-accent text-xs ml-1">
                Verified
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="luxury" size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                    <DialogDescription>
                      Help others by sharing your dating experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Person's Name</label>
                      <Input
                        placeholder="First name or nickname"
                        value={newPost.targetName}
                        onChange={(e) => setNewPost(prev => ({ ...prev, targetName: e.target.value }))}
                        className="bg-card/50 border-border/50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number (Optional)</label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={newPost.targetPhone}
                        onChange={(e) => setNewPost(prev => ({ ...prev, targetPhone: e.target.value }))}
                        className="bg-card/50 border-border/50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={newPost.category} onValueChange={(value: Post['category']) => setNewPost(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-card/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/50">
                          <SelectItem value="dating">Dating</SelectItem>
                          <SelectItem value="relationship">Relationship</SelectItem>
                          <SelectItem value="hookup">Hookup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Experience</label>
                      <Textarea
                        placeholder="Share your experience honestly and respectfully..."
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        className="bg-card/50 border-border/50 min-h-[100px]"
                      />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Photos (Optional)</label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {newPost.images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <img 
                              src={image} 
                              alt={`Upload ${index + 1}`} 
                              className="w-full h-full object-cover rounded-lg border border-border/50"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 p-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {newPost.images.length < 4 && (
                        <Button
                          variant="outline"
                          onClick={handleAddImage}
                          className="w-full border-dashed border-border/50 h-20"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photo
                        </Button>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!newPost.targetName || !newPost.content}
                        className="bg-accent hover:bg-accent/90"
                      >
                        Share Experience
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Avatar className="border-2 border-accent/30" onClick={onProfile}>
                <AvatarFallback className="bg-gradient-accent text-accent-foreground cursor-pointer hover:shadow-glow transition-all">
                  {userData.gender === 'male' ? 'M' : 'F'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border/50 h-12"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/50">
            <TabsTrigger value="new" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              New Posts
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-3 gap-1">
              {filteredPosts.map((post) => (
                <PostSquare key={post.id} post={post} onClick={() => setSelectedPost(post)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-3 gap-1">
              {filteredPosts.filter(p => p.isActive).map((post) => (
                <PostSquare key={post.id} post={post} onClick={() => setSelectedPost(post)} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <Card className="bg-gradient-card border-border/50 text-center py-8">
            <CardContent>
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No posts found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {/* Post Detail Modal */}
        <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="sm:max-w-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <PostDetailView 
                post={selectedPost} 
                onMessage={onMessage}
                onSave={handleSavePost}
                isSaved={savedPosts.includes(selectedPost.id)}
                onClose={() => setSelectedPost(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const PostSquare = ({ post, onClick }: { post: Post; onClick: () => void }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dating': return 'bg-pink-500/20 text-pink-300';
      case 'relationship': return 'bg-purple-500/20 text-purple-300';
      case 'hookup': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const displayImage = post.images && post.images.length > 0 
    ? post.images[0] 
    : `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&auto=faces`;

  return (
    <div 
      className="aspect-square relative cursor-pointer group overflow-hidden rounded-lg border border-border/30"
      onClick={onClick}
    >
      <img 
        src={displayImage}
        alt={post.targetName}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      
      {/* Category badge */}
      <div className="absolute top-2 left-2">
        <Badge className={`${getCategoryColor(post.category)} text-xs`}>
          {post.category}
        </Badge>
      </div>

      {/* Response indicator */}
      <div className="absolute bottom-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs text-white">
        <MessageCircle className="h-3 w-3 inline mr-1" />
        {post.responses}
      </div>

      {/* Active indicator */}
      {post.isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

const PostDetailView = ({ 
  post, 
  onMessage, 
  onSave, 
  isSaved, 
  onClose 
}: { 
  post: Post; 
  onMessage: (postId: string) => void; 
  onSave: (postId: string) => void; 
  isSaved: boolean;
  onClose: () => void;
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dating': return 'bg-primary/20 text-primary';
      case 'relationship': return 'bg-accent/20 text-accent-foreground';
      case 'hookup': return 'bg-secondary/50 text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-semibold">{post.targetName}</h2>
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Shared by {post.authorName} • {post.timestamp}
          </div>
          {post.targetPhone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {post.targetPhone}
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.images.map((image, index) => (
            <div key={index} className="aspect-square">
              <img 
                src={image} 
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border/50"
              />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
        <p className="leading-relaxed">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
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
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => onSave(post.id)}
            className={`${isSaved ? 'text-accent hover:text-accent/80' : 'hover:text-accent'}`}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          
          <Button 
            onClick={() => onMessage(post.id)}
            className="bg-accent hover:bg-accent/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};