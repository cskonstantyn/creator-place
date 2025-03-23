import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckIcon, Bell, Check, Trash2, Tag, DollarSign, Star, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "promotion" | "deal";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

const NotificationsPage = () => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Deal approved!",
      message: "Your deal with Nike has been approved and published.",
      date: "Just now",
      isRead: false,
    },
    {
      id: "2",
      type: "info",
      title: "Profile updated",
      message: "Your profile has been updated successfully.",
      date: "2 hours ago",
      isRead: false,
    },
    {
      id: "3",
      type: "deal",
      title: "New deal available",
      message: "A new deal from Adidas is available for your profile.",
      date: "Yesterday",
      isRead: true,
    },
    {
      id: "4",
      type: "promotion",
      title: "50% off promotion",
      message: "Get 50% off on premium membership for the next 24 hours.",
      date: "2 days ago",
      isRead: true,
    },
    {
      id: "5",
      type: "warning",
      title: "Account verification required",
      message: "Please verify your account to access all features.",
      date: "3 days ago",
      isRead: true,
    },
    {
      id: "6",
      type: "deal",
      title: "Deal expiring soon",
      message: "Your deal with Puma will expire in 3 days.",
      date: "4 days ago",
      isRead: true,
    },
  ]);

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    }
    if (activeTab === "unread") {
      return notifications.filter(notification => !notification.isRead);
    }
    return notifications.filter(notification => notification.type === activeTab);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case "deal":
        return <Tag className="h-5 w-5 text-purple-500" />;
      case "promotion":
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      default:
        return <Star className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getTabCount = (tab: string) => {
    if (tab === "all") return notifications.length;
    if (tab === "unread") return notifications.filter(n => !n.isRead).length;
    return notifications.filter(n => n.type === tab).length;
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-400 mt-1">Stay updated with your deals and account activity</p>
          </div>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            <span>Mark all as read</span>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="glassmorphism w-full mb-6 flex">
            <TabsTrigger value="all" className="flex-1">
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread ({getTabCount("unread")})
            </TabsTrigger>
            <TabsTrigger value="deal" className="flex-1">
              Deals ({getTabCount("deal")})
            </TabsTrigger>
            <TabsTrigger value="promotion" className="flex-1 hidden md:flex">
              Promotions ({getTabCount("promotion")})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead
                        ? "bg-afghan-background-dark/50 border-white/5"
                        : "bg-afghan-background-dark border-purple-500/20"
                    } relative transition-all hover:border-white/10`}
                  >
                    <div className="flex">
                      <div className="p-2 rounded-full bg-white/5 mr-4 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-white">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {notification.date}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-0 h-8 w-8"
                          >
                            <CheckIcon className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="p-0 h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 border border-dashed border-white/10 rounded-lg bg-white/2">
                  <Megaphone className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No notifications</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    You don't have any {activeTab === "all" ? "" : activeTab + " "}notifications at the moment.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationsPage; 