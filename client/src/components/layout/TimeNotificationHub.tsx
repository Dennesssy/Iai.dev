import { useState, useEffect } from "react";
import { Clock, Bell, X, AlertCircle, TrendingUp, Package, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "performance" | "price" | "release" | "info";
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "GPT-5.1 Released",
    description: "New frontier model from OpenAI with 89.5% MMLU-Pro score",
    type: "release",
    timestamp: "2 min ago",
    read: false,
    icon: <Package className="h-4 w-4 text-blue-500" />,
  },
  {
    id: "2",
    title: "Performance Alert",
    description: "Claude 3.5 Sonnet improved to 88.7% on MMLU-Pro",
    type: "performance",
    timestamp: "15 min ago",
    read: false,
    icon: <TrendingUp className="h-4 w-4 text-green-500" />,
  },
  {
    id: "3",
    title: "Price Update",
    description: "Gemini 3 Pro reduced by 25% on OpenRouter",
    type: "price",
    timestamp: "1 hour ago",
    read: true,
    icon: <Zap className="h-4 w-4 text-yellow-500" />,
  },
  {
    id: "4",
    title: "New Benchmark Data",
    description: "LiveCodeBench scores updated for all frontier models",
    type: "info",
    timestamp: "3 hours ago",
    read: true,
    icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
  },
];

export default function TimeNotificationHub() {
  const [time, setTime] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/50 transition-colors cursor-pointer relative group">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono font-bold text-sm text-foreground tracking-wider">
              {time || "00:00:00"}
            </span>
          </div>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="text-[10px] px-1.5 h-5 absolute -top-1 -right-1"
            >
              {unreadCount}
            </Badge>
          )}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground whitespace-nowrap">
            Notifications Hub
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="center">
        <div className="flex flex-col h-96">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-secondary/30 sticky top-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleClearAll}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-secondary/30 transition-colors group cursor-pointer ${
                      !notification.read ? "bg-secondary/10" : ""
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-foreground">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.description}
                        </p>
                        <span className="text-[11px] text-muted-foreground/60 mt-1 block">
                          {notification.timestamp}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-secondary/10 text-center">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs w-full"
                onClick={() => {
                  setNotifications([]);
                  setOpen(false);
                }}
              >
                Clear all notifications
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
