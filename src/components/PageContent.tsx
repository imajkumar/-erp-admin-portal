"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import {
  MdAttachMoney,
  MdBarChart,
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
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendar from "./Calendar";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PageContentProps {
  activeItem: string;
}

// Dummy data for different pages
const pageData = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your business metricsKKK",
    stats: [
      {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1%",
        trend: "up",
        icon: MdAttachMoney,
      },
      {
        title: "Subscriptions",
        value: "+2,350",
        change: "+180.1%",
        trend: "up",
        icon: MdPeople,
      },
      {
        title: "Sales",
        value: "+12,234",
        change: "+19%",
        trend: "up",
        icon: MdShoppingCart,
      },
      {
        title: "Active Now",
        value: "+573",
        change: "+201",
        trend: "up",
        icon: MdLocalActivity,
      },
    ],
  },
  users: {
    title: "MdPeople",
    description: "Manage your user accounts and permissions",
    stats: [
      {
        title: "Total MdPeople",
        value: "2,350",
        change: "+12%",
        trend: "up",
        icon: MdPeople,
      },
      {
        title: "Active MdPeople",
        value: "1,890",
        change: "+8%",
        trend: "up",
        icon: MdLocalActivity,
      },
      {
        title: "New MdPeople",
        value: "156",
        change: "+23%",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Banned MdPeople",
        value: "23",
        change: "-5%",
        trend: "down",
        icon: MdPeople,
      },
    ],
  },
  sales: {
    title: "Sales",
    description: "Track your sales performance and revenue",
    stats: [
      {
        title: "Total Sales",
        value: "$89,231.89",
        change: "+25.1%",
        trend: "up",
        icon: MdAttachMoney,
      },
      {
        title: "Orders",
        value: "1,234",
        change: "+15%",
        trend: "up",
        icon: MdShoppingCart,
      },
      {
        title: "Conversion",
        value: "3.2%",
        change: "+0.5%",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Avg Order",
        value: "$72.30",
        change: "+2.1%",
        trend: "up",
        icon: MdBarChart,
      },
    ],
  },
  revenue: {
    title: "Revenue",
    description: "Financial overview and revenue analytics",
    stats: [
      {
        title: "Monthly Revenue",
        value: "$125,231.89",
        change: "+18.1%",
        trend: "up",
        icon: MdAttachMoney,
      },
      {
        title: "Yearly Revenue",
        value: "$1.2M",
        change: "+32%",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Profit Margin",
        value: "24.5%",
        change: "+2.3%",
        trend: "up",
        icon: MdBarChart,
      },
      {
        title: "Growth Rate",
        value: "15.2%",
        change: "+1.8%",
        trend: "up",
        icon: MdLocalActivity,
      },
    ],
  },
  activity: {
    title: "MdLocalActivity",
    description: "Monitor system activity and user actions",
    stats: [
      {
        title: "Page Views",
        value: "45,231",
        change: "+12%",
        trend: "up",
        icon: MdLocalActivity,
      },
      {
        title: "Sessions",
        value: "12,350",
        change: "+8%",
        trend: "up",
        icon: MdPeople,
      },
      {
        title: "Bounce Rate",
        value: "34.2%",
        change: "-2.1%",
        trend: "down",
        icon: MdTrendingUp,
      },
      {
        title: "Avg Duration",
        value: "4m 32s",
        change: "+15%",
        trend: "up",
        icon: MdEvent,
      },
    ],
  },
  settings: {
    title: "MdSettings",
    description: "Configure your application settings",
    stats: [
      {
        title: "Active Features",
        value: "24",
        change: "+3",
        trend: "up",
        icon: MdSettings,
      },
      {
        title: "Integrations",
        value: "8",
        change: "+1",
        trend: "up",
        icon: MdInventory,
      },
      {
        title: "API Calls",
        value: "1.2M",
        change: "+15%",
        trend: "up",
        icon: MdLocalActivity,
      },
      {
        title: "Storage Used",
        value: "2.4GB",
        change: "+8%",
        trend: "up",
        icon: MdDescription,
      },
    ],
  },
  notifications: {
    title: "Notifications",
    description: "Manage your notification preferences",
    stats: [
      {
        title: "Total Notifications",
        value: "156",
        change: "+23%",
        trend: "up",
        icon: MdNotifications,
      },
      {
        title: "Unread",
        value: "12",
        change: "-5%",
        trend: "down",
        icon: MdNotifications,
      },
      {
        title: "Email Sent",
        value: "2,340",
        change: "+18%",
        trend: "up",
        icon: MdDescription,
      },
      {
        title: "Push Sent",
        value: "1,890",
        change: "+12%",
        trend: "up",
        icon: MdLocalActivity,
      },
    ],
  },
  home: {
    title: "MdHome",
    description: "Welcome to your dashboard home",
    stats: [
      {
        title: "Welcome Back",
        value: "Admin",
        change: "Today",
        trend: "up",
        icon: MdHome,
      },
      {
        title: "Quick Actions",
        value: "8",
        change: "Available",
        trend: "up",
        icon: MdSettings,
      },
      {
        title: "Recent MdLocalActivity",
        value: "23",
        change: "Items",
        trend: "up",
        icon: MdLocalActivity,
      },
      {
        title: "System Status",
        value: "Online",
        change: "All Good",
        trend: "up",
        icon: MdBarChart,
      },
    ],
  },
  reports: {
    title: "Reports",
    description: "Generate and view detailed reports",
    stats: [
      {
        title: "Total Reports",
        value: "45",
        change: "+5",
        trend: "up",
        icon: MdDescription,
      },
      {
        title: "Scheduled",
        value: "12",
        change: "+2",
        trend: "up",
        icon: MdEvent,
      },
      {
        title: "Generated Today",
        value: "8",
        change: "+3",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Downloaded",
        value: "234",
        change: "+18%",
        trend: "up",
        icon: Download,
      },
    ],
  },
  products: {
    title: "Products",
    description: "Manage your product catalog",
    stats: [
      {
        title: "Total Products",
        value: "1,234",
        change: "+45",
        trend: "up",
        icon: MdInventory,
      },
      {
        title: "Active",
        value: "1,189",
        change: "+23",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Out of Stock",
        value: "23",
        change: "-5",
        trend: "down",
        icon: MdInventory,
      },
      {
        title: "Categories",
        value: "12",
        change: "+2",
        trend: "up",
        icon: MdBarChart,
      },
    ],
  },
  analytics: {
    title: "Analytics",
    description: "Deep dive into your data analytics",
    stats: [
      {
        title: "Data Points",
        value: "2.3M",
        change: "+15%",
        trend: "up",
        icon: MdBarChart,
      },
      {
        title: "Charts Generated",
        value: "89",
        change: "+12",
        trend: "up",
        icon: MdTrendingUp,
      },
      {
        title: "Insights Found",
        value: "23",
        change: "+5",
        trend: "up",
        icon: MdLocalActivity,
      },
      {
        title: "Export Count",
        value: "156",
        change: "+18%",
        trend: "up",
        icon: Download,
      },
    ],
  },
  calendar: {
    title: "Calendar",
    description: "Manage your events and schedule",
    stats: [
      {
        title: "Today's Events",
        value: "5",
        change: "+2",
        trend: "up",
        icon: MdEvent,
      },
      {
        title: "This Week",
        value: "12",
        change: "+3",
        trend: "up",
        icon: MdEvent,
      },
      {
        title: "This Month",
        value: "45",
        change: "+8",
        trend: "up",
        icon: MdEvent,
      },
      {
        title: "Upcoming",
        value: "23",
        change: "+5",
        trend: "up",
        icon: MdEvent,
      },
    ],
  },
};

const _recentData = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    avatar: "OM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    avatar: "JL",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    avatar: "IN",
  },
  {
    id: 4,
    name: "William Kim",
    email: "william.kim@email.com",
    amount: "+$1,200.00",
    avatar: "WK",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$99.00",
    avatar: "SD",
  },
];

// Table data interface
interface TableDataItem {
  key: string;
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "pending";
  amount: number;
  date: string;
  description: string;
}

// Generate dummy table data
const generateTableData = (): TableDataItem[] => {
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Health",
    "Beauty",
    "Automotive",
  ];
  const statuses: ("active" | "inactive" | "pending")[] = [
    "active",
    "inactive",
    "pending",
  ];
  const names = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Miller",
    "Amy Garcia",
  ];

  return Array.from({ length: 50 }, (_, index) => ({
    key: String(index + 1),
    id: `ID-${String(index + 1).padStart(3, "0")}`,
    name: names[index % names.length],
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    amount: Math.floor(Math.random() * 10000) + 100,
    date: dayjs()
      .subtract(Math.floor(Math.random() * 30), "day")
      .format("YYYY-MM-DD"),
    description: `Description for item ${index + 1}`,
  }));
};

const tableData = generateTableData();

// Table columns
const columns: ColumnsType<TableDataItem> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 120,
    filters: [
      { text: "Electronics", value: "Electronics" },
      { text: "Clothing", value: "Clothing" },
      { text: "Books", value: "Books" },
      { text: "Home & Garden", value: "Home & Garden" },
      { text: "Sports", value: "Sports" },
      { text: "Health", value: "Health" },
      { text: "Beauty", value: "Beauty" },
      { text: "Automotive", value: "Automotive" },
    ],
    onFilter: (value, record) => record.category === value,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    filters: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
      { text: "Pending", value: "pending" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: string) => {
      const color =
        status === "active"
          ? "green"
          : status === "inactive"
            ? "red"
            : "orange";
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 120,
    sorter: (a, b) => a.amount - b.amount,
    render: (amount: number) => `$${amount.toLocaleString()}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 120,
    sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Actions",
    key: "actions",
    width: 120,
    render: (_, _record) => (
      <Space size="small">
        <Button type="link" size="small" icon={<EyeOutlined />} />
        <Button type="link" size="small" icon={<EditOutlined />} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} />
      </Space>
    ),
  },
];

export default function PageContent({ activeItem }: PageContentProps) {
  // Handle calendar route specially
  if (activeItem === "calendar") {
    return <Calendar className="h-full" />;
  }

  // Handle products route specially - redirect to products page
  if (activeItem === "products") {
    window.location.href = "/dashboard/products";
    return null;
  }

  const data =
    pageData[activeItem as keyof typeof pageData] || pageData.dashboard;

  return (
    <main className="flex-1 p-4 overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-sm">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
        <p className="text-gray-600">{data.description}</p>
      </div>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} className="mb-6">
        {data.stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )
                }
                suffix={stat.change}
                valueStyle={{
                  color: stat.trend === "up" ? "#3f8600" : "#cf1322",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Search */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by name, ID, or description"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by Category"
                allowClear
                style={{ width: "100%" }}
                size="middle"
              >
                <Option value="Electronics">Electronics</Option>
                <Option value="Clothing">Clothing</Option>
                <Option value="Books">Books</Option>
                <Option value="Home & Garden">Home & Garden</Option>
                <Option value="Sports">Sports</Option>
                <Option value="Health">Health</Option>
                <Option value="Beauty">Beauty</Option>
                <Option value="Automotive">Automotive</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by Status"
                allowClear
                style={{ width: "100%" }}
                size="middle"
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                style={{ width: "100%" }}
              >
                Add New
              </Button>
            </Col>
          </Row>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{data.title} Data Table</CardTitle>
              <CardDescription>
                Manage and view all {data.title.toLowerCase()} records
              </CardDescription>
            </div>
            <Space>
              <ShadcnButton variant="outline" size="sm">
                <FilterOutlined className="h-4 w-4 mr-2" />
                Filters
              </ShadcnButton>
              <ShadcnButton variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </ShadcnButton>
            </Space>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{
                current: 1,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              scroll={{ x: 1200 }}
              size="middle"
              bordered
              rowSelection={{
                type: "checkbox",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
