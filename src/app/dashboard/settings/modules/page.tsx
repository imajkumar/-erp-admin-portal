"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Settings, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Calendar,
  Mail,
  Shield,
  Database,
  Globe,
  CreditCard,
  Package,
  Truck,
  Building,
  Activity,
  Filter,
  MoreHorizontal,
  UserCheck,
  Key,
  ArrowLeft,
  Home,
  Lock,
  Edit,
  Trash2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Module {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  category: string;
  version: string;
  lastUpdated: string;
  icon: React.ComponentType<any>;
}

const modules: Module[] = [
  {
    id: '1',
    name: 'User Management',
    description: 'Manage user accounts, roles, and permissions',
    status: 'active',
    category: 'Administration',
    version: '2.1.0',
    lastUpdated: '2024-01-15',
    icon: Users
  },
  {
    id: '15',
    name: 'Role & Permissions',
    description: 'Manage user roles and access control',
    status: 'active',
    category: 'Administration',
    version: '2.2.1',
    lastUpdated: '2024-01-26',
    icon: UserCheck
  },
  {
    id: '2',
    name: 'Sales Management',
    description: 'Track sales, orders, and customer interactions',
    status: 'active',
    category: 'Sales',
    version: '3.0.2',
    lastUpdated: '2024-01-20',
    icon: ShoppingCart
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Business intelligence and reporting tools',
    status: 'active',
    category: 'Analytics',
    version: '1.8.5',
    lastUpdated: '2024-01-18',
    icon: BarChart3
  },
  {
    id: '4',
    name: 'Document Management',
    description: 'Store and organize business documents',
    status: 'active',
    category: 'Documentation',
    version: '2.3.1',
    lastUpdated: '2024-01-12',
    icon: FileText
  },
  {
    id: '5',
    name: 'Calendar & Scheduling',
    description: 'Manage appointments and events',
    status: 'inactive',
    category: 'Productivity',
    version: '1.5.0',
    lastUpdated: '2024-01-10',
    icon: Calendar
  },
  {
    id: '6',
    name: 'Email System',
    description: 'Internal and external email management',
    status: 'active',
    category: 'Communication',
    version: '2.0.8',
    lastUpdated: '2024-01-22',
    icon: Mail
  },
  {
    id: '7',
    name: 'Security Center',
    description: 'Security monitoring and threat detection',
    status: 'active',
    category: 'Security',
    version: '1.9.3',
    lastUpdated: '2024-01-25',
    icon: Shield
  },
  {
    id: '8',
    name: 'Database Manager',
    description: 'Database administration and maintenance',
    status: 'maintenance',
    category: 'System',
    version: '3.2.1',
    lastUpdated: '2024-01-28',
    icon: Database
  },
  {
    id: '9',
    name: 'Website CMS',
    description: 'Content management for company website',
    status: 'active',
    category: 'Web',
    version: '2.4.0',
    lastUpdated: '2024-01-16',
    icon: Globe
  },
  {
    id: '10',
    name: 'Payment Gateway',
    description: 'Process online payments and transactions',
    status: 'active',
    category: 'Finance',
    version: '1.7.2',
    lastUpdated: '2024-01-19',
    icon: CreditCard
  },
  {
    id: '11',
    name: 'Inventory Management',
    description: 'Track stock levels and product information',
    status: 'active',
    category: 'Inventory',
    version: '2.5.3',
    lastUpdated: '2024-01-21',
    icon: Package
  },
  {
    id: '12',
    name: 'Shipping & Logistics',
    description: 'Manage shipping and delivery operations',
    status: 'inactive',
    category: 'Logistics',
    version: '1.6.1',
    lastUpdated: '2024-01-14',
    icon: Truck
  },
  {
    id: '13',
    name: 'Company Directory',
    description: 'Employee and department information',
    status: 'active',
    category: 'HR',
    version: '1.4.7',
    lastUpdated: '2024-01-17',
    icon: Building
  },
  {
    id: '14',
    name: 'Activity Monitor',
    description: 'System activity and performance monitoring',
    status: 'active',
    category: 'Monitoring',
    version: '2.1.4',
    lastUpdated: '2024-01-23',
    icon: Activity
  }
];

const categories = ['All', 'Administration', 'Sales', 'Analytics', 'Documentation', 'Productivity', 'Communication', 'Security', 'System', 'Web', 'Finance', 'Inventory', 'Logistics', 'HR', 'Monitoring'];

export default function ModulesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredModules, setFilteredModules] = useState(modules);
  const [addModuleDrawerOpen, setAddModuleDrawerOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active' as 'active' | 'inactive' | 'maintenance',
    version: '1.0.0'
  });

  const handlePermissionsClick = (moduleId: string) => {
    router.push(`/dashboard/settings/modules/${moduleId}/permissions`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterModules(term, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterModules(searchTerm, category);
  };

  const filterModules = (search: string, category: string) => {
    let filtered = modules;

    if (search) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(module => module.category === category);
    }

    setFilteredModules(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddModule = () => {
    if (!newModule.name || !newModule.description || !newModule.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const module: Module = {
      id: (modules.length + 1).toString(),
      name: newModule.name,
      description: newModule.description,
      status: newModule.status,
      category: newModule.category,
      version: newModule.version,
      lastUpdated: new Date().toISOString().split('T')[0],
      icon: Settings // Default icon, can be made selectable later
    };

    modules.push(module);
    setFilteredModules([...modules]);
    
    // Reset form
    setNewModule({
      name: '',
      description: '',
      category: '',
      status: 'active',
      version: '1.0.0'
    });
    
    setAddModuleDrawerOpen(false);
    
    toast({
      title: "Module Added",
      description: `Module "${newModule.name}" has been successfully added`,
      variant: "default",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewModule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-2">Manage and configure system modules</p>
        </div>
        <Drawer open={addModuleDrawerOpen} onOpenChange={setAddModuleDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Add New Module</DrawerTitle>
                <DrawerDescription>
                  Create a new module for your system
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Module Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter module name"
                    value={newModule.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter module description"
                    value={newModule.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newModule.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newModule.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={newModule.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                  />
                </div>
              </div>
              <DrawerFooter>
                <Button onClick={handleAddModule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
                <Button variant="outline" onClick={() => setAddModuleDrawerOpen(false)}>
                  Cancel
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredModules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <Card 
              key={module.id} 
              className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {module.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500 truncate">{module.category}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        className="text-xs flex items-center space-x-2"
                        onClick={() => handlePermissionsClick(module.id)}
                      >
                        <Lock className="h-3 w-3" />
                        <span>Permissions</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs flex items-center space-x-2">
                        <Edit className="h-3 w-3" />
                        <span>Configure</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Update</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Disable</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-red-600 flex items-center space-x-2">
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {module.description}
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <Badge 
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-300 ${getStatusColor(module.status)}`}
                    >
                      {module.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Version</span>
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      {module.version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Updated</span>
                    <span className="text-xs font-medium text-gray-600">
                      {module.lastUpdated}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {modules.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">
                  {modules.filter(m => m.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {modules.filter(m => m.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {modules.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
