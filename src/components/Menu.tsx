"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, Package, Info, Settings, Users, FileText, MoreHorizontal, Phone, Mail, MapPin, HelpCircle, Globe } from "lucide-react";

interface MenuProps {
  className?: string;
}

export default function Menu({ className = "" }: MenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigation('/dashboard')}
        className={`px-3 py-1 h-7 text-sm ${
          isActive('/dashboard') 
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-150' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Home className="h-3 w-3 mr-1" />
        Home
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigation('/dashboard/products')}
        className={`px-3 py-1 h-7 text-sm ${
          isActive('/dashboard/products') 
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-150' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Package className="h-3 w-3 mr-1" />
        Products
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigation('/dashboard/about')}
        className={`px-3 py-1 h-7 text-sm ${
          isActive('/dashboard/about') 
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-150' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Info className="h-3 w-3 mr-1" />
        About
      </Button>

      {/* 3 Dots Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 p-0.5 h-7 w-7"
            title="More menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem className="text-sm">
            <Users className="h-4 w-4 mr-2" />
            Team
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <Globe className="h-4 w-4 mr-2" />
            Website
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
