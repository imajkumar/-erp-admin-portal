"use client";

import {
  AlertTriangle,
  Bell,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Settings,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
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
  const [currentSession, setCurrentSession] = useState("2025-2026");
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");

  const sessions = [
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2026-2027", label: "2026-2027" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleSessionSelect = (session: string) => {
    if (session !== currentSession) {
      setSelectedSession(session);
      setShowSessionDialog(true);
    }
  };

  const confirmSessionChange = () => {
    setCurrentSession(selectedSession);
    setShowSessionDialog(false);
    setSelectedSession("");
    // Here you can add logic to reload data for the new session
    console.log(`Session changed to: ${selectedSession}`);
  };

  const cancelSessionChange = () => {
    setShowSessionDialog(false);
    setSelectedSession("");
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-semibold">
                Create New
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer">
                <UserPlus className="h-3 w-3 mr-2" />
                New User
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <Mail className="h-3 w-3 mr-2" />
                New Email
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <MessageSquare className="h-3 w-3 mr-2" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <Calendar className="h-3 w-3 mr-2" />
                New Event
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <Settings className="h-3 w-3 mr-2" />
                New Module
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

          {/* Session Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <JiraButton variant="text">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {currentSession}
                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
              </JiraButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuLabel className="text-xs">
                Select Session
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sessions.map((session) => (
                <DropdownMenuItem
                  key={session.value}
                  onClick={() => handleSessionSelect(session.value)}
                  className="text-xs"
                >
                  {session.value === currentSession && (
                    <Check className="h-3 w-3 mr-2 text-green-600" />
                  )}
                  {session.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          {/* Logout Icon */}
          <JiraButton onClick={handleLogout} title="Logout">
            <LogOut className="h-3.5 w-3.5" />
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

      {/* Session Change Confirmation Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Change Session</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to change the session from{" "}
              <strong>{currentSession}</strong> to{" "}
              <strong>{selectedSession}</strong>?
              <br />
              <br />
              This will reload all data for the new session and may affect your
              current work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={cancelSessionChange}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSessionChange}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
