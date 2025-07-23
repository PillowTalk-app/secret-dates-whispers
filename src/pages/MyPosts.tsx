import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Eye, Heart, Edit, Trash2, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface MyPostsProps {
  userData: UserData;
}

interface MyPost {
  id: string;
  targetName: string;
  targetPhone?: string;
  content: string;
  timestamp: string;
  responses: number;
  views: number;
  likes: number;
  isActive: boolean;
  images?: string[];
  location: string;
}

export const MyPosts = ({ userData }: MyPostsProps) => {
  const navigate = useNavigate();
  const [myPosts] = useState<MyPost[]>([
    {
      id: '1',
      targetName: 'Alex Johnson',
      targetPhone: '+1 (555) 123-4567',
      content: 'Had an amazing 3-month relationship with this person. Very respectful and communicative. Would definitely recommend for serious dating.',
      timestamp: '2 days ago',
      responses: 8,
      views: 45,
      likes: 12,
      isActive: true,
      location: 'Brooklyn, NY',
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop']
    },
    {
      id: '2',
      targetName: 'Sam Wilson',
      content: 'Went on 2 dates. They were punctual and respectful throughout. Good conversation skills.',
      timestamp: '1 week ago',
      responses: 3,
      views: 28,
      likes: 7,
      isActive: false,
      location: 'Manhattan, NY'
    }
  ]);

  const activePosts = myPosts.filter(post => post.isActive);
  const inactivePosts = myPosts.filter(post => !post.isActive);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Posts</h1>
        <p className="text-muted-foreground">Manage your shared experiences and see engagement</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/50">
          <TabsTrigger value="active" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Active Posts ({activePosts.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Inactive Posts ({inactivePosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePosts.length === 0 ? (
            <Card className="bg-gradient-card border-border/50 text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">No active posts yet. Share your first experience!</p>
              </CardContent>
            </Card>
          ) : (
            activePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactivePosts.length === 0 ? (
            <Card className="bg-gradient-card border-border/50 text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">No inactive posts.</p>
              </CardContent>
            </Card>
          ) : (
            inactivePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PostCard = ({ post }: { post: MyPost }) => (
  <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <CardTitle className="text-lg">{post.targetName}</CardTitle>
            {post.isActive && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{post.timestamp}</span>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {post.location}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Post image ${index + 1}`} 
              className="w-full aspect-square object-cover rounded-lg border-2 border-accent/60 shadow-lg"
            />
          ))}
        </div>
      )}
      
      <p className="text-foreground leading-relaxed">{post.content}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {post.views}
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.responses}
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            {post.likes}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          View Responses
        </Button>
      </div>
    </CardContent>
  </Card>
);