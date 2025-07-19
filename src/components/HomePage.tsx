import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageCircle, Clock, TrendingUp, Phone, User, Send, Bookmark } from "lucide-react";

interface HomePageProps {
  userGender: 'male' | 'female';
  onMessage: (postId: string) => void;
  onProfile: () => void;
}

interface Post {
  id: string;
  authorGender: 'male' | 'female';
  targetName: string;
  targetPhone?: string;
  content: string;
  timestamp: string;
  responses: number;
  isActive: boolean;
  category: 'dating' | 'relationship' | 'hookup';
}

export const HomePage = ({ userGender, onMessage, onProfile }: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('new');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Mock posts - in real app this would come from backend
  const mockPosts: Post[] = [
    {
      id: '1',
      authorGender: userGender === 'male' ? 'female' : 'male',
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
      authorGender: userGender === 'male' ? 'female' : 'male',
      targetName: 'Sam Wilson',
      content: 'Amazing partner for 6 months. Very honest, caring, and respectful. Highly recommend if you\'re looking for something serious.',
      timestamp: '4 hours ago',
      responses: 12,
      isActive: true,
      category: 'relationship'
    },
    {
      id: '3',
      authorGender: userGender === 'male' ? 'female' : 'male',
      targetName: 'Jordan Smith',
      targetPhone: '+1 (555) 987-6543',
      content: 'Had a casual encounter. They were respectful and communicated well about boundaries. Safe and consensual experience.',
      timestamp: '1 day ago',
      responses: 3,
      isActive: false,
      category: 'hookup'
    }
  ];

  const filteredPosts = mockPosts.filter(post => {
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
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </span>
              <p className="text-xs text-muted-foreground ml-2">not gossip just experience</p>
              <Badge variant="secondary" className="bg-accent/20 text-accent text-xs ml-1">
                Verified
              </Badge>
            </div>
            <Avatar className="border-2 border-accent/30" onClick={onProfile}>
              <AvatarFallback className="bg-gradient-accent text-accent-foreground cursor-pointer hover:shadow-glow transition-all">
                {userGender === 'male' ? 'M' : 'F'}
              </AvatarFallback>
            </Avatar>
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

          <TabsContent value="new" className="space-y-4 mt-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onMessage={onMessage} onSave={handleSavePost} isSaved={savedPosts.includes(post.id)} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            {filteredPosts.filter(p => p.isActive).map((post) => (
              <PostCard key={post.id} post={post} onMessage={onMessage} onSave={handleSavePost} isSaved={savedPosts.includes(post.id)} />
            ))}
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
      </div>
    </div>
  );
};

const PostCard = ({ post, onMessage, onSave, isSaved }: { post: Post; onMessage: (postId: string) => void; onSave: (postId: string) => void; isSaved: boolean }) => {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-luxury transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg">{post.targetName}</CardTitle>
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
            </div>
            {post.targetPhone && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Phone className="h-3 w-3 mr-1" />
                {post.targetPhone}
              </div>
            )}
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
            {post.isActive && (
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                Active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSave(post.id)}
              className={`border-border/30 ${isSaved ? 'text-accent hover:text-accent/80' : 'hover:text-accent'}`}
            >
              <Bookmark className={`h-3 w-3 mr-1 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMessage(post.id)}
              className="border-accent/30 hover:bg-accent/10"
            >
              <Send className="h-3 w-3 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getCategoryColor(category: string) {
  switch (category) {
    case 'dating': return 'bg-primary/20 text-primary';
    case 'relationship': return 'bg-accent/20 text-accent-foreground';
    case 'hookup': return 'bg-secondary/50 text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
}