"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  BarChart3,
  CreditCard,
  UserPlus,
  Calendar,
  FileText,
  HelpCircle,
  Shield,
  Bug,
  CheckSquare,
  Package,
  MessageSquare
} from "lucide-react";

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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftQuickSidebar, setLeftQuickSidebar] = useState(true);
  const [rightQuickSidebar, setRightQuickSidebar] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-700">Overview</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Customers</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</a>
            </nav>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
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
      </header>

      <div className="flex">
        {/* Left Quick Sidebar */}
        <div className={`${leftQuickSidebar ? 'w-16' : 'w-0'} transition-all duration-300 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-2`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftQuickSidebar(!leftQuickSidebar)}
            className="mb-4"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Users className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <DollarSign className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Activity className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Main Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
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
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {/* General Section */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">General</h3>
                <Button variant="default" className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CheckSquare className="mr-3 h-4 w-4" />
                  Tasks
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-3 h-4 w-4" />
                  Apps
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Chats
                  <Badge className="ml-auto bg-gray-900 text-white text-xs">3</Badge>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-3 h-4 w-4" />
                  Users
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-3 h-4 w-4" />
                  Secured by Clerk
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Pages Section */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pages</h3>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-3 h-4 w-4" />
                  Auth
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bug className="mr-3 h-4 w-4" />
                  Errors
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Other Section */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Other</h3>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-3 h-4 w-4" />
                  Help Center
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Download Button */}
          <div className="mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-gray-600">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="ml-1">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center space-x-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {sale.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {sale.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {sale.email}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {sale.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your customers</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Order
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Right Quick Sidebar */}
        <div className={`${rightQuickSidebar ? 'w-16' : 'w-0'} transition-all duration-300 bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4 space-y-2`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightQuickSidebar(!rightQuickSidebar)}
            className="mb-4"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <FileText className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Calendar className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <CheckSquare className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Package className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <CreditCard className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <TrendingUp className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}