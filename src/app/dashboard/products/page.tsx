"use client";

import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, Select, DatePicker, Row, Col, Statistic } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button as ShadcnButton } from "@/components/ui/button";
import Layout from "@/components/Layout";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
  description: string;
  sku: string;
  brand: string;
  rating: number;
  sales: number;
}

// Dummy data
const generateDummyProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'Dell', 'HP', 'Microsoft'];
  const statuses: ('active' | 'inactive' | 'discontinued')[] = ['active', 'inactive', 'discontinued'];
  
  return Array.from({ length: 100 }, (_, index) => ({
    id: `PROD-${String(index + 1).padStart(4, '0')}`,
    name: `Product ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 500) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD'),
    updatedAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
    description: `This is a detailed description for Product ${index + 1}. It includes various features and specifications.`,
    sku: `SKU-${String(index + 1).padStart(6, '0')}`,
    brand: brands[Math.floor(Math.random() * brands.length)],
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
    sales: Math.floor(Math.random() * 1000) + 1,
  }));
};

const dummyProducts = generateDummyProducts();

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.sku}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: [...new Set(products.map(p => p.category))].map(cat => ({
        text: cat,
        value: cat,
      })),
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      filters: [...new Set(products.map(p => p.brand))].map(brand => ({
        text: brand,
        value: brand,
      })),
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => (
        <span className={stock < 10 ? 'text-red-500 font-medium' : ''}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Discontinued', value: 'discontinued' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colors = {
          active: 'green',
          inactive: 'orange',
          discontinued: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      width: 80,
      sorter: (a, b) => a.sales - b.sales,
      render: (sales) => sales.toLocaleString(),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterProducts(value, categoryFilter, statusFilter, dateRange);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    filterProducts(searchText, value, statusFilter, dateRange);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterProducts(searchText, categoryFilter, value, dateRange);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
    filterProducts(searchText, categoryFilter, statusFilter, dates);
  };

  const filterProducts = (
    search: string,
    category: string,
    status: string,
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null
  ) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (status) {
      filtered = filtered.filter(product => product.status === status);
    }

    if (dates) {
      filtered = filtered.filter(product => {
        const productDate = dayjs(product.createdAt);
        return productDate.isAfter(dates[0]) && productDate.isBefore(dates[1]);
      });
    }

    setFilteredProducts(filtered);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Handle table sorting and filtering
    console.log('Table change:', { pagination, filters, sorter });
  };

  const handleItemClick = (item: string) => {
    // Handle navigation if needed
    console.log('Item clicked:', item);
  };

  return (
    <Layout activeItem="products" onItemClick={handleItemClick}>
      <div className="p-4 overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-sm">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={totalProducts}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Products"
                value={activeProducts}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={totalValue}
                prefix="$"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Rating"
                value={avgRating}
                precision={1}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Search
                placeholder="Search products..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Category"
                allowClear
                size="large"
                style={{ width: '100%' }}
                onChange={handleCategoryFilter}
              >
                {[...new Set(products.map(p => p.category))].map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Status"
                allowClear
                size="large"
                style={{ width: '100%' }}
                onChange={handleStatusFilter}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="discontinued">Discontinued</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                size="large"
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{ width: '100%' }}
              >
                Add Product
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Products Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            loading={loading}
            pagination={{
              current: 1,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} products`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 1200 }}
            onChange={handleTableChange}
            size="middle"
          />
        </Card>
      </div>
    </Layout>
  );
}
