"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";
import {
  Bell,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  User,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Trash2,
  Archive,
  MarkAsRead,
} from "lucide-react";
import {
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Input,
  Select,
  DatePicker,
  Dropdown,
  Modal,
  message,
  Badge,
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Empty,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

const { Search: AntSearch } = Input;
const { RangePicker } = DatePicker;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  actions?: {
    id: string;
    label: string;
    type: "primary" | "default" | "danger";
    onClick: () => void;
  }[];
  metadata?: {
    module?: string;
    entityId?: string;
    entityType?: string;
    url?: string;
  };
}

// Mock data for notifications
const generateMockNotifications = (): Notification[] => {
  const types: Notification["type"][] = ["info", "success", "warning", "error"];
  const priorities: Notification["priority"][] = [
    "low",
    "medium",
    "high",
    "urgent",
  ];
  const categories = [
    "System",
    "User Management",
    "Security",
    "Performance",
    "Maintenance",
    "Updates",
    "Alerts",
    "Reports",
  ];
  const senders = [
    { id: "1", name: "System Administrator", role: "Admin", avatar: "" },
    { id: "2", name: "John Doe", role: "Manager", avatar: "" },
    { id: "3", name: "Jane Smith", role: "Developer", avatar: "" },
    { id: "4", name: "Mike Johnson", role: "Analyst", avatar: "" },
    { id: "5", name: "Sarah Wilson", role: "Designer", avatar: "" },
  ];

  const notifications: Notification[] = [];

  for (let i = 1; i <= 150; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const sender = senders[Math.floor(Math.random() * senders.length)];
    const isRead = Math.random() > 0.3;
    const isArchived = Math.random() > 0.8;

    const createdAt = dayjs()
      .subtract(Math.floor(Math.random() * 30), "day")
      .subtract(Math.floor(Math.random() * 24), "hour")
      .subtract(Math.floor(Math.random() * 60), "minute")
      .toISOString();

    const readAt = isRead
      ? dayjs(createdAt)
          .add(Math.floor(Math.random() * 24), "hour")
          .toISOString()
      : undefined;

    const archivedAt = isArchived
      ? dayjs(createdAt)
          .add(Math.floor(Math.random() * 7), "day")
          .toISOString()
      : undefined;

    notifications.push({
      id: i.toString(),
      title: `Notification ${i}: ${getNotificationTitle(type, category)}`,
      message: getNotificationMessage(type, category, i),
      type,
      priority,
      category,
      isRead,
      isArchived,
      createdAt,
      readAt,
      archivedAt,
      sender,
      actions: getNotificationActions(type, i),
      metadata: {
        module: category,
        entityId: i.toString(),
        entityType: "notification",
        url: `/dashboard/notifications/${i}`,
      },
    });
  }

  return notifications.sort(
    (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
  );
};

const getNotificationTitle = (
  type: Notification["type"],
  category: string,
): string => {
  const titles = {
    info: `New ${category} Update`,
    success: `${category} Operation Completed`,
    warning: `${category} Warning`,
    error: `${category} Error Detected`,
  };
  return titles[type];
};

const getNotificationMessage = (
  type: Notification["type"],
  category: string,
  id: number,
): string => {
  const messages = {
    info: `A new update has been made to the ${category.toLowerCase()} module. Please review the changes.`,
    success: `The ${category.toLowerCase()} operation has been completed successfully. All systems are running normally.`,
    warning: `A potential issue has been detected in the ${category.toLowerCase()} module. Please investigate.`,
    error: `An error occurred in the ${category.toLowerCase()} module. Immediate attention is required.`,
  };
  return messages[type];
};

const getNotificationActions = (type: Notification["type"], id: number) => {
  const actions = [
    {
      id: "view",
      label: "View Details",
      type: "primary" as const,
      onClick: () => console.log(`View notification ${id}`),
    },
  ];

  if (type === "error" || type === "warning") {
    actions.push({
      id: "resolve",
      label: "Mark as Resolved",
      type: "default" as const,
      onClick: () => console.log(`Resolve notification ${id}`),
    });
  }

  return actions;
};

export default function ViewAllNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [
    notifications,
    searchTerm,
    typeFilter,
    priorityFilter,
    categoryFilter,
    statusFilter,
    dateRange,
  ]);

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          notification.sender.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          notification.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.type === typeFilter,
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.priority === priorityFilter,
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.category === categoryFilter,
      );
    }

    // Status filter
    if (statusFilter === "read") {
      filtered = filtered.filter((notification) => notification.isRead);
    } else if (statusFilter === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead);
    } else if (statusFilter === "archived") {
      filtered = filtered.filter((notification) => notification.isArchived);
    }

    // Date range filter
    if (dateRange) {
      filtered = filtered.filter((notification) => {
        const notificationDate = dayjs(notification.createdAt);
        return (
          notificationDate.isAfter(dateRange[0]) &&
          notificationDate.isBefore(dateRange[1])
        );
      });
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id)
          ? {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString(),
            }
          : notification,
      ),
    );
    message.success(`${notificationIds.length} notification(s) marked as read`);
    setSelectedRowKeys([]);
  };

  const handleMarkAsUnread = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id)
          ? {
              ...notification,
              isRead: false,
              readAt: undefined,
            }
          : notification,
      ),
    );
    message.success(
      `${notificationIds.length} notification(s) marked as unread`,
    );
    setSelectedRowKeys([]);
  };

  const handleArchive = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id)
          ? {
              ...notification,
              isArchived: true,
              archivedAt: new Date().toISOString(),
            }
          : notification,
      ),
    );
    message.success(`${notificationIds.length} notification(s) archived`);
    setSelectedRowKeys([]);
  };

  const handleDelete = (notificationIds: string[]) => {
    Modal.confirm({
      title: "Delete Notifications",
      content: `Are you sure you want to delete ${notificationIds.length} notification(s)? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setNotifications((prev) =>
          prev.filter(
            (notification) => !notificationIds.includes(notification.id),
          ),
        );
        message.success(`${notificationIds.length} notification(s) deleted`);
        setSelectedRowKeys([]);
      },
    });
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailModalVisible(true);
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "low":
        return "default";
      case "medium":
        return "processing";
      case "high":
        return "warning";
      case "urgent":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "blue";
      case "success":
        return "green";
      case "warning":
        return "orange";
      case "error":
        return "red";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Notification> = [
    {
      title: "Notification",
      key: "notification",
      width: 400,
      render: (_, record) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">{getTypeIcon(record.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {record.title}
              </h4>
              {!record.isRead && <Badge status="processing" />}
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {record.message}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Tag color={getTypeColor(record.type)} size="small">
                {record.type}
              </Tag>
              <Tag color={getPriorityColor(record.priority)} size="small">
                {record.priority}
              </Tag>
              <Tag color="default" size="small">
                {record.category}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Sender",
      key: "sender",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" src={record.sender.avatar}>
            {record.sender.name.charAt(0)}
          </Avatar>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {record.sender.name}
            </div>
            <div className="text-xs text-gray-500">{record.sender.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 150,
      sorter: (a, b) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      render: (_, record) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {dayjs(record.createdAt).format("MMM DD, YYYY")}
          </div>
          <div className="text-gray-500">
            {dayjs(record.createdAt).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={record.isRead ? "green" : "orange"} size="small">
            {record.isRead ? "Read" : "Unread"}
          </Tag>
          {record.isArchived && (
            <Tag color="default" size="small">
              Archived
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetails(record)}
            className="p-0 h-auto"
          >
            View
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "mark-read",
                  label: record.isRead ? "Mark as Unread" : "Mark as Read",
                  icon: record.isRead ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  ),
                  onClick: () =>
                    record.isRead
                      ? handleMarkAsUnread([record.id])
                      : handleMarkAsRead([record.id]),
                },
                {
                  key: "archive",
                  label: record.isArchived ? "Unarchive" : "Archive",
                  icon: <Archive className="h-4 w-4" />,
                  onClick: () => handleArchive([record.id]),
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  danger: true,
                  onClick: () => handleDelete([record.id]),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreVertical className="h-4 w-4" />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleBulkAction = (action: string) => {
    const selectedIds = selectedRowKeys.map(String);
    if (selectedIds.length === 0) {
      message.warning("Please select notifications first");
      return;
    }

    switch (action) {
      case "mark-read":
        handleMarkAsRead(selectedIds);
        break;
      case "mark-unread":
        handleMarkAsUnread(selectedIds);
        break;
      case "archive":
        handleArchive(selectedIds);
        break;
      case "delete":
        handleDelete(selectedIds);
        break;
    }
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    archived: notifications.filter((n) => n.isArchived).length,
    today: notifications.filter((n) =>
      dayjs(n.createdAt).isSame(dayjs(), "day"),
    ).length,
  };

  return (
    <AdminLayout>
      <MainContent>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bell className="h-8 w-8 mr-3 text-blue-600" />
                  All Notifications
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all system notifications
                </p>
              </div>
              <Button
                type="primary"
                icon={<Settings className="h-4 w-4" />}
                onClick={() => router.push("/dashboard/settings")}
              >
                Notification Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Notifications"
                  value={stats.total}
                  prefix={<Bell className="h-4 w-4" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Unread"
                  value={stats.unread}
                  prefix={<Badge status="processing" />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Archived"
                  value={stats.archived}
                  prefix={<Archive className="h-4 w-4" />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Today"
                  value={stats.today}
                  prefix={<Calendar className="h-4 w-4" />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card className="mb-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <AntSearch
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </div>
                <Select
                  placeholder="Type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "info", label: "Info" },
                    { value: "success", label: "Success" },
                    { value: "warning", label: "Warning" },
                    { value: "error", label: "Error" },
                  ]}
                />
                <Select
                  placeholder="Priority"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "All Priorities" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                />
                <Select
                  placeholder="Category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  style={{ width: 140 }}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "System", label: "System" },
                    { value: "User Management", label: "User Management" },
                    { value: "Security", label: "Security" },
                    { value: "Performance", label: "Performance" },
                    { value: "Maintenance", label: "Maintenance" },
                    { value: "Updates", label: "Updates" },
                    { value: "Alerts", label: "Alerts" },
                    { value: "Reports", label: "Reports" },
                  ]}
                />
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "unread", label: "Unread" },
                    { value: "read", label: "Read" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder={["Start Date", "End Date"]}
                />
              </div>

              {/* Bulk Actions */}
              {selectedRowKeys.length > 0 && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">
                    {selectedRowKeys.length} notification(s) selected
                  </span>
                  <Space>
                    <Button
                      size="small"
                      icon={<Check className="h-4 w-4" />}
                      onClick={() => handleBulkAction("mark-read")}
                    >
                      Mark as Read
                    </Button>
                    <Button
                      size="small"
                      icon={<X className="h-4 w-4" />}
                      onClick={() => handleBulkAction("mark-unread")}
                    >
                      Mark as Unread
                    </Button>
                    <Button
                      size="small"
                      icon={<Archive className="h-4 w-4" />}
                      onClick={() => handleBulkAction("archive")}
                    >
                      Archive
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleBulkAction("delete")}
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          </Card>

          {/* Notifications Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredNotifications}
              rowKey="id"
              rowSelection={rowSelection}
              loading={loading}
              pagination={{
                total: filteredNotifications.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} notifications`,
              }}
              scroll={{ x: 1200 }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No notifications found"
                  />
                ),
              }}
            />
          </Card>

          {/* Notification Detail Modal */}
          <Modal
            title="Notification Details"
            open={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setDetailModalVisible(false)}>
                Close
              </Button>,
              selectedNotification && (
                <Button
                  key="action"
                  type="primary"
                  onClick={() => {
                    if (selectedNotification.actions?.[0]) {
                      selectedNotification.actions[0].onClick();
                    }
                    setDetailModalVisible(false);
                  }}
                >
                  {selectedNotification.actions?.[0]?.label || "View Details"}
                </Button>
              ),
            ]}
            width={600}
          >
            {selectedNotification && (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(selectedNotification.type)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedNotification.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <Tag color={getTypeColor(selectedNotification.type)}>
                        {selectedNotification.type}
                      </Tag>
                      <Tag
                        color={getPriorityColor(selectedNotification.priority)}
                      >
                        {selectedNotification.priority}
                      </Tag>
                      <Tag color="default">{selectedNotification.category}</Tag>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {selectedNotification.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Sender
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar
                        size="small"
                        src={selectedNotification.sender.avatar}
                      >
                        {selectedNotification.sender.name.charAt(0)}
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedNotification.sender.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedNotification.sender.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {dayjs(selectedNotification.createdAt).format(
                        "MMM DD, YYYY HH:mm",
                      )}
                    </div>
                  </div>
                </div>

                {selectedNotification.readAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Read At
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {dayjs(selectedNotification.readAt).format(
                        "MMM DD, YYYY HH:mm",
                      )}
                    </div>
                  </div>
                )}

                {selectedNotification.metadata && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Metadata
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      <div>Module: {selectedNotification.metadata.module}</div>
                      {selectedNotification.metadata.url && (
                        <div>URL: {selectedNotification.metadata.url}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </MainContent>
    </AdminLayout>
  );
}
