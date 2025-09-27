"use client";

import { HelpCircle, Palette, Settings, Globe } from "lucide-react";
import {
  MdBarChart,
  MdCheckBox,
  MdDescription,
  MdEvent,
  MdInventory,
  MdMessage,
  MdNotifications,
  MdPayment,
  MdPersonAdd,
  MdSettings,
  MdStorage,
  MdTrendingUp,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setTheme,
  setLanguage as setReduxLanguage,
} from "@/store/slices/settingsSlice";
import { useReduxWithLanguage } from "@/hooks/useReduxWithLanguage";

type Theme = "default" | "blue" | "green" | "purple";

interface RightQuickSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

const getThemes = (t: (key: string) => string) => [
  {
    id: "default",
    name: t("theme.default"),
    color: "bg-gray-500",
    primary: "bg-gray-600",
    accent: "border-gray-500",
  },
  {
    id: "blue",
    name: t("theme.blue"),
    color: "bg-blue-500",
    primary: "bg-blue-600",
    accent: "border-blue-500",
  },
  {
    id: "green",
    name: t("theme.green"),
    color: "bg-green-500",
    primary: "bg-green-600",
    accent: "border-green-500",
  },
  {
    id: "purple",
    name: t("theme.purple"),
    color: "bg-purple-500",
    primary: "bg-purple-600",
    accent: "border-purple-500",
  },
];

const getQuickItems = (t: (key: string) => string) => [
  { id: "documents", icon: MdDescription, label: t("common.documents") },
  { id: "calendar", icon: MdEvent, label: t("common.calendar") },
  { id: "messages", icon: MdMessage, label: t("common.messages") },
  { id: "tasks", icon: MdCheckBox, label: t("common.tasks") },
  { id: "products", icon: MdInventory, label: t("common.products") },
  { id: "payments", icon: MdPayment, label: t("common.payments") },
  { id: "analytics", icon: MdTrendingUp, label: t("common.analytics") },
  {
    id: "notifications",
    icon: MdNotifications,
    label: t("common.notifications"),
  },
  { id: "settings", icon: MdSettings, label: t("common.settings") },
  { id: "users", icon: MdPersonAdd, label: t("common.users") },
  { id: "dashboard", icon: MdBarChart, label: t("common.dashboard") },
  { id: "database", icon: MdStorage, label: t("common.database") },
];

export default function RightQuickSidebar({
  isOpen,
  onToggle,
  activeItem,
  onItemClick,
}: RightQuickSidebarProps) {
  const { t, language, setLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(
    (state) => state.settings.theme.theme,
  ) as Theme;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Sync Redux with language context
  useReduxWithLanguage();

  const themes = getThemes(t);
  const quickItems = getQuickItems(t);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && themes.some((theme) => theme.id === savedTheme)) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    const theme = themes.find((t) => t.id === currentTheme);
    if (theme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: Theme) => {
    dispatch(setTheme(themeId));
  };

  const currentThemeConfig =
    themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <TooltipProvider>
      {/* Right Quick Sidebar - Always Visible */}
      <div
        className="fixed right-0 h-[calc(100vh-45px-32px)] z-40 bg-gray-50 border-l border-purple-500 flex flex-col items-center py-4 space-y-2 overflow-y-auto w-12"
        style={{ top: "45px" }}
      >
        {/* Settings Panel */}
        <DropdownMenu open={settingsOpen} onOpenChange={setSettingsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-gray-200 mb-4"
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{t("sidebar.settings_panel")}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="left" className="w-80 p-0">
            <div className="p-6">
              {/* Page Style Setting */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t("settings.page_style")}
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t("settings.theme_color")}
                </h3>
                <div className="flex space-x-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id as Theme)}
                      className={`w-8 h-8 ${theme.color} rounded-lg cursor-pointer border-2 ${
                        currentTheme === theme.id
                          ? "border-gray-800"
                          : "border-gray-300"
                      } flex items-center justify-center hover:scale-110 transition-transform`}
                    >
                      {currentTheme === theme.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Mode */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t("settings.navigation_mode")}
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SideMenu Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t("settings.sidemenu_type")}
                </h3>
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Content Width */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.content_width")}
                  </span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>{t("settings.fluid")}</option>
                    <option>{t("settings.fixed")}</option>
                  </select>
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.fixed_header")}
                  </span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.fixed_sidebar")}
                  </span>
                  <div className="w-10 h-5 bg-blue-500 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.split_menus")}
                  </span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {t("settings.regional_settings")}
                </h3>
                <div className="space-y-2">
                  {[
                    t("settings.header"),
                    t("settings.footer"),
                    t("settings.menu"),
                    t("settings.menu_header"),
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <div className="w-10 h-5 bg-blue-500 rounded-full cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.weak_mode")}
                  </span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-xs text-yellow-800">
                    {t("settings.development_warning")}
                  </p>
                </div>
              </div>

              {/* Copy Setting Button */}
              <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">{t("settings.copy_setting")}</span>
                </div>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Switcher */}
        <DropdownMenu open={languageOpen} onOpenChange={setLanguageOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-10 p-0 hover:bg-gray-200 mb-2"
                >
                  <div className="w-6 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-gray-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{t("language.select_language")}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="left" className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">
                {t("language.select_language")}
              </div>
              <div className="space-y-1">
                {[
                  { id: "en", name: t("language.english"), flag: "🇺🇸" },
                  { id: "hi", name: t("language.hindi"), flag: "🇮🇳" },
                  { id: "ru", name: t("language.russian"), flag: "🇷🇺" },
                  { id: "pl", name: t("language.polish"), flag: "🇵🇱" },
                ].map((lang) => (
                  <DropdownMenuItem
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id as Language);
                      dispatch(setReduxLanguage(lang.id as Language));
                    }}
                    className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-50 rounded"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                    {language === lang.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <div className="w-6 h-px bg-gray-300 mb-2"></div>

        {quickItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            {/* Active Indicator Line */}
            {activeItem === item.id && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full" />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onItemClick(item.id)}
                  className={`w-8 h-8 p-0 hover:bg-gray-200 relative ${
                    activeItem === item.id ? "mr-1" : ""
                  }`}
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
