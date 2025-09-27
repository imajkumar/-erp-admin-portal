"use client";

import {
  Hash,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  isOnline: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Development Team",
    lastMessage: "Hey, can you review the latest changes?",
    timestamp: "2m",
    unread: 3,
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    lastMessage: "Thanks for the update!",
    timestamp: "5m",
    unread: 0,
    avatar: "SJ",
    isOnline: true,
  },
  {
    id: "3",
    name: "Marketing Team",
    lastMessage: "The campaign is ready to launch",
    timestamp: "1h",
    unread: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "Mike Chen",
    lastMessage: "Let's schedule a meeting",
    timestamp: "2h",
    unread: 0,
    avatar: "MC",
    isOnline: true,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey team! How's everyone doing?",
    sender: "Sarah Johnson",
    timestamp: "10:30 AM",
    isOwn: false,
    avatar: "SJ",
  },
  {
    id: "2",
    text: "Great! Just finished the new feature implementation.",
    sender: "You",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: "3",
    text: "Awesome! Can you share the details?",
    sender: "Mike Chen",
    timestamp: "10:35 AM",
    isOwn: false,
    avatar: "MC",
  },
  {
    id: "4",
    text: "Sure! I'll send the documentation shortly.",
    sender: "You",
    timestamp: "10:36 AM",
    isOwn: true,
  },
];

export default function MessengerPage() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-45px)] bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Chats</h1>
            <div className="flex items-center space-x-2">
              <JiraButton variant="icon" className="h-8 w-8 p-0">
                <Users className="h-4 w-4" />
              </JiraButton>
              <JiraButton variant="icon" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </JiraButton>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat === chat.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {chat.avatar ? (
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Hash className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Hash className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Development Team
                </h2>
                <p className="text-sm text-gray-500">5 members</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <JiraButton variant="icon" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </JiraButton>
              <JiraButton variant="icon" className="h-8 w-8 p-0">
                <Video className="h-4 w-4" />
              </JiraButton>
              <JiraButton variant="icon" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </JiraButton>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!msg.isOwn && (
                    <p className="text-xs font-medium mb-1">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <JiraButton variant="icon" className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
            </JiraButton>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <JiraButton variant="icon" className="h-6 w-6 p-0">
                  <Smile className="h-4 w-4" />
                </JiraButton>
                <JiraButton
                  variant="icon"
                  className="h-6 w-6 p-0"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </JiraButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
