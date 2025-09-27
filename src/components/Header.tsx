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
    <header className="fixed top-0 left-0 right-0 z-50 text-white px-3 py-1" style={{ backgroundColor: '#0078d4', height: '45px' }}>
      <div className="flex items-center justify-between h-full">
        {/* Left Side - App Branding */}
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu Toggle - Only show when sidebar is closed */}
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-7 w-7"
              title="Open sidebar"
            >
              <Menu className="h-3 w-3" />
            </Button>
          )}
          
          <div className={`flex items-center space-x-1 ${!sidebarOpen ? 'ml-1' : ''}`}>
            {/* 12 Dots Grid */}
            <button
              onClick={onDrawerToggle}
              className="p-0.5 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Open apps drawer"
            >
              <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-white rounded-full"
                  />
                ))}
              </div>
            </button>
            
            <h1 className="text-xs font-semibold text-white ml-0.5">ERP Admin</h1>
            <p className="text-xs text-blue-100">Next.js + ShadcnUI</p>
          </div>
        </div>
        
        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md mx-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              onClick={onSearchClick}
              className="w-full pl-6 pr-2 py-1 bg-white rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-transparent cursor-pointer h-6"
              readOnly
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
            </div>
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-0.5">
          {/* Lock Screen */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLockScreen}
            className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7"
            title="Lock screen (Ctrl+L)"
          >
            <Lock className="h-3 w-3" />
          </Button>
          
          {/* Meet Now */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 px-1 py-0.5 h-7">
            <Video className="h-3 w-3 mr-0.5" />
            <span className="text-xs font-medium">Meet</span>
          </Button>
          
          {/* Teams */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">T</span>
            </div>
          </Button>
          
          {/* OneNote */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">N</span>
            </div>
          </Button>
          
          {/* Calendar/Tasks */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7">
            <Calendar className="h-3 w-3" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7 relative">
            <Bell className="h-3 w-3" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7">
            <Settings className="h-3 w-3" />
          </Button>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 p-0.5 h-7 w-7">
                <Avatar className="h-5 w-5">
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
