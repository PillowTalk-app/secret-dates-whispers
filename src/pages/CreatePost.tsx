import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, X, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface CreatePostProps {
  userData: UserData;
  onPostCreated?: () => void;
}

export const CreatePost = ({ userData, onPostCreated }: CreatePostProps) => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    targetName: '',
    content: '',
    images: [] as string[],
    location: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = () => {
    // Mock image upload - in real app would handle file upload
    const mockImages = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop'
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setPostData(prev => ({ ...prev, images: [...prev.images, randomImage] }));
  };

  const removeImage = (index: number) => {
    setPostData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async () => {
    if (!postData.targetName || !postData.content) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setPostData({
      targetName: '',
      content: '',
      images: [],
      location: ''
    });
    
    setIsSubmitting(false);
    onPostCreated?.();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl pb-24">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Experience</h1>
        <p className="text-muted-foreground">Help the community by sharing your dating experiences honestly and respectfully</p>
      </div>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Create New Post</span>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Anonymous
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Person's Name</label>
              <Input
                placeholder="First name or nickname"
                value={postData.targetName}
                onChange={(e) => setPostData(prev => ({ ...prev, targetName: e.target.value }))}
                className="bg-card/50 border-border/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Brooklyn, NY"
                  value={postData.location}
                  onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
            </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Your Experience</label>
              <Textarea
                placeholder="Share your experience honestly and respectfully. Focus on behaviors, communication style, and how they treated you. This helps others make informed decisions."
                value={postData.content}
                onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-card/50 border-border/50 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific about behaviors and interactions. Avoid personal attacks.
              </p>
            </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Photos (Optional)</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {postData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg border-2 border-accent/60 shadow-lg"
                        />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {postData.images.length < 4 && (
              <Button
                variant="outline"
                onClick={handleAddImage}
                className="w-full border-dashed border-border/50 h-20 hover:bg-muted/30"
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Only include photos that are relevant and appropriate
            </p>
          </div>

          {/* Community Guidelines */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-foreground mb-1">Community Guidelines</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Be honest and respectful in your reviews</li>
                  <li>• Focus on behaviors and experiences, not personal attacks</li>
                  <li>• Protect privacy - avoid sharing personal information</li>
                  <li>• Help others make informed decisions about their safety</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={!postData.targetName || !postData.content || isSubmitting}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white h-12"
          >
            {isSubmitting ? 'Sharing Experience...' : 'Share Experience'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};