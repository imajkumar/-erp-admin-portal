"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search as SearchIcon,
  Filter,
  X,
  Clock,
  Star,
  Save,
  ChevronDown,
  DollarSign,
  ShoppingCart,
  Users,
  FileText,
  Calendar,
  Tag
} from "lucide-react";

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface SearchItem {
  id: string;
  name: string;
  type: 'sale' | 'order' | 'user' | 'page';
  category: string;
  email?: string;
  description?: string;
  customer?: string;
  amount?: string;
  date?: string;
}

const searchData: SearchItem[] = [
  // Sales
  { id: 'sale-1', name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', type: 'sale', category: 'Sales' },
  { id: 'sale-2', name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', type: 'sale', category: 'Sales' },
  { id: 'sale-3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', type: 'sale', category: 'Sales' },
  
  // Orders
  { id: 'order-1', name: 'ORD-001', customer: 'John Doe', product: 'Premium Plan', amount: '$299.00', status: 'completed', date: '2024-01-15', type: 'order', category: 'Orders' },
  { id: 'order-2', name: 'ORD-002', customer: 'Jane Smith', product: 'Basic Plan', amount: '$99.00', status: 'pending', date: '2024-01-14', type: 'order', category: 'Orders' },
  
  // Users
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago', type: 'user', category: 'Users' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', lastLogin: '1 day ago', type: 'user', category: 'Users' },
  
  // Pages
  { id: 'page-1', name: 'Dashboard', description: 'Main dashboard overview', type: 'page', category: 'Pages' },
  { id: 'page-2', name: 'Customers', description: 'Customer management', type: 'page', category: 'Pages' },
  { id: 'page-3', name: 'Products', description: 'Product catalog', type: 'page', category: 'Pages' },
  { id: 'page-4', name: 'Settings', description: 'Application settings', type: 'page', category: 'Pages' },
  { id: 'page-5', name: 'Analytics', description: 'Data analytics and reports', type: 'page', category: 'Pages' },
  { id: 'page-6', name: 'Reports', description: 'Generate reports', type: 'page', category: 'Pages' },
];

const recentSearches = [
  'Dashboard',
  'John Doe',
  'ORD-001',
  'Settings',
  'Analytics'
];

const savedFilters = [
  { name: 'Recent Orders', count: 12, icon: ShoppingCart },
  { name: 'Active Users', count: 45, icon: Users },
  { name: 'High Value Sales', count: 8, icon: DollarSign },
  { name: 'Pending Tasks', count: 23, icon: Calendar },
];

export default function SearchModal({ isOpen, onClose, searchQuery, onSearchChange }: SearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = searchData.filter(item => 
        ('name' in item && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('email' in item && item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('description' in item && item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('customer' in item && item.customer && item.customer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      if (selectedCategory) {
        setFilteredResults(filtered.filter(item => item.category === selectedCategory));
      } else {
        setFilteredResults(filtered);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleSearchItemClick = (item: SearchItem) => {
    onClose();
    onSearchChange("");
    console.log(`Selected ${item.type}:`, item);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'order': return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'user': return <Users className="h-4 w-4 text-purple-600" />;
      case 'page': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 text-sm"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">ESC</kbd>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Filter by Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Sales', 'Orders', 'Users', 'Pages'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {searchQuery ? (
            filteredResults.length > 0 ? (
              <div className="p-2">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSearchItemClick(item)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {'email' in item ? item.email : 'description' in item ? item.description : 'customer' in item ? item.customer : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      {item.amount && (
                        <span className="text-xs font-medium text-gray-600">
                          {item.amount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <SearchIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No results found for "{searchQuery}"</p>
              </div>
            )
          ) : (
            <div className="p-6">
              {/* Recent Searches */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onSearchChange(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Saved Filters */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Saved Filters</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {savedFilters.map((filter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-10"
                    >
                      <filter.icon className="h-3 w-3 mr-2" />
                      <span className="flex-1 text-left">{filter.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Save className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>• Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">⌘K</kbd> to search</p>
                  <p>• Use filters to narrow down results</p>
                  <p>• Click on any result to navigate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
