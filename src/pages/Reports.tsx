import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Clock, CheckCircle, User, MessageSquare, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface ReportsProps {
  userData: UserData;
}

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'user' | 'message';
  targetId: string;
  targetName: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const Reports = ({ userData }: ReportsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-reports' | 'create-report'>('my-reports');
  const [newReport, setNewReport] = useState({
    targetType: 'post' as 'post' | 'user' | 'message',
    targetName: '',
    reason: '',
    description: ''
  });

  const [myReports] = useState<Report[]>([
    {
      id: '1',
      reporterId: userData.phone,
      reporterName: userData.screenName,
      targetType: 'user',
      targetId: 'user123',
      targetName: 'BadBehavior99',
      reason: 'harassment',
      description: 'Sent inappropriate messages repeatedly after I declined to meet',
      status: 'investigating',
      timestamp: '2 days ago',
      priority: 'high'
    },
    {
      id: '2',
      reporterId: userData.phone,
      reporterName: userData.screenName,
      targetType: 'post',
      targetId: 'post456',
      targetName: 'Fake Review Post',
      reason: 'false_information',
      description: 'This post contains completely false information about someone I know personally',
      status: 'resolved',
      timestamp: '1 week ago',
      priority: 'medium'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'investigating': return 'bg-blue-500/20 text-blue-300';
      case 'resolved': return 'bg-green-500/20 text-green-300';
      case 'dismissed': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300';
      case 'high': return 'bg-orange-500/20 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleSubmitReport = () => {
    if (!newReport.targetName || !newReport.reason || !newReport.description) return;
    
    // In real app, this would submit to backend
    console.log('Submitting report:', newReport);
    
    // Reset form
    setNewReport({
      targetType: 'post',
      targetName: '',
      reason: '',
      description: ''
    });
    
    // Switch to my reports tab
    setActiveTab('my-reports');
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Safety & Reports</h1>
        <p className="text-muted-foreground">Help keep our community safe by reporting inappropriate behavior</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/50">
          <TabsTrigger value="my-reports" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Shield className="h-4 w-4 mr-2" />
            My Reports
          </TabsTrigger>
          <TabsTrigger value="create-report" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Issue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports" className="space-y-4">
          {myReports.length === 0 ? (
            <Card className="bg-gradient-card border-border/50 text-center py-8">
              <CardContent>
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reports submitted yet.</p>
              </CardContent>
            </Card>
          ) : (
            myReports.map((report) => (
              <Card key={report.id} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">
                          {report.targetType === 'user' ? 'User Report' : 
                           report.targetType === 'post' ? 'Post Report' : 'Message Report'}
                        </CardTitle>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge className={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Target: {report.targetName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reported {report.timestamp}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.targetType === 'user' && <User className="h-4 w-4 text-muted-foreground" />}
                      {report.targetType === 'post' && <Eye className="h-4 w-4 text-muted-foreground" />}
                      {report.targetType === 'message' && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Reason</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {report.reason.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Description</h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {report.status === 'resolved' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Resolved</span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        Thank you for helping keep our community safe. Appropriate action has been taken.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="create-report" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <span>Report Safety Issue</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Help us maintain a safe community by reporting inappropriate behavior, false information, or safety concerns.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">What are you reporting?</label>
                <Select 
                  value={newReport.targetType} 
                  onValueChange={(value: 'post' | 'user' | 'message') => 
                    setNewReport(prev => ({ ...prev, targetType: value }))
                  }
                >
                  <SelectTrigger className="bg-card/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="post">A Post/Review</SelectItem>
                    <SelectItem value="user">A User Profile</SelectItem>
                    <SelectItem value="message">A Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  {newReport.targetType === 'user' ? 'Username' : 
                   newReport.targetType === 'post' ? 'Post Title/Author' : 'Message From'}
                </label>
                <Input
                  placeholder="Enter the name or identifier"
                  value={newReport.targetName}
                  onChange={(e) => setNewReport(prev => ({ ...prev, targetName: e.target.value }))}
                  className="bg-card/50 border-border/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Reason for Report</label>
                <Select 
                  value={newReport.reason} 
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger className="bg-card/50 border-border/50">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                    <SelectItem value="false_information">False Information</SelectItem>
                    <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                    <SelectItem value="privacy_violation">Privacy Violation</SelectItem>
                    <SelectItem value="safety_concern">Safety Concern</SelectItem>
                    <SelectItem value="spam">Spam or Fake Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Detailed Description</label>
                <Textarea
                  placeholder="Please provide specific details about the issue. Include what happened, when it occurred, and why you believe it violates our community guidelines."
                  value={newReport.description}
                  onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-card/50 border-border/50 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The more details you provide, the better we can investigate and take appropriate action.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your report will be reviewed by our moderation team</li>
                  <li>• We'll investigate within 24-48 hours</li>
                  <li>• You'll receive updates on the status of your report</li>
                  <li>• Appropriate action will be taken if violations are confirmed</li>
                </ul>
              </div>

              <Button 
                onClick={handleSubmitReport}
                disabled={!newReport.targetName || !newReport.reason || !newReport.description}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white h-12"
              >
                Submit Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};