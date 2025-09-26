"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  X,
  CheckSquare,
  Package,
  MessageSquare,
  Shield,
  ChevronDown,
  Bug,
  Settings,
  HelpCircle
} from "lucide-react";

// Import components
import PageContent from "@/components/PageContent";
import AdminLayout from "@/components/Layout";

// Dummy data
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    description: "from last month"
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    description: "from last month"
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    icon: ShoppingCart,
    description: "from last month"
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201",
    trend: "up",
    icon: Activity,
    description: "since last hour"
  }
];

const recentSales = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    avatar: "OM"
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    avatar: "JL"
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    avatar: "IN"
  },
  {
    id: 4,
    name: "William Kim",
    email: "william.kim@email.com",
    amount: "+$1,200.00",
    avatar: "WK"
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$99.00",
    avatar: "SD"
  }
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Premium Plan",
    amount: "$299.00",
    status: "completed",
    date: "2024-01-15"
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Basic Plan",
    amount: "$99.00",
    status: "pending",
    date: "2024-01-14"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Enterprise Plan",
    amount: "$599.00",
    status: "processing",
    date: "2024-01-13"
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "Pro Plan",
    amount: "$199.00",
    status: "completed",
    date: "2024-01-12"
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    product: "Basic Plan",
    amount: "$99.00",
    status: "cancelled",
    date: "2024-01-11"
  }
];

const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2 hours ago",
    avatar: "JD"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    lastLogin: "1 day ago",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Moderator",
    status: "inactive",
    lastLogin: "3 days ago",
    avatar: "MJ"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "User",
    status: "active",
    lastLogin: "5 hours ago",
    avatar: "SW"
  }
];

// Search data
const searchData = [
  ...recentSales.map(sale => ({ ...sale, type: 'sale', category: 'Sales' })),
  ...recentOrders.map(order => ({ ...order, type: 'order', category: 'Orders' })),
  ...recentUsers.map(user => ({ ...user, type: 'user', category: 'Users' })),
  { id: 'dashboard', name: 'Dashboard', type: 'page', category: 'Pages', description: 'Main dashboard overview' },
  { id: 'customers', name: 'Customers', type: 'page', category: 'Pages', description: 'Customer management' },
  { id: 'products', name: 'Products', type: 'page', category: 'Pages', description: 'Product catalog' },
  { id: 'settings', name: 'Settings', type: 'page', category: 'Pages', description: 'Application settings' },
  { id: 'analytics', name: 'Analytics', type: 'page', category: 'Pages', description: 'Data analytics and reports' },
  { id: 'reports', name: 'Reports', type: 'page', category: 'Pages', description: 'Generate reports' },
  { id: 'notifications', name: 'Notifications', type: 'page', category: 'Pages', description: 'System notifications' }
];

export default function Dashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const handleItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <AdminLayout activeItem={activeMenuItem} onItemClick={handleItemClick}>
        <PageContent activeItem={activeMenuItem} />
      </AdminLayout>
  );
}