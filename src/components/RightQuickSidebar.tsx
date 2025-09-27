"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import Logo from "./Logo";
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
  { id: 'documents', icon: MdDescription, label: 'Documents' },
  { id: 'calendar', icon: MdEvent, label: 'Calendar' },
  { id: 'messages', icon: MdMessage, label: 'Messages' },
  { id: 'tasks', icon: MdCheckBox, label: 'Tasks' },
  { id: 'products', icon: MdInventory, label: 'Products' },
  { id: 'payments', icon: MdPayment, label: 'Payments' },
  { id: 'analytics', icon: MdTrendingUp, label: 'Analytics' },
  { id: 'notifications', icon: MdNotifications, label: 'Notifications' },
  { id: 'settings', icon: MdSettings, label: 'Settings' },
  { id: 'users', icon: MdPersonAdd, label: 'Users' },
  { id: 'dashboard', icon: MdBarChart, label: 'Dashboard' },
  { id: 'database', icon: MdStorage, label: 'Database' }
];

export default function RightQuickSidebar({ isOpen, onToggle, activeItem, onItemClick }: RightQuickSidebarProps) {
  return (
    <TooltipProvider>
      {/* Right Quick Sidebar - Always Visible */}
      <div className="fixed right-0 h-[calc(100vh-45px-32px)] z-40 bg-gray-50 border-l border-purple-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12" style={{ top: '45px' }}>

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
                    activeItem === item.id ? 'mr-1' : ''
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
