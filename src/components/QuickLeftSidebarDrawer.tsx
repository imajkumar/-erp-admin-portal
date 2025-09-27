"use client";

import { Drawer } from "antd";
import {
  BarChart3,
  Bell,
  Bug,
  Building2,
  Calendar,
  CheckSquare,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuickLeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const appItems = [
  { id: "home", name: "Home", icon: Home, description: "Main dashboard" },
  { id: "users", name: "Users", icon: Users, description: "User management" },
  {
    id: "sales",
    name: "Sales",
    icon: ShoppingCart,
    description: "Sales tracking",
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    description: "Analytics & reports",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    description: "Schedule & events",
  },
  { id: "mail", name: "Mail", icon: Mail, description: "Email management" },
  {
    id: "files",
    name: "Files",
    icon: FileText,
    description: "Document storage",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    description: "System settings",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "Alerts & updates",
  },
  { id: "help", name: "Help", icon: HelpCircle, description: "Support center" },
  {
    id: "company",
    name: "Company",
    icon: Building2,
    description: "Organization info",
  },
  {
    id: "automation",
    name: "Automation",
    icon: Zap,
    description: "Workflow automation",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Security center",
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Package,
    description: "Stock management",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageSquare,
    description: "Team communication",
  },
  {
    id: "tasks",
    name: "Tasks",
    icon: CheckSquare,
    description: "Task management",
  },
  { id: "bugs", name: "Bugs", icon: Bug, description: "Issue tracking" },
];

export default function QuickLeftSidebarDrawer({
  isOpen,
  onClose,
}: QuickLeftSidebarDrawerProps) {
  return (
    <Drawer
      title={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ERP</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
        </div>
      }
      placement="left"
      onClose={onClose}
      open={isOpen}
      width={320}
      className="antd-drawer-custom"
      styles={{
        body: { padding: 0 },
        header: {
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
        },
      }}
    >
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Quick Access */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {appItems.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Applications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              All Applications
            </h3>
            <div className="space-y-2">
              {appItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {item.id === "notifications" && (
                    <Badge variant="destructive" className="text-xs">
                      3
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Recent
            </h3>
            <div className="space-y-2">
              {appItems.slice(0, 3).map((item) => (
                <div
                  key={`recent-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div
                    className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">2m ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
