"use client";

import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  Home,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchSuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: "page" | "setting" | "profile" | "action";
  path?: string;
  action?: () => void;
}

const searchItems: SearchItem[] = [
  // Pages
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Main dashboard overview",
    icon: Home,
    type: "page",
    path: "/dashboard",
  },
  {
    id: "users",
    title: "Users",
    description: "User management and profiles",
    icon: Users,
    type: "page",
    path: "/dashboard/users",
  },
  {
    id: "sales",
    title: "Sales",
    description: "Sales tracking and analytics",
    icon: ShoppingCart,
    type: "page",
    path: "/dashboard/sales",
  },
  {
    id: "reports",
    title: "Reports",
    description: "Analytics and reporting",
    icon: BarChart3,
    type: "page",
    path: "/dashboard/reports",
  },
  {
    id: "products",
    title: "Products",
    description: "Product catalog and inventory",
    icon: Package,
    type: "page",
    path: "/dashboard/products",
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Schedule and events",
    icon: Calendar,
    type: "page",
    path: "/calendar",
  },
  {
    id: "messages",
    title: "Messages",
    description: "Team communication",
    icon: MessageSquare,
    type: "page",
    path: "/dashboard/messages",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Task management",
    icon: CheckSquare,
    type: "page",
    path: "/dashboard/tasks",
  },

  // Settings
  {
    id: "erp-settings",
    title: "ERP Settings",
    description: "System configuration and settings",
    icon: Settings,
    type: "setting",
    path: "/dashboard/settings",
  },
  {
    id: "user-settings",
    title: "User Settings",
    description: "Personal account settings",
    icon: User,
    type: "setting",
    path: "/dashboard/profile",
  },
  {
    id: "company-settings",
    title: "Company Settings",
    description: "Organization settings",
    icon: Building2,
    type: "setting",
    path: "/dashboard/company",
  },

  // Profile
  {
    id: "profile",
    title: "My Profile",
    description: "View and edit your profile",
    icon: User,
    type: "profile",
    path: "/dashboard/profile",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage notification preferences",
    icon: Bell,
    type: "profile",
    path: "/dashboard/notifications",
  },
];

export default function SearchSuggestions({
  isOpen,
  onClose,
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredItems(searchItems.slice(0, 8)); // Show first 8 items when no query
    } else {
      const filtered = searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleItemClick(filteredItems[selectedIndex]);
      }
    }
  };

  const handleItemClick = (item: SearchItem) => {
    if (item.path) {
      router.push(item.path);
    }
    if (item.action) {
      item.action();
    }
    onClose();
    setQuery("");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "text-blue-600 bg-blue-50";
      case "setting":
        return "text-purple-600 bg-purple-50";
      case "profile":
        return "text-green-600 bg-green-50";
      case "action":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return "Page";
      case "setting":
        return "Setting";
      case "profile":
        return "Profile";
      case "action":
        return "Action";
      default:
        return "Item";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for pages, settings, or profiles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-3 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                        {index === selectedIndex ? "↵" : ""}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <span>
                {filteredItems.length} result
                {filteredItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
