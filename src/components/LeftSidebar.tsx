"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BarChart3,
  CheckSquare,
  Package,
  MessageSquare,
  Users,
  Shield,
  Bug,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  X,
  Home,
  FileText,
  CreditCard,
  Calendar,
  Bell,
  Database,
  PieChart,
  TrendingUp,
  Activity,
  ShoppingCart,
  DollarSign,
  Plus,
  Grid3X3,
  User,
  Building2,
  FolderOpen,
  Layers,
  Zap,
  ChevronLeft
} from "lucide-react";

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'erp-settings', label: 'ERP Settings', icon: Settings }
    ]
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FileText,
    children: [
          { id: 'user-profile', label: 'User Profile', icon: User, children: [
            { id: 'profile', label: 'Overview', icon: User },
            { id: 'user-projects', label: 'Projects', icon: FolderOpen },
            { id: 'user-campaigns', label: 'Campaigns', icon: TrendingUp },
            { id: 'user-documents', label: 'Documents', icon: FileText },
            { id: 'user-followers', label: 'Followers', icon: Users },
            { id: 'user-activity', label: 'Activity', icon: Activity }
          ]},
      { id: 'account', label: 'Account', icon: Building2, children: [
        { id: 'account-overview', label: 'Overview', icon: User },
        { id: 'account-settings', label: 'Settings', icon: Settings },
        { id: 'account-security', label: 'Security', icon: Shield },
        { id: 'account-billing', label: 'Billing', icon: CreditCard },
        { id: 'account-referrals', label: 'Referrals', icon: Users },
        { id: 'account-logs', label: 'Logs', icon: FileText },
        { id: 'account-api-keys', label: 'API Keys', icon: Shield },
        { id: 'account-statements', label: 'Statements', icon: FileText }
      ]},
      { id: 'authentication', label: 'Authentication', icon: Shield, children: [
        { id: 'sign-in', label: 'Sign In', icon: Shield },
        { id: 'sign-up', label: 'Sign Up', icon: Shield },
        { id: 'two-factor', label: 'Two Factor', icon: Shield },
        { id: 'reset-password', label: 'Reset Password', icon: Shield },
        { id: 'new-password', label: 'New Password', icon: Shield }
      ]},
      { id: 'corporate', label: 'Corporate', icon: Building2, children: [
        { id: 'about-us', label: 'About Us', icon: Building2 },
        { id: 'contact-us', label: 'Contact Us', icon: MessageSquare },
        { id: 'our-team', label: 'Our Team', icon: Users },
        { id: 'license', label: 'License', icon: FileText },
        { id: 'sitemap', label: 'Sitemap', icon: Layers }
      ]},
      { id: 'social', label: 'Social', icon: Users, children: [
        { id: 'feeds', label: 'Feeds', icon: Activity },
        { id: 'activity', label: 'Activity', icon: Activity },
        { id: 'followers', label: 'Followers', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]},
      { id: 'others', label: 'Others', icon: FileText, children: [
        { id: 'faq-classic', label: 'FAQ Classic', icon: HelpCircle },
        { id: 'faq-extended', label: 'FAQ Extended', icon: HelpCircle },
        { id: 'blog-home', label: 'Blog Home', icon: FileText },
        { id: 'blog-post', label: 'Blog Post', icon: FileText }
      ]}
    ]
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: Package,
    children: [
      { id: 'projects', label: 'Projects', icon: FolderOpen },
      { id: 'ecommerce', label: 'eCommerce', icon: ShoppingCart },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
      { id: 'user-management', label: 'User Management', icon: Users },
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'support-center', label: 'Support Center', icon: HelpCircle },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'file-manager', label: 'File Manager', icon: FolderOpen },
      { id: 'inbox', label: 'Inbox', icon: MessageSquare },
      { id: 'contacts', label: 'Contacts', icon: Users }
    ]
  }
];

export default function LeftSidebar({ isOpen, onClose, activeItem, onItemClick }: LeftSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboards']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start text-left h-9 px-3 ${
            isActive 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          style={{ marginLeft: level > 0 ? `${level * 16}px` : '0' }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
        >
          <item.icon className={`mr-3 h-4 w-4 ${
            isActive ? 'text-white' : 'text-gray-400'
          }`} />
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          {item.badge && (
            <Badge className="ml-auto bg-blue-500 text-white text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="ml-2 h-3 w-3 text-gray-400" />
            ) : (
              <ChevronRight className="ml-2 h-3 w-3 text-gray-400" />
            )
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider>
        <aside className="fixed left-12 w-64 h-[calc(100vh-45px)] z-30 bg-gray-900 border-r border-gray-700" style={{ top: '45px' }}>
      <div className="flex flex-col h-full">

        {/* Dashboard Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center w-full h-10 px-3 text-gray-300">
            <Home className="mr-3 h-4 w-4 text-gray-400" />
            <span className="flex-1 text-sm font-medium">Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-6">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </h3>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-1">
                {renderMenuItem(item)}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <p>ERP Admin v1.0.0</p>
            <p className="mt-1">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </aside>
    </TooltipProvider>
  );
}
