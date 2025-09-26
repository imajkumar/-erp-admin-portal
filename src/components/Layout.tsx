"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import LeftQuickSidebar from "./LeftQuickSidebar";
import RightQuickSidebar from "./RightQuickSidebar";
import Footer from "./Footer";
import SearchModal from "./Search";
import LockScreen from "./LockScreen";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";

interface LayoutProps {
  children: React.ReactNode;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export default function AdminLayout({ children, activeItem = "dashboard", onItemClick }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leftQuickSidebar, setLeftQuickSidebar] = useState(true);
  const [rightQuickSidebar, setRightQuickSidebar] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Inactivity timer for lock screen
  useInactivityTimer(() => {
    setIsLocked(true);
  }, 60000); // 1 minute

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleItemClick = (item: string) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        user={user}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onSearchClick={() => setSearchOpen(true)}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
        onLockScreen={() => setIsLocked(true)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex pt-16">
        {/* Left Quick Sidebar */}
        <LeftQuickSidebar
          isOpen={leftQuickSidebar}
          onToggle={() => setLeftQuickSidebar(!leftQuickSidebar)}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />

        {/* Left Sidebar */}
        <LeftSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />

        {/* Main Content */}
        <div 
          className={`flex-1 transition-all duration-200 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-12'
          } ${leftQuickSidebar ? 'ml-12' : 'ml-0'} ${
            rightQuickSidebar ? 'mr-12' : 'mr-0'
          }`}
        >
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Right Quick Sidebar */}
        <RightQuickSidebar
          isOpen={rightQuickSidebar}
          onToggle={() => setRightQuickSidebar(!rightQuickSidebar)}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery=""
        onSearchChange={() => {}}
      />

    </div>
  );
}
