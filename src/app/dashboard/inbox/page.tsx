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
  User,
  AtSign,
  MessageSquare,
  Forward,
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
  Tooltip,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
    // General subjects
    "Project Update - Q4 Planning",
    "Meeting Reminder - Tomorrow at 2 PM",
    "Budget Approval Required",
    "New Feature Release Notes",
    "Client Feedback Summary",
    "System Maintenance Schedule",
    "Team Building Event",
    "Quarterly Review Results",
    "Security Alert - Password Reset",
    "Contract Renewal Discussion",
    "Training Session Invitation",
    "Performance Metrics Report",
    "Holiday Schedule Update",
    "Equipment Request Form",

    // Order-related subjects
    "Order Confirmation #ORD-001",
    "Purchase Order Approval Required",
    "Invoice #12345 - Payment Due",
    "Order Status Update - Shipped",
    "Payment Received - Order #ORD-002",
    "Order Cancellation Request",
    "Bulk Order Processing",
    "Order Delivery Confirmation",
    "Purchase Order Modification",
    "Order Refund Processed",

    // Sample-related subjects
    "Sample Product Request",
    "Demo Session Scheduled",
    "Trial Period Extension",
    "Sample Feedback Required",
    "Test Results Available",
    "Demo Account Setup",
    "Sample Product Shipped",
    "Trial Account Expiring Soon",
    "Sample Review Meeting",
    "Demo Environment Access",

    // Inventory-related subjects
    "Inventory Stock Alert",
    "Product Stock Update",
    "Warehouse Inventory Report",
    "Low Stock Warning - Product ABC",
    "Inventory Count Scheduled",
    "Product Restock Notification",
    "Warehouse Capacity Alert",
    "Inventory Audit Results",
    "Product Discontinuation Notice",
    "Stock Transfer Request",
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
  const [newComment, setNewComment] = useState("");
  const [commentMention, setCommentMention] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [comments, setComments] = useState<
    Array<{
      id: string;
      author: string;
      authorEmail: string;
      content: string;
      timestamp: string;
      mentions: string[];
    }>
  >([]);

  // Mock users for mentions
  const mentionUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@company.com",
      username: "john.smith",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@techcorp.com",
      username: "sarah.j",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@startup.io",
      username: "mike.chen",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@enterprise.com",
      username: "emily.davis",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "d.wilson@business.net",
      username: "d.wilson",
    },
    {
      id: "6",
      name: "Lisa Brown",
      email: "lisa.brown@corp.org",
      username: "lisa.brown",
    },
    {
      id: "7",
      name: "Tom Anderson",
      email: "tom.anderson@company.com",
      username: "tom.anderson",
    },
    {
      id: "8",
      name: "Anna Garcia",
      email: "anna.garcia@tech.com",
      username: "anna.garcia",
    },
  ];

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
    activeTab,
  ]);

  const filterEmails = () => {
    let filtered = [...emails];

    // Folder filter
    filtered = filtered.filter((email) => email.folder === folderFilter);

    // Tab filter - show different data based on active tab
    if (activeTab === "order") {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes("order") ||
          email.subject.toLowerCase().includes("purchase") ||
          email.subject.toLowerCase().includes("invoice") ||
          email.subject.toLowerCase().includes("payment") ||
          email.body.toLowerCase().includes("order") ||
          email.body.toLowerCase().includes("purchase"),
      );
    } else if (activeTab === "sample") {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes("sample") ||
          email.subject.toLowerCase().includes("demo") ||
          email.subject.toLowerCase().includes("test") ||
          email.subject.toLowerCase().includes("trial") ||
          email.body.toLowerCase().includes("sample") ||
          email.body.toLowerCase().includes("demo"),
      );
    } else if (activeTab === "inventory") {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes("inventory") ||
          email.subject.toLowerCase().includes("stock") ||
          email.subject.toLowerCase().includes("warehouse") ||
          email.subject.toLowerCase().includes("product") ||
          email.body.toLowerCase().includes("inventory") ||
          email.body.toLowerCase().includes("stock"),
      );
    }
    // "all" tab shows all emails (no additional filtering)

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

  const handleAddComment = () => {
    if (!editorContent.trim()) {
      message.error("Please enter a comment");
      return;
    }

    // Extract mentions from HTML content
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(editorContent)) !== null) {
      mentions.push(match[1]);
    }

    const newCommentObj = {
      id: Date.now().toString(),
      author: "You",
      authorEmail: "admin@erp.com",
      content: editorContent,
      timestamp: new Date().toISOString(),
      mentions: mentions,
    };

    setComments((prev) => [...prev, newCommentObj]);
    setEditorContent("");

    // Send notifications to mentioned users
    if (mentions.length > 0) {
      message.success(`Comment added and ${mentions.length} user(s) notified`);
    } else {
      message.success("Comment added");
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);

    // Check for @ mentions in plain text
    const textContent = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const cursorPos = textContent.lastIndexOf("@");
    if (cursorPos !== -1) {
      const textAfterAt = textContent.substring(cursorPos + 1);
      const nextSpace = textAfterAt.indexOf(" ");

      if (nextSpace === -1 || nextSpace > 20) {
        const mentionText =
          nextSpace === -1 ? textAfterAt : textAfterAt.substring(0, nextSpace);
        if (mentionText.length > 0 && mentionText.length < 20) {
          setCommentMention(mentionText);
          setShowMentionDropdown(true);
          return;
        }
      }
    }

    setShowMentionDropdown(false);
  };

  const insertMention = (username: string) => {
    const currentContent = editorContent;
    const cursorPos = currentContent.lastIndexOf("@" + commentMention);
    const beforeMention = currentContent.substring(0, cursorPos);
    const afterMention = currentContent.substring(
      cursorPos + commentMention.length + 1,
    );

    const newContent = beforeMention + "@" + username + " " + afterMention;
    setEditorContent(newContent);
    setShowMentionDropdown(false);
    setCommentMention("");
  };

  // Filter users based on mention input
  const filteredMentionUsers = mentionUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(commentMention.toLowerCase()) ||
      user.email.toLowerCase().includes(commentMention.toLowerCase()) ||
      user.username.toLowerCase().includes(commentMention.toLowerCase()),
  );

  // React Quill configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "blockquote",
    "code-block",
  ];

  // Render HTML content for comments
  const renderCommentContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
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
                  items={[
                    {
                      key: "all",
                      label: (
                        <span className="flex items-center space-x-2">
                          <Inbox className="h-4 w-4" />
                          <span>All</span>
                        </span>
                      ),
                    },
                    {
                      key: "order",
                      label: (
                        <span className="flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Order</span>
                        </span>
                      ),
                    },
                    {
                      key: "sample",
                      label: (
                        <span className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Sample</span>
                        </span>
                      ),
                    },
                    {
                      key: "inventory",
                      label: (
                        <span className="flex items-center space-x-2">
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
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} emails`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                  }}
                  scroll={{ x: 800, y: 600 }}
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
                width="50%"
                className="email-drawer"
              >
                {selectedEmail && (
                  <div className="space-y-6">
                    {/* Header with Actions */}
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
                          icon={<Forward className="h-4 w-4" />}
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

                    {/* Subject and Metadata */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
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

                    {/* Recipients Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Recipients
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 w-12">To:</span>
                          <span className="text-gray-700">
                            {selectedEmail.recipients.join(", ")}
                          </span>
                        </div>
                        {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 w-12">CC:</span>
                            <span className="text-gray-700">
                              {selectedEmail.cc.join(", ")}
                            </span>
                          </div>
                        )}
                        {selectedEmail.bcc && selectedEmail.bcc.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 w-12">BCC:</span>
                            <span className="text-gray-700">
                              {selectedEmail.bcc.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {/* Email Body */}
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">
                        {selectedEmail.body}
                      </div>
                    </div>

                    {/* Attachments */}
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

                    <Divider />

                    {/* Comments Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comments ({comments.length})
                      </h4>

                      {/* Add Comment */}
                      <div className="mb-4">
                        <div className="relative">
                          <div className="border border-gray-200 rounded-md">
                            <ReactQuill
                              theme="snow"
                              value={editorContent}
                              onChange={handleEditorChange}
                              modules={quillModules}
                              formats={quillFormats}
                              placeholder="Add a comment... Use @username to mention someone"
                              style={{
                                height: "200px",
                                fontFamily:
                                  "-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          {showMentionDropdown && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                              <div className="p-2">
                                <div className="text-xs text-gray-500 mb-2 font-medium">
                                  Mention users:
                                </div>
                                {filteredMentionUsers.length > 0 ? (
                                  filteredMentionUsers.map((user) => (
                                    <div
                                      key={user.id}
                                      className="p-3 hover:bg-gray-50 cursor-pointer rounded text-sm border-b border-gray-100 last:border-b-0"
                                      onClick={() =>
                                        insertMention(user.username)
                                      }
                                    >
                                      <div className="flex items-center space-x-3">
                                        <Avatar
                                          size="small"
                                          className="bg-blue-500"
                                        >
                                          {user.name.charAt(0)}
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">
                                            {user.name}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {user.email}
                                          </div>
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium">
                                          @{user.username}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm text-gray-500 text-center">
                                    No users found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-500">
                            Use @ to mention users • Rich text editor with full
                            formatting
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            onClick={handleAddComment}
                            disabled={!editorContent.trim()}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Add Comment
                          </Button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="border-l-2 border-blue-200 pl-4"
                          >
                            <div className="flex items-start space-x-2 mb-2">
                              <Avatar size="small" className="bg-blue-500">
                                {comment.author.charAt(0)}
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">
                                    {comment.author}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {dayjs(comment.timestamp).format(
                                      "MMM DD, h:mm A",
                                    )}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1 prose prose-sm max-w-none">
                                  {renderCommentContent(comment.content)}
                                </div>
                                {comment.mentions.length > 0 && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <AtSign className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      Mentioned: {comment.mentions.join(", ")}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
