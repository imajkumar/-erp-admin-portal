"use client";

import { Star, MoreVertical, Inbox, MessageCircle, Bot } from "lucide-react";

interface LeftSidebarFooterProps {
  onMenuToggle?: () => void;
  menuDrawerOpen?: boolean;
  onInboxClick?: () => void;
  onChatClick?: () => void;
  onAiChatClick?: () => void;
}

export default function LeftSidebarFooter({
  onMenuToggle,
  menuDrawerOpen = false,
  onInboxClick,
  onChatClick,
  onAiChatClick,
}: LeftSidebarFooterProps) {
  const toggleMenuDrawer = () => {
    onMenuToggle?.();
  };

  return (
    <div className="px-3 py-2 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 font-sans">
      <div className="flex items-center justify-center space-x-2">
        {/* Inbox */}
        <button
          onClick={onInboxClick}
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50 cursor-pointer"
          title="Inbox"
        >
          <Inbox className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Inbox
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* Chat */}
        <button
          onClick={onChatClick}
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50 cursor-pointer"
          title="Chat"
        >
          <MessageCircle className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Chat
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* AI Chat */}
        <button
          onClick={onAiChatClick}
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50 cursor-pointer"
          title="AI Chat"
        >
          <Bot className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            AI Chat
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </button>

        {/* Favorites */}
        <button
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50 cursor-pointer"
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
          className="p-1.5 hover:bg-white/80 hover:shadow-sm rounded-full transition-all duration-200 relative group bg-white/50 border border-gray-200/50 cursor-pointer"
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
