"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import Footer from "./Footer";
import Header from "./Header";
import LeftQuickSidebar from "./LeftQuickSidebar";
import LeftSidebar from "./LeftSidebar";
import LockScreen from "./LockScreen";
import NotificationDrawer from "./NotificationDrawer";
import QuickLeftSidebarDrawer from "./QuickLeftSidebarDrawer";
import RightQuickSidebar from "./RightQuickSidebar";
import ScrollToTop from "./ScrollToTop";
import SearchSuggestions from "./SearchSuggestions";

interface LayoutProps {
  children: React.ReactNode;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export default function AdminLayout({
  children,
  activeItem = "dashboard",
  onItemClick,
}: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [_leftQuickSidebar, _setLeftQuickSidebar] = useState(true);
  const [rightQuickSidebar, setRightQuickSidebar] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Inactivity timer for lock screen
  useInactivityTimer({
    onTimeout: () => setIsLocked(true),
    timeout: 60000, // 1 minute
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleItemClick = (item: string) => {
    // Handle navigation for specific items
    if (item === "erp-settings") {
      router.push("/dashboard/settings");
      return;
    }

    if (item === "users") {
      router.push("/dashboard/users");
      return;
    }

    if (item === "view-all-notifications") {
      router.push("/dashboard/view-all-notifications");
      return;
    }

    if (item === "inbox") {
      router.push("/dashboard/inbox");
      return;
    }

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
        onNotificationClick={() => setNotificationOpen(!notificationOpen)}
        onInboxClick={() => handleItemClick("inbox")}
        onLockScreen={() => setIsLocked(true)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Quick Sidebar - Always Visible */}
        <LeftQuickSidebar
          isOpen={true}
          onToggle={() => {}}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
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
            sidebarOpen ? "ml-77" : "ml-12"
          } ${rightQuickSidebar ? "mr-12" : "mr-0"}`}
          style={{ paddingTop: "45px" }}
        >
          {children}
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

      {/* Search Suggestions */}
      <SearchSuggestions
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Quick Left Sidebar Drawer */}
      <QuickLeftSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
