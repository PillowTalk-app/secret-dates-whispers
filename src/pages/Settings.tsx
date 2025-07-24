import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Eye, Bell, Lock, MapPin, Users, Smartphone, ArrowLeft, LogOut, UserX, AlertTriangle, Info, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  screenName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

interface SettingsProps {
  userData: UserData;
}

export const Settings = ({ userData }: SettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showLocation: true,
    showLastSeen: true,
    allowMessages: 'verified',
    searchableByPhone: false,
    anonymousMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    safetyAlerts: true,
    weeklyDigest: true,
    postResponses: true,
    communityUpdates: false
  });

  const [safetySettings, setSafetySettings] = useState({
    twoFactorEnabled: false,
    autoDeleteMessages: false,
    blockSuspiciousUsers: true,
    requireVerification: true,
    locationRadius: [25] // miles
  });

  const [blockedUsers] = useState([
    { id: '1', name: 'SuspiciousUser123', blockedDate: '2 days ago' },
    { id: '2', name: 'SpamAccount99', blockedDate: '1 week ago' }
  ]);

  const handleSignOut = () => {
    setIsSigningOut(true);
    setTimeout(() => {
      // Clear authentication data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('appState');
      localStorage.removeItem('userData');
      
      // Clear any payment data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('match_payment_')) {
          localStorage.removeItem(key);
        }
      });
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Navigate to landing page
      window.location.href = '/';
      setIsSigningOut(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true);
    setTimeout(() => {
      // Mark account for deletion with 30-day recovery period
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 30);
      
      localStorage.setItem('accountDeletionScheduled', JSON.stringify({
        scheduledDate: new Date().toISOString(),
        recoveryDeadline: deletionDate.toISOString(),
        userEmail: userData.email,
        userName: userData.name
      }));
      
      // Clear authentication but keep deletion data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('appState');
      localStorage.removeItem('userData');
      
      toast({
        title: "Account Deletion Scheduled",
        description: "Your account will be deleted in 30 days. Check your email for recovery instructions.",
        variant: "destructive",
      });
      
      // Navigate to landing page
      window.location.href = '/';
      setIsDeletingAccount(false);
    }, 2000);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings & Privacy</h1>
        <p className="text-muted-foreground">Manage your privacy, safety, and notification preferences</p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card/50 border border-border/50">
          <TabsTrigger value="privacy" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Lock className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="safety" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Shield className="h-4 w-4 mr-2" />
            Safety
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="blocked" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Users className="h-4 w-4 mr-2" />
            Blocked
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <UserX className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-accent" />
                <span>Profile Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Who can see your profile</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger className="bg-card/50 border-border/50 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="verified">Verified users only</SelectItem>
                      <SelectItem value="private">Private (hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Show approximate location</Label>
                    <p className="text-xs text-muted-foreground">Helps others find relevant experiences</p>
                  </div>
                  <Switch
                    checked={privacySettings.showLocation}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLocation: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Show last seen</Label>
                    <p className="text-xs text-muted-foreground">When you were last active</p>
                  </div>
                  <Switch
                    checked={privacySettings.showLastSeen}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLastSeen: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Anonymous mode</Label>
                    <p className="text-xs text-muted-foreground">Hide your screen name from posts</p>
                  </div>
                  <Switch
                    checked={privacySettings.anonymousMode}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, anonymousMode: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Who can message you</Label>
                <Select 
                  value={privacySettings.allowMessages} 
                  onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, allowMessages: value }))}
                >
                  <SelectTrigger className="bg-card/50 border-border/50 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="verified">Verified users only</SelectItem>
                    <SelectItem value="none">No one</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Searchable by phone number</Label>
                  <p className="text-xs text-muted-foreground">Others can find you using your phone number</p>
                </div>
                <Switch
                  checked={privacySettings.searchableByPhone}
                  onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, searchableByPhone: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-accent" />
                <span>Account Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Two-factor authentication</Label>
                  <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                </div>
                <div className="flex items-center space-x-2">
                  {safetySettings.twoFactorEnabled && (
                    <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                  )}
                  <Switch
                    checked={safetySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Auto-delete old messages</Label>
                  <p className="text-xs text-muted-foreground">Automatically delete messages after 30 days</p>
                </div>
                <Switch
                  checked={safetySettings.autoDeleteMessages}
                  onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, autoDeleteMessages: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Block suspicious users</Label>
                  <p className="text-xs text-muted-foreground">Automatically block users flagged by community</p>
                </div>
                <Switch
                  checked={safetySettings.blockSuspiciousUsers}
                  onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, blockSuspiciousUsers: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Require verification for messages</Label>
                  <p className="text-xs text-muted-foreground">Only verified users can message you</p>
                </div>
                <Switch
                  checked={safetySettings.requireVerification}
                  onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, requireVerification: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span>Location Safety</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-foreground">Safety alert radius</Label>
                  <span className="text-sm text-muted-foreground">{safetySettings.locationRadius[0]} miles</span>
                </div>
                <Slider
                  value={safetySettings.locationRadius}
                  onValueChange={(value) => setSafetySettings(prev => ({ ...prev, locationRadius: value }))}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 mile</span>
                  <span>100 miles</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Receive safety alerts for incidents within this radius
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-accent" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">New messages</Label>
                  <p className="text-xs text-muted-foreground">When someone messages you</p>
                </div>
                <Switch
                  checked={notificationSettings.newMessages}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newMessages: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Safety alerts</Label>
                  <p className="text-xs text-muted-foreground">Important community safety notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.safetyAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, safetyAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Weekly digest</Label>
                  <p className="text-xs text-muted-foreground">Summary of activity in your area</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Post responses</Label>
                  <p className="text-xs text-muted-foreground">When someone responds to your posts</p>
                </div>
                <Switch
                  checked={notificationSettings.postResponses}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, postResponses: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Community updates</Label>
                  <p className="text-xs text-muted-foreground">News and updates from Pillow Talk</p>
                </div>
                <Switch
                  checked={notificationSettings.communityUpdates}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, communityUpdates: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Users you've blocked can't message you or see your posts
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {blockedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No blocked users</p>
                </div>
              ) : (
                blockedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Blocked {user.blockedDate}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                      Unblock
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Account Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-accent" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-foreground font-medium">{userData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Screen Name</Label>
                  <p className="text-foreground font-medium">@{userData.screenName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-foreground font-medium">{userData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-foreground font-medium">{userData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogOut className="h-5 w-5 text-blue-500" />
                <span>Sign Out</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device. You can sign back in anytime.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You'll need to sign back in to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="bg-gradient-card border-red-200/50 border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <UserX className="h-5 w-5" />
                <span>Delete Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 mb-1">30-Day Recovery Period</h4>
                    <p className="text-sm text-amber-700">
                      Your account will be scheduled for deletion but can be recovered within 30 days. 
                      After 30 days, your account and all data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>When you delete your account:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Your profile and posts will be hidden immediately</li>
                  <li>Your messages will be deleted</li>
                  <li>You'll receive an email with recovery instructions</li>
                  <li>You have 30 days to recover your account</li>
                  <li>After 30 days, deletion is permanent</li>
                </ul>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        <strong>This action will schedule your account for deletion.</strong>
                      </p>
                      <p>
                        Your account will be immediately deactivated and scheduled for permanent deletion in 30 days. 
                        You'll receive an email with instructions to recover your account if you change your mind.
                      </p>
                      <p className="text-red-600 font-medium">
                        Are you absolutely sure you want to continue?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeletingAccount ? 'Scheduling Deletion...' : 'Yes, Delete My Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t border-border/30">
        <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};