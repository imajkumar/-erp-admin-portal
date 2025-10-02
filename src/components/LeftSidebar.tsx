"use client";

import {
  Activity,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  MessageSquare,
  MoreVertical,
  Package,
  Settings,
  Shield,
  User,
  Users,
  X,
  Bell,
  Search,
  HelpCircle,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [{ id: "erp-settings", label: "ERP Settings", icon: Settings }],
  },

  {
    id: "system-users",
    label: "USERS MANAGEMENT",
    icon: Package,
    children: [
      { id: "system-users", label: "System Users", icon: User },
      { id: "admin-roles", label: "Admin Roles", icon: Shield },
      { id: "system-permissions", label: "System Permissions", icon: Shield },
      { id: "audit-logs", label: "Audit Logs", icon: FileText },
      { id: "system-settings", label: "System Settings", icon: Settings },
    ],
  },

  {
    id: "users-management",
    label: "Users Management",
    icon: Package,
    children: [
      { id: "users", label: "Users", icon: User },
      { id: "roles", label: "Roles", icon: Shield },
      { id: "permissions", label: "Permissions", icon: Shield },
      { id: "activity", label: "Activity", icon: Activity },
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "file-manager", label: "File Manager", icon: FolderOpen },
      { id: "inbox", label: "Inbox", icon: MessageSquare },
      { id: "contacts", label: "Contacts", icon: Users },
    ],
  },
];

export default function LeftSidebar({
  isOpen,
  onClose,
  activeItem,
  onItemClick,
}: LeftSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["dashboards"]);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleMenuDrawer = () => {
    setMenuDrawerOpen(!menuDrawerOpen);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;
    const isSystemUsers = item.id === "system-users";
    const isUsersManagement = item.id === "users-management";

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start text-left h-9 px-3 transition-all duration-200 ${
            isActive
              ? "bg-blue-100 text-blue-800 hover:bg-blue-150 border-r-3 border-blue-600 shadow-sm font-semibold"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          style={{ marginLeft: level > 0 ? `${level * 16}px` : "0" }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
        >
          <item.icon
            className={`mr-3 h-4 w-4 ${
              isActive ? "text-blue-700" : "text-gray-500"
            }`}
          />
          <span
            className={`flex-1 text-sm ${
              isActive ? "font-semibold" : "font-medium"
            } ${
              isSystemUsers
                ? "uppercase tracking-wider font-bold"
                : isUsersManagement
                  ? "capitalize"
                  : ""
            }`}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge
              className={`ml-auto text-xs ${
                isActive
                  ? "bg-blue-200 text-blue-800 font-semibold"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {item.badge}
            </Badge>
          )}
          {/* Show chevron only for the second "Users Management" item */}
          {hasChildren &&
            isUsersManagement &&
            (isExpanded ? (
              <ChevronDown
                className={`ml-2 h-3 w-3 ${isActive ? "text-blue-600" : "text-gray-500"}`}
              />
            ) : (
              <ChevronRight
                className={`ml-2 h-3 w-3 ${isActive ? "text-blue-600" : "text-gray-500"}`}
              />
            ))}
        </Button>

        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-1">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <aside
        className="fixed left-12 w-64 h-[calc(100vh-45px-32px)] z-30 bg-white border-r border-gray-200 shadow-sm"
        style={{ top: "45px" }}
      >
        <div className="flex flex-col h-full">
          {/* Dashboard Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center w-full h-10 px-3 text-gray-700">
              <Home className="mr-3 h-4 w-4 text-blue-600" />
              <span className="flex-1 text-sm font-semibold">Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-gray-600" />
                    <h3
                      className={`text-xs font-semibold text-gray-600 ${
                        item.id === "system-users"
                          ? "uppercase tracking-wider font-bold"
                          : item.id === "users-management"
                            ? "capitalize"
                            : "uppercase tracking-wider"
                      }`}
                    >
                      {item.label}
                    </h3>
                  </div>
                  {/* Show chevron only for the second "Users Management" item */}
                  {item.id === "users-management" &&
                    item.children &&
                    item.children.length > 0 &&
                    (expandedItems.includes(item.id) ? (
                      <ChevronDown className="h-3 w-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-gray-500" />
                    ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-1">{renderMenuItem(item)}</div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-center space-x-2">
              {/* Dummy Icons */}
              <button
                className="p-2 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
                title="Notifications"
              >
                <Bell className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Notifications
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>

              <button
                className="p-2 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
                title="Search"
              >
                <Search className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Search
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>

              <button
                className="p-2 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
                title="Help"
              >
                <HelpCircle className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Help
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>

              <button
                className="p-2 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
                title="Favorites"
              >
                <Star className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Favorites
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>

              {/* 3 Dots Menu */}
              <button
                onClick={toggleMenuDrawer}
                className="p-2 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
                title={menuDrawerOpen ? "Close menu" : "Open menu"}
              >
                <MoreVertical className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {menuDrawerOpen ? "Close menu" : "Open menu"}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Menu Drawer */}
      {menuDrawerOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-80 z-50 bg-white border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
                  <MoreVertical className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Quick Menu
                </h3>
              </div>
              <button
                onClick={toggleMenuDrawer}
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors group hover:scale-110 active:scale-95"
                title="Close menu"
              >
                <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* System Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  System Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Version</span>
                    <span className="text-blue-600 font-medium">v1.0.0</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Last Update</span>
                    <span className="text-gray-600 font-medium">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center space-x-2">
                    <Settings className="h-3 w-3" />
                    <span>System Settings</span>
                  </button>
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>User Profile</span>
                  </button>
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center space-x-2">
                    <Shield className="h-3 w-3" />
                    <span>Security</span>
                  </button>
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center space-x-2">
                    <BarChart3 className="h-3 w-3" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Login successful</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">Settings updated</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-600">New notification</span>
                  </div>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Help & Support
                </h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    📚 Documentation
                  </button>
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    💬 Contact Support
                  </button>
                  <button className="w-full text-left p-2 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    🐛 Report Bug
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                nitiERP Admin Portal
              </div>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
