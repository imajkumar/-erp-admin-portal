"use client";

import { Drawer } from "antd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Check, 
  X, 
  MoreVertical,
  User,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'calendar' | 'file';
  isRead: boolean;
  avatar?: string;
  sender?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message in Development Team',
    timestamp: '2 minutes ago',
    type: 'message',
    isRead: false,
    avatar: 'SJ',
    sender: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'Meeting Reminder',
    message: 'Team standup meeting starts in 15 minutes',
    timestamp: '5 minutes ago',
    type: 'calendar',
    isRead: false
  },
  {
    id: '3',
    title: 'File Uploaded',
    message: 'New project documentation has been uploaded',
    timestamp: '1 hour ago',
    type: 'file',
    isRead: true
  },
  {
    id: '4',
    title: 'System Update',
    message: 'ERP system will be updated tonight at 2:00 AM',
    timestamp: '2 hours ago',
    type: 'info',
    isRead: true
  },
  {
    id: '5',
    title: 'Task Completed',
    message: 'Your task "Update user interface" has been completed',
    timestamp: '3 hours ago',
    type: 'success',
    isRead: true
  },
  {
    id: '6',
    title: 'Warning',
    message: 'Low disk space on server. Please check storage.',
    timestamp: '4 hours ago',
    type: 'warning',
    isRead: true
  },
  {
    id: '7',
    title: 'New User',
    message: 'Mike Chen has joined the Development Team',
    timestamp: '1 day ago',
    type: 'info',
    isRead: true,
    avatar: 'MC',
    sender: 'Mike Chen'
  },
  {
    id: '8',
    title: 'Error Report',
    message: 'Critical error detected in payment module',
    timestamp: '1 day ago',
    type: 'error',
    isRead: true
  },
  {
    id: '9',
    title: 'Schedule Change',
    message: 'Weekly team meeting moved to Friday 3:00 PM',
    timestamp: '2 days ago',
    type: 'calendar',
    isRead: true
  },
  {
    id: '10',
    title: 'Document Review',
    message: 'Please review the updated API documentation',
    timestamp: '3 days ago',
    type: 'file',
    isRead: true
  }
];

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'file':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'border-l-blue-500 bg-blue-50';
      case 'calendar':
        return 'border-l-green-500 bg-green-50';
      case 'file':
        return 'border-l-purple-500 bg-purple-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="text-lg font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400}
      className="notification-drawer-custom"
      styles={{
        body: { padding: 0 },
        header: { 
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }
      }}
    >
      {/* Actions */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs">
            <Check className="h-3 w-3 mr-1" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {mockNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {notification.avatar && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-blue-500 text-white text-xs">
                                  {notification.avatar}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-xs text-gray-600">
            View All Notifications
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
