"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DollarSign
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
    id: 'general',
    label: 'General',
    icon: Home,
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'apps', label: 'Apps', icon: Package },
      { id: 'chats', label: 'Chats', icon: MessageSquare, badge: '3' },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'security', label: 'Secured by Clerk', icon: Shield, children: [
        { id: 'auth', label: 'Authentication', icon: Shield },
        { id: 'permissions', label: 'Permissions', icon: Shield },
        { id: 'sessions', label: 'Sessions', icon: Shield }
      ]}
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: PieChart,
    children: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'insights', label: 'Insights', icon: TrendingUp },
      { id: 'metrics', label: 'Metrics', icon: Activity }
    ]
  },
  {
    id: 'business',
    label: 'Business',
    icon: DollarSign,
    children: [
      { id: 'sales', label: 'Sales', icon: ShoppingCart },
      { id: 'orders', label: 'Orders', icon: Package },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Database }
    ]
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FileText,
    children: [
      { id: 'auth-pages', label: 'Auth', icon: Shield, children: [
        { id: 'login', label: 'Login', icon: Shield },
        { id: 'register', label: 'Register', icon: Shield },
        { id: 'forgot-password', label: 'Forgot Password', icon: Shield }
      ]},
      { id: 'error-pages', label: 'Errors', icon: Bug, children: [
        { id: '404', label: '404 Page', icon: Bug },
        { id: '500', label: '500 Page', icon: Bug },
        { id: 'maintenance', label: 'Maintenance', icon: Bug }
      ]}
    ]
  },
  {
    id: 'other',
    label: 'Other',
    icon: Settings,
    children: [
      { id: 'settings', label: 'Settings', icon: Settings, children: [
        { id: 'general-settings', label: 'General', icon: Settings },
        { id: 'appearance', label: 'Appearance', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield }
      ]},
      { id: 'help', label: 'Help Center', icon: HelpCircle, children: [
        { id: 'documentation', label: 'Documentation', icon: FileText },
        { id: 'support', label: 'Support', icon: HelpCircle },
        { id: 'faq', label: 'FAQ', icon: HelpCircle }
      ]}
    ]
  }
];

export default function LeftSidebar({ isOpen, onClose, activeItem, onItemClick }: LeftSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['general']);

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
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start text-left h-8 px-3 ${
            level > 0 ? `ml-${level * 4}` : ''
          } ${isActive ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
        >
          <item.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
          <span className="flex-1 text-sm">{item.label}</span>
          {item.badge && (
            <Badge className="ml-auto bg-gray-900 text-white text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="ml-2 h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="ml-2 h-3 w-3 text-gray-500" />
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
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] z-40 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">ERP Admin</h2>
                <p className="text-xs text-gray-500">Next.js + ShadcnUI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {item.label}
                </h3>
                {renderMenuItem(item)}
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>ERP Admin v1.0.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
