import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, MessageCircle, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Pillow Talk
        </h1>
        <p className="text-xl text-accent font-semibold mb-2">
          "Not gossip, just experiences"
        </p>
        <p className="text-lg text-muted-foreground">
          Sharing experiences, just good things - helping our community make safer, more informed dating decisions
        </p>
      </div>

      <div className="space-y-8">
        {/* Mission Section */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-accent" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              Pillow Talk exists to create a safer dating environment by empowering people to share their authentic experiences. 
              We believe that honest, respectful communication about dating encounters can help others make informed decisions 
              about their safety and compatibility.
            </p>
            <p className="text-foreground leading-relaxed">
              This isn't about gossip or judgment - it's about building a community where experiences are shared constructively 
              to promote safety, respect, and better connections.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>How It Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Verify Your Identity</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Complete our secure verification process to ensure community safety and authenticity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Share Experiences</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Post honest, respectful reviews about your dating experiences to help others.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Stay Informed</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Access community insights, safety alerts, and make more informed dating decisions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">4</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Build Community</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Connect with others, participate in discussions, and contribute to a safer dating culture.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-accent" />
              <span>Our Values</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold text-foreground mb-2">Safety First</h3>
                <p className="text-sm text-muted-foreground">
                  Every feature is designed with user safety and privacy as the top priority.
                </p>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Heart className="h-8 w-8 mx-auto mb-3 text-pink-400" />
                <h3 className="font-semibold text-foreground mb-2">Respect & Honesty</h3>
                <p className="text-sm text-muted-foreground">
                  We promote honest sharing while maintaining respect for everyone involved.
                </p>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                <h3 className="font-semibold text-foreground mb-2">Community Support</h3>
                <p className="text-sm text-muted-foreground">
                  Building a supportive community where everyone feels heard and protected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Features */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>Safety Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Identity Verification</h4>
                  <p className="text-sm text-muted-foreground">Multi-step verification ensures authentic users</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Anonymous Posting</h4>
                  <p className="text-sm text-muted-foreground">Share experiences while protecting your identity</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Real-time Safety Alerts</h4>
                  <p className="text-sm text-muted-foreground">Community-driven alerts for your area</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Comprehensive Reporting</h4>
                  <p className="text-sm text-muted-foreground">Easy reporting system with rapid response</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Privacy Controls</h4>
                  <p className="text-sm text-muted-foreground">Granular control over your information</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Community Moderation</h4>
                  <p className="text-sm text-muted-foreground">Active moderation by trusted community members</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              <span>Community Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground font-medium">
              To maintain a safe and supportive environment, we ask all community members to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Be honest and factual in your experiences</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Focus on behaviors and actions, not personal attacks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Respect privacy and avoid sharing sensitive personal information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Report any safety concerns or inappropriate behavior</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Support others with kindness and understanding</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>Use the platform to promote safety and positive connections</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              Have questions, suggestions, or safety concerns? We're here to help.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-accent/20 text-accent">safety@pillowtalk.app</Badge>
              <Badge className="bg-blue-500/20 text-blue-300">support@pillowtalk.app</Badge>
              <Badge className="bg-purple-500/20 text-purple-300">feedback@pillowtalk.app</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};