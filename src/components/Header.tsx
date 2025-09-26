"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search,
  Video,
  Calendar,
  Bell,
  Settings,
  UserPlus,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Grid3X3,
  Lock
} from "lucide-react";

interface HeaderProps {
  user?: any;
  onSidebarToggle: () => void;
  onSearchClick: () => void;
  onDrawerToggle: () => void;
  onLockScreen: () => void;
  sidebarOpen: boolean;
}

export default function Header({ 
  user, 
  onSidebarToggle, 
  onSearchClick, 
  onDrawerToggle, 
  onLockScreen,
  sidebarOpen 
}: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 text-white px-4 py-2" style={{ backgroundColor: '#0078d4' }}>
      <div className="flex items-center justify-between">
        {/* Left Side - App Branding */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center space-x-2">
            {/* 12 Dots Grid */}
            <button
              onClick={onDrawerToggle}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Open apps drawer"
            >
              <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-white rounded-full"
                  />
                ))}
              </div>
            </button>
            
            <h1 className="text-sm font-semibold text-white">ERP Admin</h1>
            <p className="text-xs text-blue-100">Next.js + ShadcnUI</p>
          </div>
        </div>
        
        {/* Center - Search Bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              onClick={onSearchClick}
              className="w-full pl-7 pr-3 py-1.5 bg-white rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-transparent cursor-pointer"
              readOnly
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
            </div>
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-1">
          {/* Lock Screen */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLockScreen}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1"
            title="Lock screen (Ctrl+L)"
          >
            <Lock className="h-4 w-4" />
          </Button>
          
          {/* Meet Now */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 px-2 py-1">
            <Video className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">Meet</span>
          </Button>
          
          {/* Teams */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-1">
            <div className="w-5 h-5 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">T</span>
            </div>
          </Button>
          
          {/* OneNote */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-1">
            <div className="w-5 h-5 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">N</span>
            </div>
          </Button>
          
          {/* Calendar/Tasks */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-1">
            <Calendar className="h-4 w-4" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-1 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-1">
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-white text-xs font-semibold" style={{ color: '#0078d4' }}>
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
