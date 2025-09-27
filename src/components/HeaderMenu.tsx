"use client";

import { Button } from "@/components/ui/button";
import Logo from "./Logo";

interface HeaderMenuProps {
  onDrawerToggle: () => void;
}

export default function HeaderMenu({ onDrawerToggle }: HeaderMenuProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Logo - Full Width */}
      <div className="flex items-center justify-center py-2 border-b border-gray-200">
        <Logo className="h-8 w-auto" alt="Coca-Cola" />
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-gray-300"></div>

      {/* Menu Items */}
      <div className="flex items-center space-x-1 px-3 py-2">
        {/* 12 Dots Grid */}
        <button
          onClick={onDrawerToggle}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          title="Open apps drawer"
        >
          <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="w-0.5 h-0.5 bg-blue-600 rounded-full" />
            ))}
          </div>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Menu Items */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 px-3 py-1 h-7 text-sm"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 px-3 py-1 h-7 text-sm"
          >
            Products
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Login Button */}
        <Button
          variant="outline"
          size="sm"
          className="text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-1 h-7 text-sm"
        >
          Login
        </Button>
      </div>
    </div>
  );
}
