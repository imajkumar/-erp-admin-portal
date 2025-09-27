"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Settings, Menu, X } from "lucide-react";
import { 
  MdDashboard,
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdLocalActivity,
  MdSettings,
  MdNotifications,
  MdHome,
  MdDescription,
  MdEvent,
  MdInventory,
  MdTrendingUp
} from "react-icons/md";

interface LeftQuickSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const quickItems = [
  { id: 'dashboard', icon: MdDashboard, label: 'Dashboard', bgColor: 'bg-blue-500', iconColor: 'text-white' },
  { id: 'users', icon: MdPeople, label: 'Users', bgColor: 'bg-purple-500', iconColor: 'text-white' },
  { id: 'sales', icon: MdShoppingCart, label: 'Sales', bgColor: 'bg-green-500', iconColor: 'text-white' },
  { id: 'revenue', icon: MdAttachMoney, label: 'Revenue', bgColor: 'bg-yellow-500', iconColor: 'text-white' },
  { id: 'activity', icon: MdLocalActivity, label: 'Activity', bgColor: 'bg-orange-500', iconColor: 'text-white' },
  { id: 'settings', icon: MdSettings, label: 'Settings', bgColor: 'bg-gray-500', iconColor: 'text-white' },
  { id: 'notifications', icon: MdNotifications, label: 'Notifications', bgColor: 'bg-red-500', iconColor: 'text-white' },
  { id: 'home', icon: MdHome, label: 'Home', bgColor: 'bg-indigo-500', iconColor: 'text-white' },
  { id: 'reports', icon: MdDescription, label: 'Reports', bgColor: 'bg-teal-500', iconColor: 'text-white' },
  { id: 'calendar', icon: MdEvent, label: 'Calendar', bgColor: 'bg-pink-500', iconColor: 'text-white' },
  { id: 'products', icon: MdInventory, label: 'Products', bgColor: 'bg-cyan-500', iconColor: 'text-white' },
  { id: 'analytics', icon: MdTrendingUp, label: 'Analytics', bgColor: 'bg-emerald-500', iconColor: 'text-white' }
];

export default function LeftQuickSidebar({ isOpen, onToggle, activeItem, onItemClick, sidebarOpen, onSidebarToggle }: LeftQuickSidebarProps) {
  return (
    <TooltipProvider>
      {/* Left Quick Sidebar - Always Visible and Sticky */}
      <div className="fixed left-0 h-[calc(100vh-45px)] z-40 bg-gray-50 border-r border-emerald-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12" style={{ top: '45px' }}>
        {/* Professional Sidebar Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className={`mb-4 w-8 h-8 p-0 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                sidebarOpen 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25' 
                  : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25'
              }`}
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4 text-white animate-in fade-in-0 zoom-in-95 duration-200" />
              ) : (
                <Menu className="h-4 w-4 text-white animate-in fade-in-0 zoom-in-95 duration-200" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="animate-in fade-in-0 zoom-in-95 duration-200">
            <p>{sidebarOpen ? "Close sidebar" : "Open sidebar"}</p>
          </TooltipContent>
        </Tooltip>
        
        {quickItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            {/* Active Indicator Line */}
            {activeItem === item.id && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onItemClick(item.id)}
                  className={`w-8 h-8 p-0 hover:bg-gray-200 relative ${
                    activeItem === item.id ? 'ml-1' : ''
                  }`}
                >
                  <div className={`w-6 h-6 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
