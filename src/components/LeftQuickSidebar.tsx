"use client";

import { Menu, X } from "lucide-react";
import {
  MdAttachMoney,
  MdDashboard,
  MdDescription,
  MdEvent,
  MdHome,
  MdInventory,
  MdLocalActivity,
  MdNotifications,
  MdPeople,
  MdSettings,
  MdShoppingCart,
  MdTrendingUp,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeftQuickSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const getQuickItems = (t: (key: string) => string) => [
  { id: "dashboard", icon: MdDashboard, label: t("common.dashboard") },
  { id: "users", icon: MdPeople, label: t("common.users") },
  { id: "sales", icon: MdShoppingCart, label: t("common.sales") },
  { id: "revenue", icon: MdAttachMoney, label: t("common.revenue") },
  { id: "activity", icon: MdLocalActivity, label: t("common.activity") },
  { id: "settings", icon: MdSettings, label: t("common.settings") },
  {
    id: "notifications",
    icon: MdNotifications,
    label: t("common.notifications"),
  },
  { id: "home", icon: MdHome, label: t("common.home") },
  { id: "reports", icon: MdDescription, label: t("common.reports") },
  { id: "calendar", icon: MdEvent, label: t("common.calendar") },
  { id: "products", icon: MdInventory, label: t("common.products") },
  { id: "analytics", icon: MdTrendingUp, label: t("common.analytics") },
];

export default function LeftQuickSidebar({
  isOpen,
  onToggle,
  activeItem,
  onItemClick,
  sidebarOpen,
  onSidebarToggle,
}: LeftQuickSidebarProps) {
  const { t } = useLanguage();
  const quickItems = getQuickItems(t);

  return (
    <TooltipProvider>
      {/* Left Quick Sidebar - Always Visible and Sticky */}
      <div
        className="fixed left-0 h-[calc(100vh-45px-32px)] z-40 bg-gray-50 border-r border-emerald-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12"
        style={{ top: "45px" }}
      >
        {/* Professional Sidebar Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className={`mb-4 w-8 h-8 p-0 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                sidebarOpen
                  ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25"
                  : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25"
              }`}
              title={
                sidebarOpen
                  ? t("sidebar.close_sidebar")
                  : t("sidebar.open_sidebar")
              }
            >
              {sidebarOpen ? (
                <X className="h-4 w-4 text-white animate-in fade-in-0 zoom-in-95 duration-200" />
              ) : (
                <Menu className="h-4 w-4 text-white animate-in fade-in-0 zoom-in-95 duration-200" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <p>
              {sidebarOpen
                ? t("sidebar.close_sidebar")
                : t("sidebar.open_sidebar")}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="w-6 h-px bg-gray-300 mb-2"></div>

        {quickItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            {/* Active Indicator Line */}
            {activeItem === item.id && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onItemClick(item.id)}
                  className={`w-8 h-8 p-0 hover:bg-gray-200 relative ${
                    activeItem === item.id ? "ml-1" : ""
                  }`}
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
