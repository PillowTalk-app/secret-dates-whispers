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
import { Slider } from "@/components/ui/slider";
import { Search, MessageCircle, Clock, TrendingUp, Phone, User, Send, Bookmark, Plus, Camera, X, MapPin } from "lucide-react";

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

export const HomePage = ({ userData, onMessage, onProfile }: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState(25); // radius in miles
  const [activeTab, setActiveTab] = useState('new');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    targetName: '',
    targetPhone: '',
    content: '',
    images: [] as string[]
  });

  // Initialize with mock posts
  useEffect(() => {
    const mockPosts: Post[] = [
        {
          id: '1',
          authorName: 'MysticWaves',
          authorGender: userData.gender === 'male' ? 'female' : 'male',
          authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          targetName: 'Alex Johnson',
          targetImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
          targetPhone: '+1 (555) 123-4567',
          content: 'Went on 3 dates with this person. They seemed genuine at first but turned out to be quite manipulative. Be careful if you match with them.',
          timestamp: '2 hours ago',
          responses: 5,
          isActive: true,
          location: 'Brooklyn, NY'
        },
        {
          id: '2',
          authorName: 'SunsetDreamer',
          authorGender: userData.gender === 'male' ? 'female' : 'male',
          authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          targetName: 'Sam Wilson',
          targetImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
          content: "Amazing partner for 6 months. Very honest, caring, and respectful. Highly recommend if you're looking for something serious.",
          timestamp: '4 hours ago',
          responses: 12,
          isActive: true,
          location: 'Manhattan, NY'
        },
        {
          id: '3',
          authorName: 'NightOwl',
          authorGender: userData.gender === 'male' ? 'female' : 'male',
          authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          targetName: 'Jordan Smith',
          targetImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
          targetPhone: '+1 (555) 987-6543',
          content: 'Had a casual encounter. They were respectful and communicated well about boundaries. Safe and consensual experience.',
          timestamp: '1 day ago',
          responses: 3,
          isActive: false,
          images: [`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop`],
          location: 'Queens, NY'
        },
        {
          id: '4',
          authorName: 'CityExplorer',
          authorGender: userData.gender === 'male' ? 'female' : 'male',
          authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          targetName: 'Riley Thompson',
          targetImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
          content: 'Great first date at a local café. Very engaging conversation and respectful throughout.',
          timestamp: '6 hours ago',
          responses: 2,
          isActive: true,
          location: 'Los Angeles, CA'
        }
    ];
    setPosts(mockPosts);
  }, [userData.gender]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.targetPhone && post.targetPhone.includes(searchQuery));
    
    const matchesLocation = selectedLocation === '' || 
      post.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    const matchesTab = activeTab === 'new' || 
      (activeTab === 'active' && post.isActive);
    
    return matchesSearch && matchesLocation && matchesTab;
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
      authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      targetName: newPost.targetName,
      targetPhone: newPost.targetPhone || undefined,
      content: newPost.content,
      timestamp: 'Just now',
      responses: 0,
      isActive: true,
      images: newPost.images.length > 0 ? newPost.images : undefined,
      location: 'Current Location' // In a real app, this would be user's actual location
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      targetName: '',
      targetPhone: '',
      content: '',
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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search and Filter Bar */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 h-12"
            />
          </div>

          {/* Location Filter */}
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Enter your location (e.g., Brooklyn, NY)"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 bg-card/50 border-border/50 h-12"
              />
            </div>
            
            <div className="px-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Search Radius</label>
                <span className="text-sm text-gray-500">{searchRadius} miles</span>
              </div>
              <Slider
                value={[searchRadius]}
                onValueChange={(value) => setSearchRadius(value[0])}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 mile</span>
                <span>100 miles</span>
              </div>
            </div>
          </div>
        </div>
        {/* Create Experience Button */}
        <div className="mb-6">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white">
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
          <DialogContent className="sm:max-w-md bg-white border-none shadow-xl max-h-[90vh] overflow-hidden rounded-2xl">
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
  const displayImage = post.images && post.images.length > 0 
    ? post.images[0] 
    : `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&auto=faces`;

  return (
    <div 
      className="aspect-square relative cursor-pointer group overflow-hidden rounded-lg border-2 border-accent/60 shadow-lg"
      onClick={onClick}
    >
      <img 
        src={displayImage}
        alt={post.targetName}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      
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
  return (
    <div className="space-y-5 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border-2 border-gray-100">
            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
              {post.authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="rounded-xl overflow-hidden bg-gray-50 border-2 border-accent/60 shadow-lg">
          <img 
            src={post.images[0]} 
            alt="Post image" 
            className="w-full aspect-square object-cover"
          />
        </div>
      )}

      {/* Target Person Photo */}
      {post.targetImage && (
        <div className="flex justify-center">
          <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-gray-200 shadow-lg">
            <img 
              src={post.targetImage} 
              alt={post.targetName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Target Info */}
      <div className="text-center space-y-2">
        <h4 className="font-semibold text-gray-900 text-lg">{post.targetName}</h4>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {post.location}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-gray-800 leading-relaxed text-sm">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <MessageCircle className="h-4 w-4" />
          <span>{post.responses} responses</span>
          {post.isActive && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                <span>Active</span>
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
            className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-blue-500' : ''}`} />
          </Button>
          <Button
            onClick={() => onMessage(post.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-4 text-sm rounded-lg"
          >
            <Send className="h-3 w-3 mr-1" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};