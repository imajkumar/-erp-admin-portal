"use client";

import { HelpCircle, Palette, Settings } from "lucide-react";
import {
  MdBarChart,
  MdCheckBox,
  MdDescription,
  MdEvent,
  MdInventory,
  MdMessage,
  MdNotifications,
  MdPayment,
  MdPersonAdd,
  MdSettings,
  MdStorage,
  MdTrendingUp,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

type Theme = "default" | "blue" | "green" | "purple";

interface RightQuickSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

const themes = [
  {
    id: "default",
    name: "Default",
    color: "bg-gray-500",
    primary: "bg-gray-600",
    accent: "border-gray-500",
  },
  {
    id: "blue",
    name: "Blue",
    color: "bg-blue-500",
    primary: "bg-blue-600",
    accent: "border-blue-500",
  },
  {
    id: "green",
    name: "Green",
    color: "bg-green-500",
    primary: "bg-green-600",
    accent: "border-green-500",
  },
  {
    id: "purple",
    name: "Purple",
    color: "bg-purple-500",
    primary: "bg-purple-600",
    accent: "border-purple-500",
  },
];

const quickItems = [
  { id: "documents", icon: MdDescription, label: "Documents" },
  { id: "calendar", icon: MdEvent, label: "Calendar" },
  { id: "messages", icon: MdMessage, label: "Messages" },
  { id: "tasks", icon: MdCheckBox, label: "Tasks" },
  { id: "products", icon: MdInventory, label: "Products" },
  { id: "payments", icon: MdPayment, label: "Payments" },
  { id: "analytics", icon: MdTrendingUp, label: "Analytics" },
  { id: "notifications", icon: MdNotifications, label: "Notifications" },
  { id: "settings", icon: MdSettings, label: "Settings" },
  { id: "users", icon: MdPersonAdd, label: "Users" },
  { id: "dashboard", icon: MdBarChart, label: "Dashboard" },
  { id: "database", icon: MdStorage, label: "Database" },
];

export default function RightQuickSidebar({
  isOpen,
  onToggle,
  activeItem,
  onItemClick,
}: RightQuickSidebarProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && themes.some((theme) => theme.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = themes.find((t) => t.id === currentTheme);
    if (theme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: Theme) => {
    setCurrentTheme(themeId);
  };

  const currentThemeConfig =
    themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <TooltipProvider>
      {/* Right Quick Sidebar - Always Visible */}
      <div
        className="fixed right-0 h-[calc(100vh-45px-32px)] z-40 bg-gray-50 border-l border-purple-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12"
        style={{ top: "45px" }}
      >
        {/* Settings Panel */}
        <DropdownMenu open={settingsOpen} onOpenChange={setSettingsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-gray-200 mb-4"
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Settings Panel</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="left" className="w-80 p-0">
            <div className="p-6">
              {/* Page Style Setting */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Page Style Setting
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Theme Color
                </h3>
                <div className="flex space-x-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id as Theme)}
                      className={`w-8 h-8 ${theme.color} rounded-lg cursor-pointer border-2 ${
                        currentTheme === theme.id
                          ? "border-gray-800"
                          : "border-gray-300"
                      } flex items-center justify-center hover:scale-110 transition-transform`}
                    >
                      {currentTheme === theme.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Mode */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Navigation Mode
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SideMenu Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  SideMenu Type
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Content Width */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Content Width</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Fluid</option>
                    <option>Fixed</option>
                  </select>
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fixed Header</span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fixed Sidebar</span>
                  <div className="w-10 h-5 bg-blue-500 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Split Menus</span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Regional Settings
                </h3>
                <div className="space-y-2">
                  {["Header", "Footer", "Menu", "Menu Header"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <div className="w-10 h-5 bg-blue-500 rounded-full cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Weak Mode</span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-xs text-yellow-800">
                    Setting panel shows in development environment only, please
                    manually modify
                  </p>
                </div>
              </div>

              {/* Copy Setting Button */}
              <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Copy Setting</span>
                </div>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <div className="w-6 h-px bg-gray-300 mb-2"></div>

        {quickItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            {/* Active Indicator Line */}
            {activeItem === item.id && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full" />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onItemClick(item.id)}
                  className={`w-8 h-8 p-0 hover:bg-gray-200 relative ${
                    activeItem === item.id ? "mr-1" : ""
                  }`}
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
