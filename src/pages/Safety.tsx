import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, MapPin, Clock, Users, TrendingUp, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface SafetyProps {
  userData: UserData;
}

interface SafetyAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  reportCount: number;
  isVerified: boolean;
}

interface SafetyScore {
  overall: number;
  postsHelpfulness: number;
  communityTrust: number;
  responseRate: number;
}

export const Safety = ({ userData }: SafetyProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'alerts' | 'score' | 'insights'>('alerts');

  const [safetyAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Multiple Reports: Aggressive Behavior',
      description: 'Several users have reported aggressive behavior from someone operating in the Brooklyn Heights area. Be cautious when meeting new people.',
      location: 'Brooklyn Heights, NY',
      timestamp: '2 hours ago',
      reportCount: 5,
      isVerified: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'Catfishing Alert',
      description: 'Reports of someone using fake photos in the Manhattan dating scene. Always verify identity before meeting.',
      location: 'Manhattan, NY',
      timestamp: '6 hours ago',
      reportCount: 3,
      isVerified: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Safe Venue Recommendation',
      description: 'Community members recommend Central Park Boathouse as a safe, public first date location with good security.',
      location: 'Central Park, NY',
      timestamp: '1 day ago',
      reportCount: 8,
      isVerified: true
    }
  ]);

  const [safetyScore] = useState<SafetyScore>({
    overall: 85,
    postsHelpfulness: 92,
    communityTrust: 78,
    responseRate: 85
  });

  const [weeklyInsights] = useState({
    postsInYourArea: 12,
    newAlerts: 3,
    communityActivity: '+15%',
    yourImpact: '24 people helped'
  });

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Shield;
      default: return Shield;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Safety Dashboard</h1>
        <p className="text-muted-foreground">Stay informed about community safety and your contribution</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/50">
          <TabsTrigger value="alerts" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="score" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Shield className="h-4 w-4 mr-2" />
            My Safety Score
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {safetyAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <Card key={alert.id} className={`bg-gradient-card border ${getAlertColor(alert.type)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <AlertIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{alert.title}</CardTitle>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {alert.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-muted/50 text-muted-foreground">
                          {alert.reportCount} reports
                        </Badge>
                        {alert.isVerified && (
                          <Badge className="bg-green-500/20 text-green-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">{alert.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Community reported</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="score" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-accent" />
                <span>Your Safety Score</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your contributions to community safety and reliability
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(safetyScore.overall)}`}>
                  {safetyScore.overall}
                </div>
                <p className="text-muted-foreground">Overall Safety Score</p>
                <Badge className="bg-accent/20 text-accent mt-2">
                  Trusted Contributor
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(safetyScore.postsHelpfulness)}`}>
                    {safetyScore.postsHelpfulness}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Post Helpfulness</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(safetyScore.communityTrust)}`}>
                    {safetyScore.communityTrust}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Community Trust</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(safetyScore.responseRate)}`}>
                    {safetyScore.responseRate}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Response Rate</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                <h4 className="font-medium text-foreground mb-2">How to improve your score:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share detailed, helpful experiences</li>
                  <li>• Respond to community questions</li>
                  <li>• Report safety concerns when you see them</li>
                  <li>• Verify your identity completely</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Posts in your area</span>
                  <span className="text-2xl font-bold text-foreground">{weeklyInsights.postsInYourArea}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">New safety alerts</span>
                  <span className="text-2xl font-bold text-orange-400">{weeklyInsights.newAlerts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Community activity</span>
                  <span className="text-2xl font-bold text-green-400">{weeklyInsights.communityActivity}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">24</div>
                  <p className="text-muted-foreground">People helped this month</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    Your posts and responses have helped 24 community members make safer dating decisions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Community Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-xl font-bold text-foreground">156</div>
                  <p className="text-sm text-muted-foreground">Active users this week</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <div className="text-xl font-bold text-foreground">98%</div>
                  <p className="text-sm text-muted-foreground">Positive safety rating</p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-xl font-bold text-foreground">2.3k</div>
                  <p className="text-sm text-muted-foreground">Total community members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};