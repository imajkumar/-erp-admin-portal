"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { 
  MdDescription,
  MdEvent,
  MdMessage,
  MdCheckBox,
  MdInventory,
  MdPayment,
  MdTrendingUp,
  MdNotifications,
  MdSettings,
  MdPersonAdd,
  MdBarChart,
  MdStorage
} from "react-icons/md";

interface RightQuickSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

const quickItems = [
  { id: 'documents', icon: MdDescription, label: 'Documents', bgColor: 'bg-blue-500', iconColor: 'text-white' },
  { id: 'calendar', icon: MdEvent, label: 'Calendar', bgColor: 'bg-green-500', iconColor: 'text-white' },
  { id: 'messages', icon: MdMessage, label: 'Messages', bgColor: 'bg-purple-500', iconColor: 'text-white' },
  { id: 'tasks', icon: MdCheckBox, label: 'Tasks', bgColor: 'bg-orange-500', iconColor: 'text-white' },
  { id: 'products', icon: MdInventory, label: 'Products', bgColor: 'bg-cyan-500', iconColor: 'text-white' },
  { id: 'payments', icon: MdPayment, label: 'Payments', bgColor: 'bg-yellow-500', iconColor: 'text-white' },
  { id: 'analytics', icon: MdTrendingUp, label: 'Analytics', bgColor: 'bg-emerald-500', iconColor: 'text-white' },
  { id: 'notifications', icon: MdNotifications, label: 'Notifications', bgColor: 'bg-red-500', iconColor: 'text-white' },
  { id: 'settings', icon: MdSettings, label: 'Settings', bgColor: 'bg-gray-500', iconColor: 'text-white' },
  { id: 'users', icon: MdPersonAdd, label: 'Users', bgColor: 'bg-indigo-500', iconColor: 'text-white' },
  { id: 'dashboard', icon: MdBarChart, label: 'Dashboard', bgColor: 'bg-teal-500', iconColor: 'text-white' },
  { id: 'database', icon: MdStorage, label: 'Database', bgColor: 'bg-pink-500', iconColor: 'text-white' }
];

export default function RightQuickSidebar({ isOpen, onToggle, activeItem, onItemClick }: RightQuickSidebarProps) {
  return (
    <TooltipProvider>
      {/* Right Quick Sidebar - Always Visible */}
      <div className="fixed right-0 h-[calc(100vh-45px)] z-40 bg-gray-50 border-l border-purple-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12" style={{ top: '45px' }}>
        {/* Dummy Icon - Help Circle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mb-4 w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors">
              <HelpCircle className="h-4 w-4 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Help & Support</p>
          </TooltipContent>
        </Tooltip>
        
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
                    activeItem === item.id ? 'mr-1' : ''
                  }`}
                >
                  <div className={`w-6 h-6 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
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
