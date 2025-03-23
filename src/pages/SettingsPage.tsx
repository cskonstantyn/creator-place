import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, CreditCard, Mail, Eye, EyeOff } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserSettings {
  notifications: {
    email: boolean;
    deals: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: boolean;
    activityTracking: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    deals: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: true,
    activityTracking: true,
  },
};

const SettingsPage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser) as UserProfile;
      setUser(userData);
      
      // Load settings from localStorage if available
      const storedSettings = localStorage.getItem("userSettings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call to update the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
            <p className="text-gray-400 mb-6">Please log in to view your settings</p>
            <Button onClick={() => navigate("/login")}>Log In</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glassmorphism w-full mb-6">
            <TabsTrigger value="notifications" className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Manage your email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-400">
                      Receive email notifications about your account
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="deal-notifications">Deal Updates</Label>
                    <p className="text-sm text-gray-400">
                      Receive notifications about new deals and discounts
                    </p>
                  </div>
                  <Switch
                    id="deal-notifications"
                    checked={settings.notifications.deals}
                    onCheckedChange={(checked) => handleNotificationChange('deals', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                    <p className="text-sm text-gray-400">
                      Receive marketing emails and newsletters
                    </p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
                
                <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <p className="text-sm text-gray-400">
                      Allow other users to see your profile information
                    </p>
                  </div>
                  <Switch
                    id="profile-visibility"
                    checked={settings.privacy.profileVisibility}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-tracking">Activity Tracking</Label>
                    <p className="text-sm text-gray-400">
                      Allow us to track your activity to improve your experience
                    </p>
                  </div>
                  <Switch
                    id="activity-tracking"
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) => handlePrivacyChange('activityTracking', checked)}
                  />
                </div>
                
                <Button onClick={handleSaveSettings}>Save Privacy Settings</Button>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  You can request a copy of your data or delete your account at any time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Request Data Export
                  </Button>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded-lg bg-afghan-background-dark border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded-lg bg-afghan-background-dark border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-4 py-2 rounded-lg bg-afghan-background-dark border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
                <CardDescription>
                  Manage your active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Current Session</h3>
                        <p className="text-sm text-gray-400">
                          {navigator.userAgent}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>IP: 192.168.1.1 (masked for privacy)</p>
                      <p>Last active: Just now</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Log Out All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
