"use client";

import {
  Battery,
  BatteryLow,
  Calendar,
  Check,
  Clock,
  Settings,
  Timer,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

export default function Footer() {
  const [time, setTime] = useState<Date | null>(null);
  const [batteryLevel, _setBatteryLevel] = useState(85);
  const [isWifiConnected, _setIsWifiConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [loginTime, setLoginTime] = useState<Date | null>(null);
  const [clockDrawerOpen, setClockDrawerOpen] = useState(false);
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState("2025-2026");
  const [selectedSession, setSelectedSession] = useState("");
  const [usersDrawerOpen, setUsersDrawerOpen] = useState(false);
  const [loggedInUsers, setLoggedInUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      initials: "JD",
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      role: "Admin",
      department: "IT",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      initials: "JS",
      loginTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      role: "Manager",
      department: "Sales",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      initials: "MJ",
      loginTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      role: "Developer",
      department: "Engineering",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      initials: "SW",
      loginTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      role: "Analyst",
      department: "Finance",
    },
    {
      id: "5",
      name: "Alex Chen",
      email: "alex.chen@company.com",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      initials: "AC",
      loginTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      role: "Designer",
      department: "UX",
    },
  ]);

  const sessions = [
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2026-2027", label: "2026-2027" },
  ];

  useEffect(() => {
    setTime(new Date());
    const storedLoginTime = localStorage.getItem("loginTime");
    if (storedLoginTime) {
      setLoginTime(new Date(storedLoginTime));
    } else {
      const now = new Date();
      setLoginTime(now);
      localStorage.setItem("loginTime", now.toISOString());
    }

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--:-- AM";
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "--, --- --, ----";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLoggedInTime = () => {
    if (!loginTime) return "00:00:00";
    const now = new Date();
    const diff = now.getTime() - loginTime.getTime();
    if (diff < 0) return "00:00:00";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatLoginTime = (loginTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - loginTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75)
      return <Battery className="h-3 w-3 text-green-500" />;
    if (batteryLevel > 25)
      return <Battery className="h-3 w-3 text-yellow-500" />;
    return <BatteryLow className="h-3 w-3 text-red-500" />;
  };

  const toggleClockDrawer = () => {
    setClockDrawerOpen(!clockDrawerOpen);
  };

  const toggleCalendarDrawer = () => {
    setCalendarDrawerOpen(!calendarDrawerOpen);
  };

  const toggleSessionDrawer = () => {
    setSessionDrawerOpen(!sessionDrawerOpen);
  };

  const toggleUsersDrawer = () => {
    setUsersDrawerOpen(!usersDrawerOpen);
  };

  const handleSessionSelect = (session: string) => {
    if (session !== currentSession) {
      setSelectedSession(session);
    }
  };

  const confirmSessionChange = () => {
    setCurrentSession(selectedSession);
    setSessionDrawerOpen(false);
    setSelectedSession("");
    console.log(`Session changed to: ${selectedSession}`);
  };

  return (
    <>
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 bg-gray-50 text-gray-600 shadow-lg"
        style={{ height: "40px" }}
      >
        {/* Ribbon-like top border */}
        <div className="h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Left Side - Quick Actions and Copyright */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Logo className="h-5 w-auto" alt="Coca-Cola" />

              {/* Separator */}
              <div className="w-px h-4 bg-gray-300"></div>

              <div className="text-xs text-gray-500 relative group">
                <span className="font-bold">nitiERP</span>© 2025{" "}
                <span className="text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                  v1.0.0
                </span>
                {/* Hover tooltip with animation */}
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none">
                  Empowering Business Governance
                  <div className="absolute top-full left-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              {/* Start Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 p-1.5 h-6"
                title="Start Menu - Open main menu"
              >
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">W</span>
                </div>
              </Button>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 p-1.5 h-6"
                title="Search - Quick search functionality"
              >
                <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
              </Button>
            </div>

            {/* Right Side - Users, Digital Clock and System Status */}
            <div className="flex items-center space-x-4">
              {/* Logged-in Users */}
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  {loggedInUsers.slice(0, 3).map((user, index) => (
                    <div
                      key={user.id}
                      className="w-6 h-6 border-3 border-white rounded-full overflow-hidden shadow-lg ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 hover:scale-110"
                      title={`${user.name} - ${user.email}`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">${user.initials}</div>`;
                          }
                        }}
                      />
                    </div>
                  ))}
                  {loggedInUsers.length > 3 && (
                    <button
                      onClick={toggleUsersDrawer}
                      className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 border-3 border-white rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-gray-200 hover:ring-gray-300 transition-all duration-200 hover:scale-110 relative group cursor-pointer"
                      title={
                        usersDrawerOpen
                          ? "Close users drawer"
                          : "Open users drawer"
                      }
                    >
                      +{loggedInUsers.length - 3}
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg">
                        {usersDrawerOpen
                          ? "Close users drawer"
                          : "Open users drawer"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div className="w-px h-3 bg-gray-300"></div>

              {/* Digital Clock, Date, and Logged-in Time with Icons */}
              <div className="flex items-center space-x-4">
                {/* Clock with Time - Clickable */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleClockDrawer}
                    className="flex items-center space-x-1 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors relative group"
                    title={
                      clockDrawerOpen
                        ? "Close clock drawer"
                        : "Open clock drawer"
                    }
                  >
                    <Clock
                      className={`h-3 w-3 ${clockDrawerOpen ? "text-blue-600" : "text-gray-600"}`}
                    />
                    <div className="text-sm font-mono font-medium text-gray-800">
                      {formatTime(time)}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {clockDrawerOpen
                        ? "Close clock drawer"
                        : "Open clock drawer"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>

                <div className="w-px h-3 bg-gray-300"></div>

                {/* Calendar with Date - Clickable */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleCalendarDrawer}
                    className="flex items-center space-x-1 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors relative group"
                    title={
                      calendarDrawerOpen
                        ? "Close calendar drawer"
                        : "Open calendar drawer"
                    }
                  >
                    <Calendar
                      className={`h-3 w-3 ${calendarDrawerOpen ? "text-blue-600" : "text-gray-600"}`}
                    />
                    <div className="text-xs text-gray-500">
                      {formatDate(time)}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {calendarDrawerOpen
                        ? "Close calendar drawer"
                        : "Open calendar drawer"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>

                <div className="w-px h-3 bg-gray-300"></div>

                {/* Session Selector - Clickable */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleSessionDrawer}
                    className="flex items-center space-x-1 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors relative group"
                    title={
                      sessionDrawerOpen
                        ? "Close session drawer"
                        : "Open session drawer"
                    }
                  >
                    <Calendar
                      className={`h-3 w-3 ${sessionDrawerOpen ? "text-blue-600" : "text-gray-600"}`}
                    />
                    <div className="text-xs text-gray-500">
                      {currentSession}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {sessionDrawerOpen
                        ? "Close session drawer"
                        : "Open session drawer"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>

                <div className="w-px h-3 bg-gray-300"></div>

                {/* Timer with Logged-in Time - Always visible */}
                <div className="flex items-center space-x-1">
                  <Timer className="h-3 w-3 text-gray-600" />
                  <div className="text-xs text-gray-500">
                    {getLoggedInTime()}
                  </div>
                </div>
              </div>

              {/* System Status Icons */}
              <div className="flex items-center space-x-1">
                {/* WiFi */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 p-1 h-6"
                  title={
                    isWifiConnected
                      ? "WiFi Connected - Network is available"
                      : "WiFi Disconnected - No network connection"
                  }
                >
                  {isWifiConnected ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                </Button>

                {/* Volume */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-600 hover:bg-gray-100 p-1 h-6"
                  title={
                    isMuted
                      ? "Unmute - Click to enable sound"
                      : "Mute - Click to disable sound"
                  }
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3 text-red-500" />
                  ) : (
                    <Volume2 className="h-3 w-3 text-green-500" />
                  )}
                </Button>

                {/* Battery */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 p-1 h-6"
                  title={`Battery Level - ${batteryLevel}% remaining`}
                >
                  {getBatteryIcon()}
                </Button>

                {/* Settings */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 p-1 h-6"
                  title="Settings - Open system settings"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Clock Drawer */}
      {clockDrawerOpen && (
        <div className="fixed bottom-10 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="hover:scale-110 hover:rotate-5 transition-transform duration-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Digital Clock
                </h3>
              </div>
              <button
                onClick={toggleClockDrawer}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors hover:scale-110 active:scale-95"
                title="Close clock drawer"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-gray-800 mb-2 animate-pulse">
                {formatTime(time)}
              </div>
              <div className="text-lg text-gray-500">{formatDate(time)}</div>
              <div className="mt-4 text-sm text-gray-400">
                Last updated: {time?.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Drawer */}
      {calendarDrawerOpen && (
        <div className="fixed bottom-10 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="hover:scale-110 hover:rotate-5 transition-transform duration-200">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Calendar
                </h3>
              </div>
              <button
                onClick={toggleCalendarDrawer}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors hover:scale-110 active:scale-95"
                title="Close calendar drawer"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {time?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-lg text-gray-500 mb-4">
                {time?.toLocaleTimeString("en-US", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-400">
                Current time zone:{" "}
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Drawer */}
      {sessionDrawerOpen && (
        <div className="fixed bottom-10 left-0 right-0 z-50 bg-gradient-to-b from-gray-50 to-white border-t border-gray-300 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-md hover:scale-105 transition-transform duration-200">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  Session Management
                </h3>
              </div>
              <button
                onClick={toggleSessionDrawer}
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors group hover:scale-110 active:scale-95"
                title="Close drawer"
              >
                <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:scale-102 transition-transform duration-200">
              <div className="text-sm text-gray-600 mb-1">Current Session</div>
              <div className="text-lg font-semibold text-gray-800">
                {currentSession}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Available Sessions
              </div>
              {sessions.map((session, index) => (
                <button
                  key={session.value}
                  onClick={() => handleSessionSelect(session.value)}
                  className={`w-full p-3 text-left rounded-lg border transition-all duration-200 hover:scale-102 hover:-translate-y-0.5 ${
                    selectedSession === session.value
                      ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.label}</span>
                    {selectedSession === session.value && (
                      <div className="p-1 bg-blue-100 rounded-full">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedSession && selectedSession !== currentSession && (
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={toggleSessionDrawer}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:scale-102"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSessionChange}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-102"
                >
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Drawer */}
      {usersDrawerOpen && (
        <div className="fixed bottom-10 left-0 right-0 z-50 bg-gradient-to-b from-gray-50 to-white border-t border-gray-300 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-md hover:scale-105 transition-transform duration-200">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  Active Users
                </h3>
                <span className="text-sm text-gray-500">
                  ({loggedInUsers.length} online)
                </span>
              </div>
              <button
                onClick={toggleUsersDrawer}
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors group hover:scale-110 active:scale-95"
                title="Close drawer"
              >
                <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-2">
              {loggedInUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer group hover:scale-102 hover:-translate-y-0.5"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 border-2 border-blue-200 rounded-full overflow-hidden shadow-sm group-hover:border-blue-300 transition-colors">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">${user.initials}</div>`;
                        }
                      }}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatLoginTime(user.loginTime)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                        {user.department}
                      </span>
                    </div>
                  </div>

                  {/* Online Indicator */}
                  <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              ))}
            </div>

            {/* Organization Tree Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-102">
                View Organization Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
