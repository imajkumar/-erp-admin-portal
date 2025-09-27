"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";
import InboxSidebar from "@/components/InboxSidebar";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  Edit,
  Filter,
  Inbox,
  Mail,
  MoreVertical,
  Paperclip,
  Plus,
  RefreshCw,
  Reply,
  ReplyAll,
  Search,
  Send,
  Star,
  StarOff,
  Trash2,
  X,
  FileText,
  ShoppingCart,
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
  Empty,
  Spin,
  Drawer,
  Divider,
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

const { Search: AntSearch } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipients: string[];
  body: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  folder: "inbox" | "sent" | "drafts" | "trash" | "spam";
  priority: "low" | "normal" | "high";
  receivedAt: string;
  sentAt?: string;
  labels: string[];
  threadId?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

// Mock data for emails
const generateMockEmails = (): Email[] => {
  const senders = [
    { name: "John Smith", email: "john.smith@company.com", avatar: "JS" },
    { name: "Sarah Johnson", email: "sarah.j@techcorp.com", avatar: "SJ" },
    { name: "Mike Chen", email: "mike.chen@startup.io", avatar: "MC" },
    { name: "Emily Davis", email: "emily.davis@enterprise.com", avatar: "ED" },
    { name: "David Wilson", email: "d.wilson@business.net", avatar: "DW" },
    { name: "Lisa Brown", email: "lisa.brown@corp.org", avatar: "LB" },
    { name: "Tom Anderson", email: "tom.anderson@company.com", avatar: "TA" },
    { name: "Anna Garcia", email: "anna.garcia@tech.com", avatar: "AG" },
  ];

  const subjects = [
    "Project Update - Q4 Planning",
    "Meeting Reminder - Tomorrow at 2 PM",
    "Budget Approval Required",
    "New Feature Release Notes",
    "Client Feedback Summary",
    "System Maintenance Schedule",
    "Team Building Event",
    "Quarterly Review Results",
    "Security Alert - Password Reset",
    "Invoice #12345 - Payment Due",
    "Contract Renewal Discussion",
    "Training Session Invitation",
    "Performance Metrics Report",
    "Holiday Schedule Update",
    "Equipment Request Form",
  ];

  const folders: Email["folder"][] = [
    "inbox",
    "sent",
    "drafts",
    "trash",
    "spam",
  ];
  const priorities: Email["priority"][] = ["low", "normal", "high"];
  const labels = [
    "Work",
    "Personal",
    "Important",
    "Follow-up",
    "Meeting",
    "Project",
  ];

  const emails: Email[] = [];

  for (let i = 1; i <= 200; i++) {
    const sender = senders[Math.floor(Math.random() * senders.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const folder = folders[Math.floor(Math.random() * folders.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const isRead = Math.random() > 0.3;
    const isStarred = Math.random() > 0.8;
    const isImportant = Math.random() > 0.7;
    const hasAttachments = Math.random() > 0.6;

    const receivedAt = dayjs()
      .subtract(Math.floor(Math.random() * 30), "day")
      .subtract(Math.floor(Math.random() * 24), "hour")
      .subtract(Math.floor(Math.random() * 60), "minute")
      .toISOString();

    const emailLabels = labels
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    emails.push({
      id: i.toString(),
      subject: `${subject} ${i > 1 ? `(${i})` : ""}`,
      sender,
      recipients: ["admin@erp.com"],
      body: `This is the email body for ${subject}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Best regards,
${sender.name}`,
      isRead,
      isStarred,
      isImportant,
      hasAttachments,
      attachments: hasAttachments
        ? [
            {
              name: `document_${i}.pdf`,
              size: `${Math.floor(Math.random() * 5) + 1}MB`,
              type: "PDF",
            },
            {
              name: `image_${i}.jpg`,
              size: `${Math.floor(Math.random() * 2) + 1}MB`,
              type: "Image",
            },
          ]
        : undefined,
      folder,
      priority,
      receivedAt,
      sentAt: folder === "sent" ? receivedAt : undefined,
      labels: emailLabels,
      threadId: Math.floor(Math.random() * 20).toString(),
      replyTo: sender.email,
      cc: Math.random() > 0.7 ? ["cc@example.com"] : undefined,
      bcc: Math.random() > 0.9 ? ["bcc@example.com"] : undefined,
    });
  }

  return emails.sort(
    (a, b) => dayjs(b.receivedAt).valueOf() - dayjs(a.receivedAt).valueOf(),
  );
};

export default function InboxPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("inbox");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailDrawerVisible, setEmailDrawerVisible] = useState(false);
  const [composeModalVisible, setComposeModalVisible] = useState(false);
  const [composeEmail, setComposeEmail] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    priority: "normal" as Email["priority"],
  });
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockEmails = generateMockEmails();
      setEmails(mockEmails);
      setFilteredEmails(mockEmails.filter((email) => email.folder === "inbox"));
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterEmails();
  }, [
    emails,
    searchTerm,
    folderFilter,
    priorityFilter,
    statusFilter,
    dateRange,
  ]);

  const filterEmails = () => {
    let filtered = [...emails];

    // Folder filter
    filtered = filtered.filter((email) => email.folder === folderFilter);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.body.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((email) => email.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter === "read") {
      filtered = filtered.filter((email) => email.isRead);
    } else if (statusFilter === "unread") {
      filtered = filtered.filter((email) => !email.isRead);
    } else if (statusFilter === "starred") {
      filtered = filtered.filter((email) => email.isStarred);
    } else if (statusFilter === "important") {
      filtered = filtered.filter((email) => email.isImportant);
    }

    // Date range filter
    if (dateRange) {
      filtered = filtered.filter((email) => {
        const emailDate = dayjs(email.receivedAt);
        return (
          emailDate.isAfter(dateRange[0]) && emailDate.isBefore(dateRange[1])
        );
      });
    }

    setFilteredEmails(filtered);
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setEmailDrawerVisible(true);

    // Mark as read
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e)),
      );
    }
  };

  const handleStarToggle = (emailId: string) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email,
      ),
    );
  };

  const handleImportantToggle = (emailId: string) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId
          ? { ...email, isImportant: !email.isImportant }
          : email,
      ),
    );
  };

  const handleDelete = (emailIds: string[]) => {
    setEmails((prev) =>
      prev.map((email) =>
        emailIds.includes(email.id)
          ? { ...email, folder: "trash" as Email["folder"] }
          : email,
      ),
    );
    message.success(`${emailIds.length} email(s) moved to trash`);
    setSelectedRowKeys([]);
  };

  const handleArchive = (emailIds: string[]) => {
    setEmails((prev) =>
      prev.map((email) =>
        emailIds.includes(email.id)
          ? { ...email, folder: "archive" as Email["folder"] }
          : email,
      ),
    );
    message.success(`${emailIds.length} email(s) archived`);
    setSelectedRowKeys([]);
  };

  const handleCompose = () => {
    setComposeModalVisible(true);
  };

  const handleSendEmail = () => {
    if (!composeEmail.to || !composeEmail.subject) {
      message.error("Please fill in required fields");
      return;
    }

    const newEmail: Email = {
      id: (emails.length + 1).toString(),
      subject: composeEmail.subject,
      sender: {
        name: "You",
        email: "admin@erp.com",
        avatar: "A",
      },
      recipients: [composeEmail.to],
      body: composeEmail.body,
      isRead: true,
      isStarred: false,
      isImportant: composeEmail.priority === "high",
      hasAttachments: false,
      folder: "sent",
      priority: composeEmail.priority,
      receivedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      labels: [],
    };

    setEmails((prev) => [newEmail, ...prev]);
    setComposeModalVisible(false);
    setComposeEmail({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
      priority: "normal",
    });
    message.success("Email sent successfully");
  };

  const getPriorityColor = (priority: Email["priority"]) => {
    switch (priority) {
      case "low":
        return "default";
      case "normal":
        return "processing";
      case "high":
        return "error";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Email> = [
    {
      title: "From",
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
            <div className="text-xs text-gray-500">{record.sender.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {!record.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
            {record.isStarred && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
            {record.isImportant && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            {record.hasAttachments && (
              <Paperclip className="h-3 w-3 text-gray-400" />
            )}
          </div>
          <span
            className={`text-sm cursor-pointer hover:text-blue-600 ${
              !record.isRead ? "font-semibold" : "font-normal"
            }`}
            onClick={() => handleEmailClick(record)}
          >
            {record.subject}
          </span>
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 120,
      sorter: (a, b) =>
        dayjs(a.receivedAt).valueOf() - dayjs(b.receivedAt).valueOf(),
      render: (_, record) => (
        <div className="text-sm text-gray-500">
          {dayjs(record.receivedAt).format("MMM DD")}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={
              record.isStarred ? (
                <StarOff className="h-3 w-3" />
              ) : (
                <Star className="h-3 w-3" />
              )
            }
            onClick={() => handleStarToggle(record.id)}
          />
          <Button
            type="text"
            size="small"
            icon={<Trash2 className="h-3 w-3" />}
            onClick={() => handleDelete([record.id])}
          />
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
      message.warning("Please select emails first");
      return;
    }

    switch (action) {
      case "mark-read":
        setEmails((prev) =>
          prev.map((email) =>
            selectedIds.includes(email.id) ? { ...email, isRead: true } : email,
          ),
        );
        message.success(`${selectedIds.length} email(s) marked as read`);
        break;
      case "mark-unread":
        setEmails((prev) =>
          prev.map((email) =>
            selectedIds.includes(email.id)
              ? { ...email, isRead: false }
              : email,
          ),
        );
        message.success(`${selectedIds.length} email(s) marked as unread`);
        break;
      case "star":
        setEmails((prev) =>
          prev.map((email) =>
            selectedIds.includes(email.id)
              ? { ...email, isStarred: true }
              : email,
          ),
        );
        message.success(`${selectedIds.length} email(s) starred`);
        break;
      case "archive":
        handleArchive(selectedIds);
        break;
      case "delete":
        handleDelete(selectedIds);
        break;
    }
    setSelectedRowKeys([]);
  };

  return (
    <AdminLayout forceSidebarClosed={true}>
      <div className="flex h-screen">
        {/* Inbox Sidebar */}
        <InboxSidebar
          currentFolder={folderFilter}
          onFolderChange={setFolderFilter}
          onCompose={handleCompose}
          emailCounts={{
            inbox: emails.filter((e) => e.folder === "inbox").length,
            sent: emails.filter((e) => e.folder === "sent").length,
            drafts: emails.filter((e) => e.folder === "drafts").length,
            trash: emails.filter((e) => e.folder === "trash").length,
            spam: emails.filter((e) => e.folder === "spam").length,
            starred: emails.filter((e) => e.isStarred).length,
            important: emails.filter((e) => e.isImportant).length,
          }}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <MainContent>
            <div className="p-1">
              {/* Filters */}
              <Card className="mb-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-64">
                      <AntSearch
                        placeholder="Search emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                      />
                    </div>
                    <Select
                      placeholder="Priority"
                      value={priorityFilter}
                      onChange={setPriorityFilter}
                      style={{ width: 120 }}
                      options={[
                        { value: "all", label: "All Priorities" },
                        { value: "low", label: "Low" },
                        { value: "normal", label: "Normal" },
                        { value: "high", label: "High" },
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
                        { value: "starred", label: "Starred" },
                        { value: "important", label: "Important" },
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
                        {selectedRowKeys.length} email(s) selected
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
                          icon={<Star className="h-4 w-4" />}
                          onClick={() => handleBulkAction("star")}
                        >
                          Star
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
              {/* Header with Tabs */}
              <div className="mb-4">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="custom-tabs"
                  items={[
                    {
                      key: "all",
                      label: (
                        <span className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          <Inbox className="h-4 w-4" />
                          <span>All</span>
                        </span>
                      ),
                    },
                    {
                      key: "order",
                      label: (
                        <span className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Order</span>
                        </span>
                      ),
                    },
                    {
                      key: "sample",
                      label: (
                        <span className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                          <FileText className="h-4 w-4" />
                          <span>Sample</span>
                        </span>
                      ),
                    },
                    {
                      key: "inventory",
                      label: (
                        <span className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                          <FileText className="h-4 w-4" />
                          <span>Inventory</span>
                        </span>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Emails Table */}
              <Card>
                <Table
                  columns={columns}
                  dataSource={filteredEmails}
                  rowKey="id"
                  rowSelection={rowSelection}
                  loading={loading}
                  pagination={{
                    total: filteredEmails.length,
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} emails`,
                  }}
                  scroll={{ x: 800 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No emails found"
                      />
                    ),
                  }}
                />
              </Card>

              {/* Email Detail Drawer */}
              <Drawer
                title="Email Details"
                placement="right"
                onClose={() => setEmailDrawerVisible(false)}
                open={emailDrawerVisible}
                width="33.333333%"
                className="email-drawer"
              >
                {selectedEmail && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar size="large" src={selectedEmail.sender.avatar}>
                          {selectedEmail.sender.name.charAt(0)}
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {selectedEmail.sender.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedEmail.sender.email}
                          </div>
                        </div>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            selectedEmail.isStarred ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )
                          }
                          onClick={() => handleStarToggle(selectedEmail.id)}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<Reply className="h-4 w-4" />}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<ReplyAll className="h-4 w-4" />}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => handleDelete([selectedEmail.id])}
                        />
                      </Space>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <Tag color={getPriorityColor(selectedEmail.priority)}>
                          {selectedEmail.priority}
                        </Tag>
                        {selectedEmail.labels.map((label) => (
                          <Tag key={label} color="blue">
                            {label}
                          </Tag>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {dayjs(selectedEmail.receivedAt).format(
                          "MMMM DD, YYYY [at] h:mm A",
                        )}
                      </div>
                    </div>

                    <Divider />

                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {selectedEmail.body}
                      </div>
                    </div>

                    {selectedEmail.hasAttachments &&
                      selectedEmail.attachments && (
                        <>
                          <Divider />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Attachments
                            </h4>
                            <div className="space-y-2">
                              {selectedEmail.attachments.map(
                                (attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                                  >
                                    <Paperclip className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">
                                      {attachment.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({attachment.size})
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                )}
              </Drawer>

              {/* Compose Email Modal */}
              <Modal
                title="Compose Email"
                open={composeModalVisible}
                onCancel={() => setComposeModalVisible(false)}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => setComposeModalVisible(false)}
                  >
                    Cancel
                  </Button>,
                  <Button key="send" type="primary" onClick={handleSendEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>,
                ]}
                width={800}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To *
                    </label>
                    <Input
                      value={composeEmail.to}
                      onChange={(e) =>
                        setComposeEmail({ ...composeEmail, to: e.target.value })
                      }
                      placeholder="recipient@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CC
                    </label>
                    <Input
                      value={composeEmail.cc}
                      onChange={(e) =>
                        setComposeEmail({ ...composeEmail, cc: e.target.value })
                      }
                      placeholder="cc@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BCC
                    </label>
                    <Input
                      value={composeEmail.bcc}
                      onChange={(e) =>
                        setComposeEmail({
                          ...composeEmail,
                          bcc: e.target.value,
                        })
                      }
                      placeholder="bcc@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <Input
                      value={composeEmail.subject}
                      onChange={(e) =>
                        setComposeEmail({
                          ...composeEmail,
                          subject: e.target.value,
                        })
                      }
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <Select
                      value={composeEmail.priority}
                      onChange={(value) =>
                        setComposeEmail({ ...composeEmail, priority: value })
                      }
                      style={{ width: 200 }}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "normal", label: "Normal" },
                        { value: "high", label: "High" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <TextArea
                      value={composeEmail.body}
                      onChange={(e) =>
                        setComposeEmail({
                          ...composeEmail,
                          body: e.target.value,
                        })
                      }
                      placeholder="Type your message here..."
                      rows={8}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </MainContent>
        </div>
      </div>
    </AdminLayout>
  );
}
