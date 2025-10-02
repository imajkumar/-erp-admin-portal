"use client";

import { Bell, Search, HelpCircle, Star, MoreVertical } from "lucide-react";
import { useState } from "react";

interface LeftSidebarFooterProps {
  onMenuToggle?: () => void;
  menuDrawerOpen?: boolean;
}

export default function LeftSidebarFooter({
  onMenuToggle,
  menuDrawerOpen = false,
}: LeftSidebarFooterProps) {
  const toggleMenuDrawer = () => {
    onMenuToggle?.();
  };

  return (
    <div className="px-3 py-2 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="flex items-center justify-center space-x-1">
        {/* Notifications */}
        <button
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
          title="Notifications"
        >
          <Bell className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Notifications
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* Search */}
        <button
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
          title="Search"
        >
          <Search className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Search
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* Help */}
        <button
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
          title="Help"
        >
          <HelpCircle className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Help
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* Favorites */}
        <button
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
          title="Favorites"
        >
          <Star className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Favorites
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* 3 Dots Menu */}
        <button
          onClick={toggleMenuDrawer}
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50"
          title={menuDrawerOpen ? "Close menu" : "Open menu"}
        >
          <MoreVertical className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {menuDrawerOpen ? "Close menu" : "Open menu"}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
