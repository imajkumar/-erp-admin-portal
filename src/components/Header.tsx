"use client";

import {
  AlertTriangle,
  Bell,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Menu from "./Menu";

interface HeaderProps {
  user?: any;
  onSidebarToggle: () => void;
  onSearchClick: () => void;
  onDrawerToggle: () => void;
  onNotificationClick: () => void;
  onInboxClick: () => void;
  onLockScreen: () => void;
  sidebarOpen: boolean;
}

export default function Header({
  user,
  onSidebarToggle,
  onSearchClick,
  onDrawerToggle,
  onNotificationClick,
  onInboxClick,
  onLockScreen,
  sidebarOpen,
}: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  const handleCreateNew = (type: string) => {
    switch (type) {
      case "user":
        window.location.href = "/dashboard/users";
        break;
      case "sample":
        window.location.href = "/dashboard/samples";
        break;
      case "order":
        window.location.href = "/dashboard/orders";
        break;
      case "product":
        window.location.href = "/dashboard/products";
        break;
      case "customer":
        window.location.href = "/dashboard/customers";
        break;
      case "supplier":
        window.location.href = "/dashboard/suppliers";
        break;
      case "invoice":
        window.location.href = "/dashboard/invoices";
        break;
      case "quotation":
        window.location.href = "/dashboard/quotations";
        break;
      case "purchase":
        window.location.href = "/dashboard/purchases";
        break;
      case "inventory":
        window.location.href = "/dashboard/inventory";
        break;
      case "email":
        window.location.href = "/dashboard/inbox";
        break;
      case "chat":
        window.open("/dashboard/messenger", "_blank", "width=1200,height=800");
        break;
      case "event":
        window.location.href = "/dashboard/calendar";
        break;
      case "module":
        window.location.href = "/dashboard/settings/modules";
        break;
      case "report":
        window.location.href = "/dashboard/reports";
        break;
      case "task":
        window.location.href = "/dashboard/tasks";
        break;
      case "project":
        window.location.href = "/dashboard/projects";
        break;
      default:
        console.log(`Create ${type} clicked`);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 text-gray-900 px-3 py-1 bg-white border-b border-gray-200"
      style={{ height: "45px" }}
    >
      <div className="flex items-center justify-between h-full">
        {/* Left Side - App Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* 12 Dots Grid */}
            <JiraButton onClick={onDrawerToggle} title="Open apps drawer">
              <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-blue-600 rounded-full"
                  />
                ))}
              </div>
            </JiraButton>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Menu */}
            <Menu />
          </div>
        </div>

        {/* Center - Empty */}
        <div className="flex-1"></div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              onClick={onSearchClick}
              className="w-32 pl-7 pr-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer h-6"
              readOnly
              title="Search (⌘K)"
            />
          </div>

          {/* Create Button - Jira Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <JiraButton variant="create">
                <Plus className="h-3 w-3 mr-1" />
                Create
                <ChevronDown className="h-3 w-3 ml-1" />
              </JiraButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-50">
              <DropdownMenuLabel className="text-xs font-semibold text-gray-700">
                Create New
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* User Management */}
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2 py-1">
                User Management
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("user")}
              >
                <UserPlus className="h-3 w-3 mr-2" />
                Create User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("customer")}
              >
                <Users className="h-3 w-3 mr-2" />
                Create Customer
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("supplier")}
              >
                <Truck className="h-3 w-3 mr-2" />
                Create Supplier
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Business Operations */}
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2 py-1">
                Business Operations
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("order")}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                Create Order
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("sample")}
              >
                <Package className="h-3 w-3 mr-2" />
                Create Sample
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("product")}
              >
                <Package className="h-3 w-3 mr-2" />
                Create Product
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("invoice")}
              >
                <FileText className="h-3 w-3 mr-2" />
                Create Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("quotation")}
              >
                <FileText className="h-3 w-3 mr-2" />
                Create Quotation
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("purchase")}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                Create Purchase
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Communication */}
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2 py-1">
                Communication
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("email")}
              >
                <Mail className="h-3 w-3 mr-2" />
                Create Email
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("chat")}
              >
                <MessageSquare className="h-3 w-3 mr-2" />
                Create Chat
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("event")}
              >
                <Calendar className="h-3 w-3 mr-2" />
                Create Event
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* System & Reports */}
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2 py-1">
                System & Reports
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("module")}
              >
                <Settings className="h-3 w-3 mr-2" />
                Create Module
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("report")}
              >
                <FileText className="h-3 w-3 mr-2" />
                Create Report
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("task")}
              >
                <Zap className="h-3 w-3 mr-2" />
                Create Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => handleCreateNew("project")}
              >
                <Package className="h-3 w-3 mr-2" />
                Create Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* Dashboard */}
          <JiraButton
            onClick={() => (window.location.href = "/dashboard")}
            title="Dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
          </JiraButton>

          {/* Lock Screen */}
          <JiraButton onClick={onLockScreen} title="Lock screen (Ctrl+L)">
            <Lock className="h-3.5 w-3.5" />
          </JiraButton>

          {/* Inbox */}
          <JiraButton title="Inbox" onClick={onInboxClick}>
            <Mail className="h-3.5 w-3.5" />
          </JiraButton>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* Chat */}
          <JiraButton
            variant="text"
            onClick={() =>
              window.open(
                "/dashboard/messenger",
                "_blank",
                "width=1200,height=800",
              )
            }
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">Chat</span>
          </JiraButton>

          {/* AI Assistant */}
          <JiraButton
            variant="text"
            onClick={() =>
              window.open(
                "/dashboard/ai-messenger",
                "_blank",
                "width=1200,height=800",
              )
            }
          >
            <Bot className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">AI</span>
          </JiraButton>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* Teams */}
          <JiraButton>
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">T</span>
            </div>
          </JiraButton>

          {/* OneNote */}
          <JiraButton>
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">N</span>
            </div>
          </JiraButton>

          {/* Calendar/Tasks */}
          <JiraButton>
            <Calendar className="h-3.5 w-3.5" />
          </JiraButton>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* Notifications */}
          <JiraButton onClick={onNotificationClick} className="relative">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </JiraButton>

          {/* Settings */}
          <JiraButton>
            <Settings className="h-3.5 w-3.5" />
          </JiraButton>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <JiraButton>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-600">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </JiraButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
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
          {/* Logout Icon */}
          <JiraButton onClick={handleLogout} title="Logout">
            <LogOut className="h-3.5 w-3.5" />
          </JiraButton>
        </div>
      </div>
    </header>
  );
}
