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
  Package,
  Settings,
  Shield,
  User,
  Users,
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
    id: "users",
    label: "Users Management",
    icon: Package,
    children: [
      { id: "users", label: "Users", icon: User },
      { id: "roles", label: "Roles", icon: Shield },
      { id: "permissions", label: "Permissions", icon: Shield },
      { id: "logs", label: "Logs", icon: FileText },
      { id: "settings", label: "Settings", icon: Settings },
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

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;

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
            className={`flex-1 text-sm ${isActive ? "font-semibold" : "font-medium"}`}
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
          {hasChildren &&
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
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {item.label}
                    </h3>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">{renderMenuItem(item)}</div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 text-center font-medium">
              <p>ERP Admin v1.0.0</p>
              <p className="mt-1">© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
