import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, MessageCircle, User, Send, Bookmark, Plus, Camera, X, MapPin, Zap, DollarSign } from "lucide-react";
import { CommentsDialog } from "@/components/CommentsDialog";
import { MessagingRestrictions } from "@/components/MessagingRestrictions";
import { DatingFootprintDisplay } from "@/components/DatingFootprintDisplay";
import { useMessagingEligibility } from "@/hooks/useMessagingEligibility";
import { useDatingFootprint } from "@/hooks/useDatingFootprint";
import { PostBoostButton } from "@/components/PostBoostButton";
import { useBoostedPosts } from "@/hooks/useBoostedPosts";
import { useMemoryMatches } from '@/hooks/useMemoryMatches';
import { useSavedPostNotifications } from '@/hooks/useSavedPostNotifications';
import { Checkbox } from "@/components/ui/checkbox";
import { BoostCelebration } from '@/components/BoostCelebration';
import { BoostedPostEffect } from '@/components/BoostedPostEffect';

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

interface Comment {
  id: string;
  authorName: string;
  authorGender: 'male' | 'female';
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export const HomePage = ({ userData, onMessage, onProfile }: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState(25); // radius in miles
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [messagingUserId, setMessagingUserId] = useState<string | null>(null);
  const [messagingUserName, setMessagingUserName] = useState<string>('');
  const [footprintPerson, setFootprintPerson] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showBoostCelebration, setShowBoostCelebration] = useState(false);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [newPost, setNewPost] = useState({
    targetName: '',
    content: '',
    images: [] as string[],
    wantsBoost: false
  });
  
  // Hooks
  const { isBoosted, getBoostEndTime, addBoostedPost } = useBoostedPosts();
  const { detectPotentialMatch } = useMemoryMatches();
  const { savePost, isPostSaved } = useSavedPostNotifications();
  const { canMessageUser, createSharedContext } = useMessagingEligibility();
  const { getFootprintForPerson, analyzeFootprint, getConfidenceLevel } = useDatingFootprint();

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

    // Initialize mock comments
    const mockComments: { [postId: string]: Comment[] } = {
      '1': [
        {
          id: 'c1',
          authorName: 'Anonymous User',
          authorGender: 'female',
          content: "Thanks for sharing this. I had a similar experience with someone who seemed charming at first.",
          timestamp: '1 hour ago'
        },
        {
          id: 'c2',
          authorName: 'CosmicSeeker',
          authorGender: 'male',
          content: "This is really helpful info. Dating can be tough when people aren't genuine.",
          timestamp: '30 minutes ago'
        }
      ],
      '2': [
        {
          id: 'c3',
          authorName: 'WisdomSeeker',
          authorGender: 'female',
          content: "Great to hear a positive story! Communication is so important in relationships.",
          timestamp: '2 hours ago'
        }
      ]
    };
    setComments(mockComments);
  }, [userData.gender]);

  const addComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      authorName: userData.screenName,
      authorGender: userData.gender,
      content: newComment,
      timestamp: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));

    // Update post response count
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, responses: post.responses + 1 }
        : post
    ));

    setNewComment('');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === '' || 
      post.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    // Sort by timestamp - newer posts first
    const getTimestamp = (timeStr: string) => {
      if (timeStr === 'Just now') return Date.now();
      if (timeStr.includes('minute')) return Date.now() - parseInt(timeStr) * 60 * 1000;
      if (timeStr.includes('hour')) return Date.now() - parseInt(timeStr) * 60 * 60 * 1000;
      if (timeStr.includes('day')) return Date.now() - parseInt(timeStr) * 24 * 60 * 60 * 1000;
      return Date.now() - 1000000; // fallback for older posts
    };
    
    return getTimestamp(b.timestamp) - getTimestamp(a.timestamp);
  });


  const handleSavePost = (post: Post) => {
    savePost(post.id, post.authorName, post.targetName);
  };

  const handleViewComments = (post: Post) => {
    setSelectedPost(post);
    setIsCommentsOpen(true);
    
    // Create shared context when viewing comments
    createSharedContext(
      'mock-user-id', 
      post.authorName, 
      'post_comment',
      `Viewed and can comment on ${post.authorName}'s post about ${post.targetName}`
    );
  };

  const handleMessageUser = (userId: string, userName: string) => {
    setMessagingUserId(userId);
    setMessagingUserName(userName);
  };

  const handleViewFootprint = (personName: string) => {
    setFootprintPerson(personName);
  };

  const handleCreatePost = async () => {
    if (!newPost.targetName || !newPost.content || newPost.images.length === 0) return;

    // If user wants boost, handle payment first
    if (newPost.wantsBoost) {
      await handleBoostPayment();
      return;
    }

    // Create regular post without boost
    createPost();
  };

  const handleBoostPayment = async () => {
    try {
      // Mock payment flow - same as PostBoostButton but for pre-posting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStripeUrl = `https://checkout.stripe.com/pay/mock-session-pre-boost-${Date.now()}`;
      
      // Open Stripe checkout in a new tab
      const paymentWindow = window.open(mockStripeUrl, '_blank');
      
      // Simulate successful payment after a delay
      setTimeout(() => {
        // In real app, this would be triggered by payment success webhook
        createPost(true); // Create post with boost enabled
        setShowBoostCelebration(true); // Show celebration animation
        if (paymentWindow) paymentWindow.close();
      }, 3000);
      
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const createPost = async (boosted: boolean = false) => {
    const post: Post = {
      id: Date.now().toString(),
      authorName: userData.screenName,
      authorGender: userData.gender,
      authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      targetName: newPost.targetName,
      content: newPost.content,
      timestamp: 'Just now',
      responses: 0,
      isActive: true,
      images: newPost.images.length > 0 ? newPost.images : undefined,
      location: 'Current Location' // In a real app, this would be user's actual location
    };

    setPosts(prev => [post, ...prev]);
    
    // If boosted, add to boosted posts
    if (boosted) {
      addBoostedPost(post.id);
    }
    
    // Check for potential memory matches
    await detectPotentialMatch({
      id: post.id,
      targetName: post.targetName,
      images: post.images || [],
      content: post.content,
      userId: 'current-user-id' // In real app, get from auth
    });
    
    setNewPost({
      targetName: '',
      content: '',
      images: [],
      wantsBoost: false
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
      {/* Header with Logo and Create Button */}
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/a3ca0fb5-905f-470d-ac61-7e26940cc492.png" 
              alt="Pillow Talk Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Pillow Talk
              </h1>
              <p className="text-xs text-muted-foreground">Not gossip just experience</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-6 py-2 rounded-lg shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
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
                    className="bg-teal-800/80 border-teal-600 text-white placeholder:text-teal-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Experience</label>
                  <Textarea
                    placeholder="Share your experience honestly and respectfully..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-teal-800/80 border-teal-600 text-white placeholder:text-teal-200 min-h-[100px]"
                  />
                </div>

                {/* Boost Option */}
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="boost-option"
                      checked={newPost.wantsBoost}
                      onCheckedChange={(checked) => 
                        setNewPost(prev => ({ ...prev, wantsBoost: !!checked }))
                      }
                      className="border-yellow-400 data-[state=checked]:bg-yellow-500"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor="boost-option"
                        className="text-sm font-semibold text-yellow-800 cursor-pointer flex items-center"
                      >
                        <Zap className="h-4 w-4 mr-1 text-yellow-600" />
                        Boost This Post
                        <Badge className="ml-2 bg-yellow-500 text-yellow-900 text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          2.99
                        </Badge>
                      </label>
                      <p className="text-xs text-yellow-700 mt-1">
                        Get 48 hours of enhanced visibility and priority placement
                      </p>
                    </div>
                  </div>
                  
                  {newPost.wantsBoost && (
                    <div className="mt-3 p-3 bg-yellow-200/50 rounded-lg border border-yellow-300">
                      <div className="flex items-center text-xs text-yellow-800">
                        <Zap className="h-3 w-3 mr-1" />
                        <span className="font-medium">Boost Benefits:</span>
                      </div>
                      <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                        <li>• Higher placement in feeds</li>
                        <li>• Special ⚡ boost indicator</li>
                        <li>• 48 hours of enhanced visibility</li>
                        <li>• Payment processed before posting</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Photo Required *</label>
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
                    disabled={!newPost.targetName || !newPost.content || newPost.images.length === 0}
                    className={newPost.wantsBoost 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold" 
                      : "bg-accent hover:bg-accent/90"
                    }
                  >
                    {newPost.wantsBoost ? (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Pay & Boost Post
                      </>
                    ) : (
                      "Share Experience"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search and Filter Bar */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-teal-800/80 border-teal-600 text-white placeholder:text-white/80 h-12"
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
                className="pl-10 bg-teal-800/80 border-teal-600 text-white placeholder:text-white/80 h-12"
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
        
        {/* New Posts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></div>
            New Posts
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              ({filteredPosts.length})
            </span>
          </h2>
          
          <div className="grid grid-cols-3 gap-1">
            {filteredPosts.map((post) => (
              <PostSquare key={post.id} post={post} onClick={() => setSelectedPost(post)} />
            ))}
          </div>
        </div>

        {/* Boost Celebration Animation */}
        <BoostCelebration 
          isVisible={showBoostCelebration}
          onComplete={() => setShowBoostCelebration(false)}
        />

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
          <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-white border-none shadow-xl max-h-[95vh] overflow-hidden rounded-2xl w-[95vw]">
            {selectedPost && (
              <PostDetailView 
                post={selectedPost} 
                onMessage={onMessage}
                onSave={handleSavePost}
                isSaved={isPostSaved(selectedPost.id)}
                onClose={() => setSelectedPost(null)}
                onMessageUser={handleMessageUser}
                onViewFootprint={handleViewFootprint}
                footprint={getFootprintForPerson(selectedPost.targetName)}
                analyzeFootprint={analyzeFootprint}
                getConfidenceLevel={getConfidenceLevel}
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
              />
            )}
          </DialogContent>
        </Dialog>
        
        <CommentsDialog 
          post={selectedPost} 
          isOpen={isCommentsOpen} 
          onClose={() => setIsCommentsOpen(false)} 
        />
        
        <MessagingRestrictions
          userId={messagingUserId || ''}
          userName={messagingUserName}
          isOpen={!!messagingUserId}
          onClose={() => {
            setMessagingUserId(null);
            setMessagingUserName('');
          }}
          onProceedToMessage={() => {
            onMessage(messagingUserId || '');
            setMessagingUserId(null);
            setMessagingUserName('');
          }}
        />

        {footprintPerson && (() => {
          const footprint = getFootprintForPerson(footprintPerson);
          if (!footprint) return null;
          
          const analysis = analyzeFootprint(footprint);
          const confidenceLevel = getConfidenceLevel(footprint.confidenceScore);
          
          return (
            <Dialog open={!!footprintPerson} onOpenChange={() => setFootprintPerson(null)}>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DatingFootprintDisplay 
                  footprint={footprint}
                  analysis={analysis}
                  confidenceLevel={confidenceLevel}
                />
              </DialogContent>
            </Dialog>
          );
        })()}
      </div>
    </div>
  );
};

const PostSquare = ({ post, onClick }: { post: Post; onClick: () => void }) => {
  const { isBoosted, getBoostEndTime } = useBoostedPosts();
  const boosted = isBoosted(post.id);
  const boostEndTime = boosted ? getBoostEndTime(post.id) : null;
  
  const formatTimeRemaining = (endTime: string | null) => {
    if (!endTime) return null;
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h left` : 'Expired';
  };

  const PostContent = (
    <div 
      className="relative aspect-square bg-gradient-card border border-border/30 rounded-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      {/* Target's image as background */}
      {post.targetImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${post.targetImage})` }}
        />
      )}
      
      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="text-xs">
            <p className="text-white/80 truncate">{post.authorName}</p>
            <p className="text-white/60">{post.timestamp}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-semibold text-sm mb-1 truncate">{post.targetName}</h3>
          <p className="text-white/80 text-xs line-clamp-2 leading-tight">{post.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-white/60 text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              {post.responses}
            </div>
            
            {post.isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return boosted ? (
    <BoostedPostEffect timeRemaining={formatTimeRemaining(boostEndTime)}>
      {PostContent}
    </BoostedPostEffect>
  ) : (
    PostContent
  );
};

const PostDetailView = ({ 
  post, 
  onMessage, 
  onSave, 
  isSaved, 
  onClose,
  onMessageUser,
  onViewFootprint,
  footprint,
  analyzeFootprint,
  getConfidenceLevel,
  comments,
  newComment,
  setNewComment,
  addComment
}: { 
  post: Post; 
  onMessage: (postId: string) => void; 
  onSave: (post: Post) => void; 
  isSaved: boolean;
  onClose: () => void;
  onMessageUser: (userId: string, userName: string) => void;
  onViewFootprint: (personName: string) => void;
  footprint: any;
  analyzeFootprint: any;
  getConfidenceLevel: any;
  comments: { [postId: string]: Comment[] };
  newComment: string;
  setNewComment: (value: string) => void;
  addComment: (postId: string) => void;
}) => {
  const { isBoosted, getBoostEndTime } = useBoostedPosts();
  const postIsBoosted = isBoosted(post.id);
  const boostEndTime = getBoostEndTime(post.id);
  
  // Mock logic to determine if current user is the post owner
  const isOwner = post.authorName === 'MysticWaves'; // In real app, compare with actual user data
  
  return (
    <div className="space-y-6 p-4 max-h-[90vh] overflow-y-auto">
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
          <div className="w-80 h-80 rounded-lg overflow-hidden border-4 border-gray-200 shadow-lg">
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

      {/* Dating Footprint Section - Always show for demo */}
      <div className="px-4 pb-4">
        <div 
          onClick={() => onViewFootprint(post.targetName)}
          className="cursor-pointer hover:bg-accent/5 rounded-lg transition-colors"
        >
          {footprint ? (
            <DatingFootprintDisplay 
              footprint={footprint}
              analysis={analyzeFootprint(footprint)}
              confidenceLevel={getConfidenceLevel(footprint.confidenceScore)}
              isPreview={true}
            />
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">No Dating Footprint Yet</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Click to check if {post.targetName} has been mentioned in other verified posts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-gray-800 leading-relaxed text-sm">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="default"
            onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-muted-foreground hover:text-foreground h-10 px-4"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {post.responses} {post.responses === 1 ? 'Comment' : 'Comments'}
          </Button>
          
          <Button
            variant="ghost"
            size="default"
            onClick={() => onSave(post)}
            className="text-muted-foreground hover:text-foreground h-10 px-4"
          >
            <Bookmark className="h-5 w-5 mr-2" />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="default"
            onClick={() => onMessageUser('mock-user-id', post.authorName)}
            className="flex-1 sm:flex-initial h-10 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            Message
          </Button>
          
          <PostBoostButton 
            postId={post.id}
            isOwner={isOwner}
            isBoosted={postIsBoosted}
            boostEndTime={boostEndTime}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments-section" className="border-t border-border/50 mt-6 pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments ({comments[post.id]?.length || 0})</h3>
        
        {/* Add Comment */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <Avatar className="border border-border/50">
              <AvatarFallback className="bg-primary/20 text-primary">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts respectfully..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none bg-teal-800/80 border-teal-600 text-white placeholder:text-white/80 focus:border-teal-500 focus:ring-teal-500/20"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Keep comments respectful and helpful
                </p>
                <Button 
                  onClick={() => addComment(post.id)}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments[post.id]?.length > 0 ? (
            comments[post.id].map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 p-4 bg-teal-800/60 border border-teal-600/50 rounded-lg">
                <Avatar className="border border-border/50">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm">{comment.authorName}</p>
                    <Badge variant="outline" className="text-xs">
                      {comment.authorGender === 'male' ? 'M' : 'F'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                  
                  {/* Comment actions */}
                  <div className="flex items-center space-x-4 mt-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive">
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};