"use client";

import {
  Avatar as AntAvatar,
  Button as AntButton,
  Input as AntInput,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  Upload,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Crown,
  Download,
  Edit,
  Eye,
  Filter,
  Globe,
  HelpCircle,
  Home,
  Key,
  LogIn,
  Mail,
  Mail as MailIcon,
  MapPin,
  MessageSquare as MessageSquareIcon,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Star,
  Trash2,
  Upload as UploadIcon,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { UsersService } from "@/lib/api/services/usersService";

const { Search: AntSearch } = AntInput;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data for roles and permissions
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access",
    color: "red",
    permissions: [
      "dashboard.view",
      "dashboard.edit",
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "roles.view",
      "roles.create",
      "roles.edit",
      "roles.delete",
      "permissions.view",
      "permissions.assign",
      "settings.view",
      "settings.edit",
      "reports.view",
      "reports.generate",
      "analytics.view",
      "backup.create",
      "logs.view",
      "notifications.send",
    ],
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access",
    color: "orange",
    permissions: [
      "dashboard.view",
      "dashboard.edit",
      "users.view",
      "users.create",
      "users.edit",
      "roles.view",
      "permissions.view",
      "settings.view",
      "reports.view",
      "reports.generate",
      "analytics.view",
      "logs.view",
    ],
  },
  {
    id: "3",
    name: "Manager",
    description: "Management level access",
    color: "blue",
    permissions: [
      "dashboard.view",
      "users.view",
      "reports.view",
      "reports.generate",
      "analytics.view",
    ],
  },
  {
    id: "4",
    name: "Employee",
    description: "Standard employee access",
    color: "green",
    permissions: ["dashboard.view", "users.view"],
  },
  {
    id: "5",
    name: "Viewer",
    description: "Read-only access",
    color: "gray",
    permissions: ["dashboard.view", "users.view", "reports.view"],
  },
  {
    id: "6",
    name: "HR Manager",
    description: "Human resources management",
    color: "purple",
    permissions: [
      "dashboard.view",
      "users.view",
      "users.create",
      "users.edit",
      "reports.view",
      "reports.generate",
    ],
  },
  {
    id: "7",
    name: "Finance Manager",
    description: "Financial management access",
    color: "cyan",
    permissions: [
      "dashboard.view",
      "reports.view",
      "reports.generate",
      "analytics.view",
    ],
  },
  {
    id: "8",
    name: "Sales Manager",
    description: "Sales management access",
    color: "magenta",
    permissions: [
      "dashboard.view",
      "users.view",
      "reports.view",
      "reports.generate",
      "analytics.view",
    ],
  },
];

const mockPermissions = [
  {
    id: "dashboard.view",
    name: "Dashboard View",
    description: "View dashboard content",
    module: "Dashboard",
  },
  {
    id: "dashboard.edit",
    name: "Dashboard Edit",
    description: "Edit dashboard layout",
    module: "Dashboard",
  },
  {
    id: "users.view",
    name: "Users View",
    description: "View user list",
    module: "User Management",
  },
  {
    id: "users.create",
    name: "Users Create",
    description: "Create new users",
    module: "User Management",
  },
  {
    id: "users.edit",
    name: "Users Edit",
    description: "Edit user information",
    module: "User Management",
  },
  {
    id: "users.delete",
    name: "Users Delete",
    description: "Delete users",
    module: "User Management",
  },
  {
    id: "roles.view",
    name: "Roles View",
    description: "View roles",
    module: "Role Management",
  },
  {
    id: "roles.create",
    name: "Roles Create",
    description: "Create new roles",
    module: "Role Management",
  },
  {
    id: "roles.edit",
    name: "Roles Edit",
    description: "Edit roles",
    module: "Role Management",
  },
  {
    id: "roles.delete",
    name: "Roles Delete",
    description: "Delete roles",
    module: "Role Management",
  },
  {
    id: "permissions.view",
    name: "Permissions View",
    description: "View permissions",
    module: "Permission Management",
  },
  {
    id: "permissions.assign",
    name: "Permissions Assign",
    description: "Assign permissions",
    module: "Permission Management",
  },
  {
    id: "settings.view",
    name: "Settings View",
    description: "View system settings",
    module: "System Settings",
  },
  {
    id: "settings.edit",
    name: "Settings Edit",
    description: "Edit system settings",
    module: "System Settings",
  },
  {
    id: "reports.view",
    name: "Reports View",
    description: "View reports",
    module: "Reports",
  },
  {
    id: "reports.generate",
    name: "Reports Generate",
    description: "Generate reports",
    module: "Reports",
  },
  {
    id: "analytics.view",
    name: "Analytics View",
    description: "View analytics",
    module: "Analytics",
  },
  {
    id: "backup.create",
    name: "Backup Create",
    description: "Create system backups",
    module: "System Maintenance",
  },
  {
    id: "logs.view",
    name: "Logs View",
    description: "View system logs",
    module: "System Logs",
  },
  {
    id: "notifications.send",
    name: "Notifications Send",
    description: "Send notifications",
    module: "Notifications",
  },
];

// Generate dummy data for 100 users
const generateDummyUsers = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "James",
    "Jessica",
    "Robert",
    "Ashley",
    "William",
    "Amanda",
    "Richard",
    "Jennifer",
    "Charles",
    "Lisa",
    "Joseph",
    "Nancy",
    "Thomas",
    "Karen",
    "Christopher",
    "Betty",
    "Daniel",
    "Helen",
    "Matthew",
    "Sandra",
    "Anthony",
    "Donna",
    "Mark",
    "Carol",
    "Donald",
    "Ruth",
    "Steven",
    "Sharon",
    "Paul",
    "Michelle",
    "Andrew",
    "Laura",
    "Joshua",
    "Sarah",
    "Kenneth",
    "Kimberly",
    "Kevin",
    "Deborah",
    "Brian",
    "Dorothy",
    "George",
    "Lisa",
    "Timothy",
    "Nancy",
    "Ronald",
    "Karen",
    "Jason",
    "Betty",
    "Edward",
    "Helen",
    "Jeffrey",
    "Sandra",
    "Ryan",
    "Donna",
    "Jacob",
    "Carol",
    "Gary",
    "Ruth",
    "Nicholas",
    "Sharon",
    "Eric",
    "Michelle",
    "Jonathan",
    "Laura",
    "Stephen",
    "Sarah",
    "Larry",
    "Kimberly",
    "Justin",
    "Deborah",
    "Scott",
    "Dorothy",
    "Brandon",
    "Lisa",
    "Benjamin",
    "Nancy",
    "Samuel",
    "Karen",
    "Gregory",
    "Betty",
    "Alexander",
    "Helen",
    "Patrick",
    "Sandra",
    "Jack",
    "Donna",
    "Dennis",
    "Carol",
    "Jerry",
    "Ruth",
    "Tyler",
    "Sharon",
    "Aaron",
    "Michelle",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
  ];

  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "company.com",
    "business.org",
  ];
  const genders = ["Male", "Female", "Other"];
  const statuses = ["online", "offline"];

  return Array.from({ length: 100 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate phone number
    const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

    // Generate last login (random date within last 30 days)
    const lastLogin = dayjs()
      .subtract(Math.floor(Math.random() * 30), "day")
      .subtract(Math.floor(Math.random() * 24), "hour");

    // Generate random roles for user (1-3 roles)
    const userRoles = [];
    const numRoles = Math.floor(Math.random() * 3) + 1;
    const shuffledRoles = [...mockRoles].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numRoles; i++) {
      userRoles.push(shuffledRoles[i]);
    }

    // Generate random permissions for user
    const userPermissions = [];
    const numPermissions = Math.floor(Math.random() * 10) + 5;
    const shuffledPermissions = [...mockPermissions].sort(
      () => 0.5 - Math.random(),
    );
    for (let i = 0; i < numPermissions; i++) {
      userPermissions.push(shuffledPermissions[i]);
    }

    return {
      id: (index + 1).toString(),
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone,
      gender,
      status,
      lastLogin: lastLogin.toDate(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      joinDate: dayjs()
        .subtract(Math.floor(Math.random() * 365), "day")
        .toDate(),
      department: [
        "Engineering",
        "Marketing",
        "Sales",
        "HR",
        "Finance",
        "Operations",
      ][Math.floor(Math.random() * 6)],
      role: ["Admin", "Manager", "Employee", "Intern"][
        Math.floor(Math.random() * 4)
      ],
      location: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
      ][Math.floor(Math.random() * 6)],
      roles: userRoles,
      permissions: userPermissions,
    };
  });
};

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users: usersApi } = useApi();

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  // Debug users state
  console.log("Current users state:", users);
  console.log("Current filteredUsers state:", filteredUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [rolePermissionDrawerOpen, setRolePermissionDrawerOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showRolePermissions, setShowRolePermissions] = useState<string | null>(
    null,
  );
  const [permissionStatus, setPermissionStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (filters: any = {}) => {
    try {
      setLoading(true);
      console.log("Loading users with filters:", filters);
      
      const response = await UsersService.getUsers({
        page: 0,
        limit: 50,
        sortBy: "firstName",
        sortDirection: "asc",
        ...filters,
      });
      console.log("Users API response:", response);
      
      if (response && response.data && response.data.content) {
        // Transform API data to match the expected format
        const transformedUsers = response.data.content.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phoneNumber,
          role: user.role,
          status: user.status || "INACTIVE", // Keep original API status
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}${user.lastName}`,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null, // Keep null if no last login
          joinDate: user.createdAt ? new Date(user.createdAt) : new Date(),
          gender: user.gender || null, // Keep null if no gender
          permissions: [], // Default empty permissions
          roles: [], // Default empty roles
        }));
        
        console.log("Transformed users:", transformedUsers);
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
        console.log("Users state updated, count:", transformedUsers.length);
      } else {
        console.log("No data in response or unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadUsers({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        // Note: gender and department filters would need to be added to the API
        // For now, we'll filter locally for these
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  // Local filtering for fields not supported by API
  useEffect(() => {
    let filtered = users;

    // Gender filter (local filtering since API doesn't support this)
    if (genderFilter !== "all") {
      filtered = filtered.filter((user) => user.gender === genderFilter);
    }

    // Department filter (local filtering since API doesn't support this)
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.department === departmentFilter,
      );
    }

    // Date range filter (local filtering since API doesn't support this)
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter((user) => {
        const userDate = dayjs(user.joinDate);
        return (
          userDate.isAfter(dateRange[0]) && userDate.isBefore(dateRange[1])
        );
      });
    }

    setFilteredUsers(filtered);
  }, [users, genderFilter, departmentFilter, dateRange]);

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/dashboard");
  };

  const _handleStatusChange = (userId: string, status: string) => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, status } : user)),
    );
    toast({
      title: "Status Updated",
      description: `User status changed to ${status}`,
      variant: "default",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted",
      variant: "default",
    });
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({
        ...user,
        joinDate: dayjs(user.joinDate),
        lastLogin: dayjs(user.lastLogin),
      });
      setEditDrawerOpen(true);
    }
  };

  const handleViewUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setViewDrawerOpen(true);
    }
  };

  const handleAddUser = () => {
    form.resetFields();
    setSelectedUser(null);
    setAddDrawerOpen(true);
  };

  const handleSaveUser = async (values: any) => {
    try {
      setLoading(true);
      console.log("handleSaveUser called with values:", values);

      if (selectedUser) {
        // Update existing user
        const updatedUser = {
          id: selectedUser.id,
          ...values,
          avatar:
            values.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.firstName}${values.lastName}`,
          status: values.status || "offline",
          lastLogin: values.lastLogin ? values.lastLogin.toDate() : new Date(),
          joinDate: values.joinDate ? values.joinDate.toDate() : new Date(),
        };

        setUsers(
          users.map((u) => (u.id === selectedUser.id ? updatedUser : u)),
        );
        toast({
          title: "User Updated",
          description: "User has been successfully updated",
          variant: "default",
        });
        setEditDrawerOpen(false);
      } else {
        // Create new user using API
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: values.role || "USER",
          phoneNumber: values.phone, // Form field is "phone"
          status: values.status || "ACTIVE",
          gender: values.gender || null,
          birthDate: values.dateOfBirth ? values.dateOfBirth.toISOString() : null, // Form field is "dateOfBirth"
        };

        console.log("Sending user data:", userData);
        console.log("UserData JSON stringify:", JSON.stringify(userData, null, 2));
        const response = await UsersService.createUser(userData);
        console.log("API response:", response);

        if (response && response.data) {
          // Add the new user to the local state
          const newUser = {
            id: response.data.id || (users.length + 1).toString(),
            ...values,
            avatar:
              values.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.firstName}${values.lastName}`,
            status: response.data.status || "offline",
            lastLogin: values.lastLogin
              ? values.lastLogin.toDate()
              : new Date(),
            joinDate: response.data.createdAt ? new Date(response.data.createdAt) : new Date(),
          };

          setUsers([...users, newUser]);
          toast({
            title: "User Added",
            description: "User has been successfully added",
            variant: "default",
          });
          setAddDrawerOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      });
      toast({
        title: "Error",
        description: `Failed to save user: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "blocked" } : user,
      ),
    );
    toast({
      title: "User Blocked",
      description: "User has been blocked",
      variant: "default",
    });
  };

  const handleUnblockUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "offline" } : user,
      ),
    );
    toast({
      title: "User Unblocked",
      description: "User has been unblocked",
      variant: "default",
    });
  };

  const handleSendResetPassword = (_userId: string) => {
    toast({
      title: "Reset Password Sent",
      description: "Password reset link has been sent to user's email",
      variant: "default",
    });
  };

  const handleLoginAsUser = (_userId: string) => {
    toast({
      title: "Login as User",
      description: "You are now logged in as this user",
      variant: "default",
    });
  };

  const handleManageRolesPermissions = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setSelectedRoles(user.roles?.map((role: any) => role.id) || []);
      setSelectedPermissions(
        user.permissions?.map((perm: any) => perm.id) || [],
      );

      // Initialize permission status (all active by default)
      const statusMap: { [key: string]: boolean } = {};
      user.permissions?.forEach((perm: any) => {
        statusMap[perm.id] = true; // true = active, false = inactive
      });
      setPermissionStatus(statusMap);

      setRolePermissionDrawerOpen(true);
    }
  };

  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleId]);
      // Auto-add all role permissions when role is selected
      const role = mockRoles.find((r) => r.id === roleId);
      if (role) {
        const newPermissions = [
          ...new Set([...selectedPermissions, ...role.permissions]),
        ];
        setSelectedPermissions(newPermissions);

        // Set all new permissions as active by default
        const newStatusMap = { ...permissionStatus };
        role.permissions.forEach((permId) => {
          newStatusMap[permId] = true;
        });
        setPermissionStatus(newStatusMap);
      }
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
      // Remove role permissions when role is unselected
      const role = mockRoles.find((r) => r.id === roleId);
      if (role) {
        setSelectedPermissions(
          selectedPermissions.filter(
            (permId) => !role.permissions.includes(permId),
          ),
        );

        // Remove permission status for unselected role permissions
        const newStatusMap = { ...permissionStatus };
        role.permissions.forEach((permId) => {
          delete newStatusMap[permId];
        });
        setPermissionStatus(newStatusMap);
      }
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
      // Set new permission as active by default
      setPermissionStatus({ ...permissionStatus, [permissionId]: true });
    } else {
      // Remove permission (confirmation handled by Popconfirm)
      const permission = mockPermissions.find((p) => p.id === permissionId);
      const role = mockRoles.find((r) => r.permissions.includes(permissionId));

      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
      // Remove permission status
      const newStatusMap = { ...permissionStatus };
      delete newStatusMap[permissionId];
      setPermissionStatus(newStatusMap);

      if (permission && role) {
        toast({
          title: "Permission Removed",
          description: `Permission "${permission.name}" has been removed from "${role.name}" role`,
          variant: "default",
        });
      }
    }
  };

  const _handlePermissionStatusChange = (
    permissionId: string,
    active: boolean,
  ) => {
    setPermissionStatus({ ...permissionStatus, [permissionId]: active });
    toast({
      title: "Permission Status Updated",
      description: `Permission ${active ? "activated" : "deactivated"}`,
      variant: "default",
    });
  };

  const _getRolePermissions = (roleId: string) => {
    const role = mockRoles.find((r) => r.id === roleId);
    return role ? role.permissions : [];
  };

  const getPermissionsByRole = () => {
    const rolePermissions: { [key: string]: string[] } = {};
    const extraPermissions: string[] = [];

    selectedRoles.forEach((roleId) => {
      const role = mockRoles.find((r) => r.id === roleId);
      if (role) {
        rolePermissions[role.name] = role.permissions.filter((permId) =>
          selectedPermissions.includes(permId),
        );
      }
    });

    // Find extra permissions (not from any role)
    selectedPermissions.forEach((permId) => {
      const isFromRole = selectedRoles.some((roleId) => {
        const role = mockRoles.find((r) => r.id === roleId);
        return role?.permissions.includes(permId);
      });
      if (!isFromRole) {
        extraPermissions.push(permId);
      }
    });

    return { rolePermissions, extraPermissions };
  };

  const _handleSaveRolesPermissions = () => {
    if (selectedUser) {
      const updatedRoles = mockRoles.filter((role) =>
        selectedRoles.includes(role.id),
      );
      const updatedPermissions = mockPermissions.filter((perm) =>
        selectedPermissions.includes(perm.id),
      );

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, roles: updatedRoles, permissions: updatedPermissions }
            : user,
        ),
      );

      toast({
        title: "Roles & Permissions Updated",
        description:
          "User roles and permissions have been successfully updated",
        variant: "default",
      });

      setRolePermissionDrawerOpen(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setGenderFilter("all");
    setDepartmentFilter("all");
    setDateRange(null);
    // Reload users with cleared filters
    loadUsers();
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
      variant: "default",
    });
  };

  const handleRefresh = () => {
    loadUsers({
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
    toast({
      title: "Refreshed",
      description: "User list has been refreshed",
      variant: "default",
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "User",
      key: "user",
      width: 250,
      fixed: "left",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <AntInput
            placeholder="Search users..."
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <AntButton
              type="primary"
              onClick={() => confirm()}
              icon={<Search className="h-4 w-4" />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </AntButton>
            <AntButton
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </AntButton>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <Search className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      onFilter: (value, record) => {
        const searchValue =
          typeof value === "string" ? value.toLowerCase() : "";
        return (
          record.name.toLowerCase().includes(searchValue) ||
          record.email.toLowerCase().includes(searchValue) ||
          record.role.toLowerCase().includes(searchValue)
        );
      },
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={record.avatar} alt={record.name} />
                  <AvatarFallback>
                    {record.firstName[0]}
                    {record.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">{record.name}</p>
                  <p className="text-xs text-gray-500">{record.email}</p>
                  <p className="text-xs text-gray-500">{record.department}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.role}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.roles?.slice(0, 2).map((role: any) => (
                <Tag key={role.id} color={role.color}>
                  {role.name}
                </Tag>
              ))}
              {record.roles?.length > 2 && (
                <Tag color="default">+{record.roles.length - 2}</Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 200,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <AntInput
            placeholder="Search email or phone..."
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <AntButton
              type="primary"
              onClick={() => confirm()}
              icon={<Search className="h-4 w-4" />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </AntButton>
            <AntButton
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </AntButton>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <Search className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      onFilter: (value, record) => {
        const searchValue =
          typeof value === "string" ? value.toLowerCase() : "";
        return (
          record.email.toLowerCase().includes(searchValue) ||
          record.phone.includes(value)
        );
      },
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">{record.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      filters: [
        { text: "ADMIN", value: "ADMIN" },
        { text: "USER", value: "USER" },
        { text: "MANAGER", value: "MANAGER" },
      ],
      onFilter: (value, record) => record.role === value,
      filterIcon: (filtered) => (
        <Filter className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      render: (role) => (
        <Tag
          color={
            role === "ADMIN" ? "red" : role === "USER" ? "blue" : "green"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.gender === value,
      filterIcon: (filtered) => (
        <Filter className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      render: (gender) => (
        <Tag
          color={
            gender === "Male" ? "blue" : gender === "Female" ? "pink" : "purple"
          }
        >
          {gender || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 120,
      sorter: (a, b) => dayjs(a.joinDate).unix() - dayjs(b.joinDate).unix(),
      filterIcon: (filtered) => (
        <Filter className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      render: (date) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 150,
      sorter: (a, b) => {
        if (!a.lastLogin && !b.lastLogin) return 0;
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return dayjs(a.lastLogin).unix() - dayjs(b.lastLogin).unix();
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <AntInput
            placeholder="Search by date..."
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <AntButton
              type="primary"
              onClick={() => confirm()}
              icon={<Search className="h-4 w-4" />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </AntButton>
            <AntButton
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </AntButton>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <Search className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      onFilter: (value, record) => {
        const searchValue =
          typeof value === "string" ? value.toLowerCase() : "";
        if (!record.lastLogin) return searchValue === "never";
        return dayjs(record.lastLogin)
          .format("MMM DD, YYYY")
          .toLowerCase()
          .includes(searchValue);
      },
      render: (date) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{date ? dayjs(date).format("MMM DD, YYYY") : "Never"}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "ACTIVE", value: "ACTIVE" },
        { text: "INACTIVE", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.status === value,
      filterIcon: (filtered) => (
        <Filter className={`h-4 w-4 ${filtered ? "text-blue-500" : ""}`} />
      ),
      render: (status, _record) => (
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span
            className={`text-sm font-medium ${status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}
          >
            {status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AntButton
                  type="text"
                  size="small"
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() => handleViewUser(record.id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>View User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AntButton
                  type="text"
                  size="small"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => handleEditUser(record.id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AntButton
                  type="text"
                  size="small"
                  icon={<UserCog className="h-4 w-4" />}
                  onClick={() => handleManageRolesPermissions(record.id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Roles & Permissions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AntButton
                    type="text"
                    size="small"
                    icon={<Trash2 className="h-4 w-4" />}
                    danger
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete User</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tableProps: TableProps<any> = {
    columns,
    dataSource: filteredUsers,
    loading,
    rowKey: "id",
    scroll: { x: 1200 },
    pagination: {
      total: filteredUsers.length,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    },
  };

  // Generate user activity data
  const generateUserActivity = (_userId: string) => {
    const activities = [
      {
        id: 1,
        action: "Logged in",
        timestamp: dayjs().subtract(1, "hour"),
        type: "login",
      },
      {
        id: 2,
        action: "Updated profile",
        timestamp: dayjs().subtract(2, "hours"),
        type: "update",
      },
      {
        id: 3,
        action: "Changed password",
        timestamp: dayjs().subtract(1, "day"),
        type: "security",
      },
      {
        id: 4,
        action: "Viewed dashboard",
        timestamp: dayjs().subtract(2, "days"),
        type: "view",
      },
      {
        id: 5,
        action: "Downloaded report",
        timestamp: dayjs().subtract(3, "days"),
        type: "download",
      },
    ];
    return activities;
  };

  // Generate dummy data for different tabs
  const generateTabData = (tab: string) => {
    switch (tab) {
      case "settings":
        return {
          notifications: {
            email: true,
            push: false,
            sms: true,
          },
          privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: true,
          },
          preferences: {
            language: "English",
            timezone: "UTC-8",
            dateFormat: "MM/DD/YYYY",
          },
        };
      case "security":
        return {
          twoFactor: false,
          lastPasswordChange: dayjs().subtract(30, "days"),
          loginHistory: [
            {
              id: 1,
              location: "San Francisco, CA",
              ip: "192.168.1.1",
              timestamp: dayjs().subtract(1, "hour"),
              device: "Chrome on Mac",
            },
            {
              id: 2,
              location: "New York, NY",
              ip: "192.168.1.2",
              timestamp: dayjs().subtract(1, "day"),
              device: "Safari on iPhone",
            },
            {
              id: 3,
              location: "Los Angeles, CA",
              ip: "192.168.1.3",
              timestamp: dayjs().subtract(3, "days"),
              device: "Firefox on Windows",
            },
          ],
          activeSessions: 2,
        };
      case "activity":
        return {
          recentActivity: generateUserActivity(selectedUser?.id || "1"),
          loginStats: {
            totalLogins: 156,
            thisMonth: 23,
            lastLogin: dayjs().subtract(1, "hour"),
          },
          actions: [
            {
              id: 1,
              action: "Created project",
              timestamp: dayjs().subtract(2, "hours"),
              type: "create",
            },
            {
              id: 2,
              action: "Updated settings",
              timestamp: dayjs().subtract(4, "hours"),
              type: "update",
            },
            {
              id: 3,
              action: "Shared document",
              timestamp: dayjs().subtract(6, "hours"),
              type: "share",
            },
            {
              id: 4,
              action: "Commented on task",
              timestamp: dayjs().subtract(8, "hours"),
              type: "comment",
            },
          ],
        };
      case "reports":
        return {
          performance: {
            tasksCompleted: 45,
            projectsActive: 3,
            efficiency: 87,
          },
          timeTracking: {
            totalHours: 168,
            thisWeek: 42,
            averagePerDay: 8.4,
          },
          achievements: [
            {
              id: 1,
              title: "Project Master",
              description: "Completed 10 projects",
              date: dayjs().subtract(5, "days"),
            },
            {
              id: 2,
              title: "Team Player",
              description: "Helped 5 team members",
              date: dayjs().subtract(10, "days"),
            },
            {
              id: 3,
              title: "Early Bird",
              description: "Logged in before 8 AM for 7 days",
              date: dayjs().subtract(15, "days"),
            },
          ],
        };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <JiraButton variant="text" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </JiraButton>
            <JiraButton variant="text" onClick={handleHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </JiraButton>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <JiraButton variant="text">
              <Download className="h-4 w-4 mr-2" />
              Export
            </JiraButton>
            <JiraButton variant="create" onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </JiraButton>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Manage system users and their permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.status === "ACTIVE").length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.status === "INACTIVE").length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Filtered</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredUsers.length}
              </p>
            </div>
            <Filter className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <JiraButton variant="text" onClick={handleResetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </JiraButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <AntSearch
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full"
            >
              <Option value="all">All Status</Option>
              <Option value="online">Online</Option>
              <Option value="offline">Offline</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <Select
              value={genderFilter}
              onChange={setGenderFilter}
              className="w-full"
            >
              <Option value="all">All Genders</Option>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-full"
            >
              <Option value="all">All Departments</Option>
              <Option value="Engineering">Engineering</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Sales">Sales</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Operations">Operations</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Date
            </label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
            <JiraButton variant="text" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </JiraButton>
          </div>
        </div>
        <div className="p-4">
          <Table {...tableProps} />
        </div>
      </div>

      {/* Add User Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span>Add New User</span>
          </div>
        }
        placement="right"
        size="large"
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        width="100%"
        className="user-drawer"
        extra={
          <div className="flex space-x-2">
            <JiraButton variant="text" onClick={() => setAddDrawerOpen(false)}>
              Cancel
            </JiraButton>
            <JiraButton variant="create" onClick={async () => {
              console.log("Save User button clicked");
              console.log("Form values before submit:", form.getFieldsValue());
              console.log("Form validation status:", form.getFieldsError());
              
              try {
                const values = await form.validateFields();
                console.log("Form validation passed, values:", values);
                form.submit();
              } catch (error) {
                console.log("Form validation failed:", error);
              }
            }}>
              <Save className="h-4 w-4 mr-2" />
              Save User
            </JiraButton>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log("Form onFinish called with values:", values);
            handleSaveUser(values);
          }}
          onFinishFailed={(errorInfo) => {
            console.log("Form validation failed:", errorInfo);
          }}
          className="space-y-6"
        >
          <Tabs
            defaultActiveKey="personal"
            items={[
              {
                key: "personal",
                label: "Personal Details",
                children: (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true }]}
                      >
                        <AntInput placeholder="Enter first name" />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true }]}
                      >
                        <AntInput placeholder="Enter last name" />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: "email" }]}
                      >
                        <AntInput placeholder="Enter email" />
                      </Form.Item>
                      <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true }]}
                      >
                        <AntInput placeholder="Enter phone number" />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, min: 6 }]}
                      >
                        <AntInput.Password placeholder="Enter password" />
                      </Form.Item>
                      <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Select role">
                          <Option value="USER">User</Option>
                          <Option value="ADMIN">Admin</Option>
                          <Option value="MANAGER">Manager</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Select gender">
                          <Option value="Male">Male</Option>
                          <Option value="Female">Female</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="dateOfBirth" label="Date of Birth">
                        <DatePicker className="w-full" />
                      </Form.Item>
                    </div>
                    <Form.Item name="about" label="About">
                      <AntInput.TextArea
                        rows={4}
                        placeholder="Tell us about yourself"
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "education",
                label: "Education",
                children: (
                  <div className="space-y-4">
                    <Form.Item name="university" label="University">
                      <AntInput placeholder="Enter university name" />
                    </Form.Item>
                    <Form.Item name="degree" label="Degree">
                      <AntInput placeholder="Enter degree" />
                    </Form.Item>
                    <Form.Item name="fieldOfStudy" label="Field of Study">
                      <AntInput placeholder="Enter field of study" />
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="graduationYear" label="Graduation Year">
                        <AntInput placeholder="Enter graduation year" />
                      </Form.Item>
                      <Form.Item name="gpa" label="GPA">
                        <AntInput placeholder="Enter GPA" />
                      </Form.Item>
                    </div>
                  </div>
                ),
              },
              {
                key: "address",
                label: "Address",
                children: (
                  <div className="space-y-4">
                    <Form.Item name="street" label="Street Address">
                      <AntInput placeholder="Enter street address" />
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="city" label="City">
                        <AntInput placeholder="Enter city" />
                      </Form.Item>
                      <Form.Item name="state" label="State">
                        <AntInput placeholder="Enter state" />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item name="zipCode" label="ZIP Code">
                        <AntInput placeholder="Enter ZIP code" />
                      </Form.Item>
                      <Form.Item name="country" label="Country">
                        <AntInput placeholder="Enter country" />
                      </Form.Item>
                    </div>
                  </div>
                ),
              },
              {
                key: "social",
                label: "Social Links",
                children: (
                  <div className="space-y-4">
                    <Form.Item name="website" label="Website">
                      <AntInput placeholder="Enter website URL" />
                    </Form.Item>
                    <Form.Item name="linkedin" label="LinkedIn">
                      <AntInput placeholder="Enter LinkedIn URL" />
                    </Form.Item>
                    <Form.Item name="twitter" label="Twitter">
                      <AntInput placeholder="Enter Twitter URL" />
                    </Form.Item>
                    <Form.Item name="facebook" label="Facebook">
                      <AntInput placeholder="Enter Facebook URL" />
                    </Form.Item>
                    <Form.Item name="instagram" label="Instagram">
                      <AntInput placeholder="Enter Instagram URL" />
                    </Form.Item>
                    <Form.Item name="github" label="GitHub">
                      <AntInput placeholder="Enter GitHub URL" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "work",
                label: "Work Details",
                children: (
                  <div className="space-y-4">
                    <Form.Item
                      name="department"
                      label="Department"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select department">
                        <Option value="Engineering">Engineering</Option>
                        <Option value="Marketing">Marketing</Option>
                        <Option value="Sales">Sales</Option>
                        <Option value="HR">HR</Option>
                        <Option value="Finance">Finance</Option>
                        <Option value="Operations">Operations</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select role">
                        <Option value="Admin">Admin</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Employee">Employee</Option>
                        <Option value="Intern">Intern</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="location" label="Work Location">
                      <AntInput placeholder="Enter work location" />
                    </Form.Item>
                    <Form.Item name="joinDate" label="Join Date">
                      <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                      <Select placeholder="Select status">
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                        <Option value="blocked">Blocked</Option>
                      </Select>
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Drawer>

      {/* Edit User Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <span>Edit User</span>
          </div>
        }
        placement="right"
        size="large"
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width="100%"
        className="user-drawer"
        extra={
          <div className="flex space-x-2">
            <JiraButton variant="text" onClick={() => setEditDrawerOpen(false)}>
              Cancel
            </JiraButton>
            <JiraButton variant="create" onClick={() => form.submit()}>
              <Save className="h-4 w-4 mr-2" />
              Update User
            </JiraButton>
          </div>
        }
      >
        {selectedUser && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveUser}
            className="space-y-6"
          >
            <Tabs
              defaultActiveKey="personal"
              items={[
                {
                  key: "personal",
                  label: "Personal Details",
                  children: (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 mb-6">
                        <AntAvatar size={80} src={selectedUser.avatar} />
                        <div>
                          <Upload
                            {...{
                              name: "avatar",
                              listType: "picture-card",
                              showUploadList: false,
                              beforeUpload: () => false,
                            }}
                          >
                            <Button>
                              <UploadIcon className="h-4 w-4 mr-2" />
                              Change Avatar
                            </Button>
                          </Upload>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          name="firstName"
                          label="First Name"
                          rules={[{ required: true }]}
                        >
                          <AntInput placeholder="Enter first name" />
                        </Form.Item>
                        <Form.Item
                          name="lastName"
                          label="Last Name"
                          rules={[{ required: true }]}
                        >
                          <AntInput placeholder="Enter last name" />
                        </Form.Item>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[{ required: true, type: "email" }]}
                        >
                          <AntInput placeholder="Enter email" />
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          label="Phone"
                          rules={[{ required: true }]}
                        >
                          <AntInput placeholder="Enter phone number" />
                        </Form.Item>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          name="gender"
                          label="Gender"
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="Select gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="Other">Other</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item name="dateOfBirth" label="Date of Birth">
                          <DatePicker className="w-full" />
                        </Form.Item>
                      </div>
                      <Form.Item name="about" label="About">
                        <AntInput.TextArea
                          rows={4}
                          placeholder="Tell us about yourself"
                        />
                      </Form.Item>
                    </div>
                  ),
                },
                {
                  key: "work",
                  label: "Work Details",
                  children: (
                    <div className="space-y-4">
                      <Form.Item
                        name="department"
                        label="Department"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Select department">
                          <Option value="Engineering">Engineering</Option>
                          <Option value="Marketing">Marketing</Option>
                          <Option value="Sales">Sales</Option>
                          <Option value="HR">HR</Option>
                          <Option value="Finance">Finance</Option>
                          <Option value="Operations">Operations</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Select role">
                          <Option value="Admin">Admin</Option>
                          <Option value="Manager">Manager</Option>
                          <Option value="Employee">Employee</Option>
                          <Option value="Intern">Intern</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="location" label="Work Location">
                        <AntInput placeholder="Enter work location" />
                      </Form.Item>
                      <Form.Item name="joinDate" label="Join Date">
                        <DatePicker className="w-full" />
                      </Form.Item>
                      <Form.Item name="status" label="Status">
                        <Select placeholder="Select status">
                          <Option value="active">Active</Option>
                          <Option value="inactive">Inactive</Option>
                          <Option value="blocked">Blocked</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  ),
                },
              ]}
            />
          </Form>
        )}
      </Drawer>

      {/* View User Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>User Profile</span>
          </div>
        }
        placement="right"
        size="large"
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        width="100%"
        className="user-drawer"
        extra={
          <div className="flex space-x-2">
            <JiraButton variant="text" onClick={() => setViewDrawerOpen(false)}>
              Close
            </JiraButton>
            <JiraButton
              variant="create"
              onClick={() => handleEditUser(selectedUser?.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </JiraButton>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`font-medium py-2 px-1 text-sm ${
                    activeTab === "overview"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`font-medium py-2 px-1 text-sm ${
                    activeTab === "settings"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`font-medium py-2 px-1 text-sm ${
                    activeTab === "security"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`font-medium py-2 px-1 text-sm ${
                    activeTab === "activity"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`font-medium py-2 px-1 text-sm ${
                    activeTab === "reports"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <>
                {/* User Profile Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <AntAvatar size={80} src={selectedUser.avatar} />
                        <div
                          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                            selectedUser.status === "online"
                              ? "bg-green-500"
                              : selectedUser.status === "blocked"
                                ? "bg-red-500"
                                : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedUser.name}
                          </h2>
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{selectedUser.role}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedUser.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MailIcon className="h-4 w-4" />
                            <span>{selectedUser.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <JiraButton
                        variant="create"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Upgrade to Pro
                      </JiraButton>
                      <JiraButton variant="text">Follow</JiraButton>
                      <JiraButton variant="text">Hire Me</JiraButton>
                      <JiraButton variant="text">
                        <MoreHorizontal className="h-4 w-4" />
                      </JiraButton>
                    </div>
                  </div>

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ↑ $4,500
                      </div>
                      <div className="text-sm text-gray-600">Earnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        ↓ 75
                      </div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ↑ 60%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Profile Completion
                      </span>
                      <span className="text-sm text-gray-500">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Profile Details
                    </h3>
                    <div className="flex items-center space-x-2">
                      <JiraButton variant="text">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </JiraButton>
                      <JiraButton variant="text">
                        <HelpCircle className="h-4 w-4" />
                      </JiraButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Full Name:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedUser.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Company:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ERP Solutions
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Contact Phone:
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {selectedUser.phone}
                          </span>
                          <Badge color="green" className="text-xs">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Company Site:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          erp-solutions.com
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Country:</span>
                        <span className="text-sm font-medium text-gray-900">
                          United States
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Communication:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          Email, Phone
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Allow Changes:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          Yes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Last Login:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {dayjs(selectedUser.lastLogin).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alert Box */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-yellow-800">
                          <strong>We need your attention!</strong> Your account
                          status is {selectedUser.status}. To ensure full
                          access, please verify your account details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    User Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <JiraButton
                      variant="text"
                      onClick={() => handleSendResetPassword(selectedUser.id)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Key className="h-4 w-4" />
                      <span>Reset Password</span>
                    </JiraButton>
                    <JiraButton
                      variant="text"
                      onClick={() => handleLoginAsUser(selectedUser.id)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login as User</span>
                    </JiraButton>
                    {selectedUser.status === "blocked" ? (
                      <JiraButton
                        onClick={() => handleUnblockUser(selectedUser.id)}
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Unblock</span>
                      </JiraButton>
                    ) : (
                      <JiraButton
                        onClick={() => handleBlockUser(selectedUser.id)}
                        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Block</span>
                      </JiraButton>
                    )}
                    <JiraButton
                      variant="text"
                      onClick={() => handleEditUser(selectedUser.id)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit User</span>
                    </JiraButton>
                  </div>
                </div>
              </>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600">
                          Receive push notifications
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <Select defaultValue="public" className="w-full">
                        <Option value="public">Public</Option>
                        <Option value="private">Private</Option>
                        <Option value="friends">Friends Only</Option>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email</p>
                        <p className="text-sm text-gray-600">
                          Display email address on profile
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Phone</p>
                        <p className="text-sm text-gray-600">
                          Display phone number on profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <Select defaultValue="english" className="w-full">
                        <Option value="english">English</Option>
                        <Option value="spanish">Spanish</Option>
                        <Option value="french">French</Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <Select defaultValue="utc-8" className="w-full">
                        <Option value="utc-8">UTC-8 (PST)</Option>
                        <Option value="utc-5">UTC-5 (EST)</Option>
                        <Option value="utc+0">UTC+0 (GMT)</Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <Select defaultValue="mm/dd/yyyy" className="w-full">
                        <Option value="mm/dd/yyyy">MM/DD/YYYY</Option>
                        <Option value="dd/mm/yyyy">DD/MM/YYYY</Option>
                        <Option value="yyyy-mm-dd">YYYY-MM-DD</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Password Change</p>
                        <p className="text-sm text-gray-600">30 days ago</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Change Password
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-gray-600">
                          2 active sessions
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage Sessions
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Login History
                  </h3>
                  <div className="space-y-3">
                    {generateTabData("security")?.loginHistory?.map(
                      (login: any) => (
                        <div
                          key={login.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-sm">
                                {login.location}
                              </p>
                              <p className="text-xs text-gray-600">
                                {login.device}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{login.ip}</p>
                            <p className="text-xs text-gray-600">
                              {login.timestamp.format("MMM DD, HH:mm")}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Login Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        156
                      </div>
                      <div className="text-sm text-gray-600">Total Logins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        23
                      </div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        1h
                      </div>
                      <div className="text-sm text-gray-600">Last Login</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <Timeline
                    items={generateTabData("activity")?.actions?.map(
                      (action: any) => ({
                        dot:
                          action.type === "create" ? (
                            <Plus className="h-4 w-4 text-green-500" />
                          ) : action.type === "update" ? (
                            <Edit className="h-4 w-4 text-blue-500" />
                          ) : action.type === "share" ? (
                            <User className="h-4 w-4 text-purple-500" />
                          ) : (
                            <MessageSquareIcon className="h-4 w-4 text-orange-500" />
                          ),
                        children: (
                          <div>
                            <p className="font-medium">{action.action}</p>
                            <p className="text-sm text-gray-500">
                              {action.timestamp.format("MMM DD, YYYY HH:mm")}
                            </p>
                          </div>
                        ),
                      }),
                    )}
                  />
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        45
                      </div>
                      <div className="text-sm text-gray-600">
                        Tasks Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-gray-600">
                        Active Projects
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        87%
                      </div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Time Tracking
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        168h
                      </div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">
                        42h
                      </div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">
                        8.4h
                      </div>
                      <div className="text-sm text-gray-600">Avg/Day</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    {generateTabData("reports")?.achievements?.map(
                      (achievement: any) => (
                        <div
                          key={achievement.id}
                          className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {achievement.date.format("MMM DD")}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Role & Permission Management Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <UserCog className="h-5 w-5 text-blue-600" />
            <span>Manage Roles & Permissions</span>
          </div>
        }
        placement="right"
        size="large"
        open={rolePermissionDrawerOpen}
        onClose={() => setRolePermissionDrawerOpen(false)}
        width="100%"
        className="user-drawer"
        extra={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setRolePermissionDrawerOpen(false)}
            >
              Cancel
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <AntAvatar size={60} src={selectedUser.avatar} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.department} • {selectedUser.role}
                  </p>
                </div>
              </div>
            </div>

            <Tabs
              defaultActiveKey="roles"
              items={[
                {
                  key: "roles",
                  label: "Roles",
                  children: (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Assign Roles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockRoles.map((role) => (
                            <div
                              key={role.id}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`role-${role.id}`}
                                  checked={selectedRoles.includes(role.id)}
                                  onChange={(e) =>
                                    handleRoleChange(role.id, e.target.checked)
                                  }
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Tag color={role.color}>{role.name}</Tag>
                                      {role.name === "Super Admin" && (
                                        <Crown className="h-4 w-4 text-yellow-500" />
                                      )}
                                      {role.name === "Admin" && (
                                        <Star className="h-4 w-4 text-orange-500" />
                                      )}
                                    </div>
                                    <button
                                      onClick={() =>
                                        setShowRolePermissions(
                                          showRolePermissions === role.id
                                            ? null
                                            : role.id,
                                        )
                                      }
                                      className="p-1 hover:bg-gray-200 rounded"
                                    >
                                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {role.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {role.permissions.length} permissions
                                    included
                                  </p>
                                </div>
                              </div>

                              {/* Role Permissions Table */}
                              {showRolePermissions === role.id && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-sm font-medium text-gray-700">
                                      Role Permissions:
                                    </h5>
                                    <AntButton
                                      size="small"
                                      type="primary"
                                      onClick={() => {
                                        toast({
                                          title: "Role Permissions Updated",
                                          description: `Permissions for ${role.name} role have been saved successfully`,
                                          variant: "default",
                                        });
                                      }}
                                      className="text-xs px-3"
                                    >
                                      <Save className="h-3 w-3 mr-1" />
                                      Save Changes
                                    </AntButton>
                                  </div>
                                  <Table
                                    size="small"
                                    dataSource={role.permissions.map(
                                      (permId) => {
                                        const permission = mockPermissions.find(
                                          (p) => p.id === permId,
                                        );
                                        return {
                                          key: permId,
                                          id: permId,
                                          name: permission?.name || "",
                                          description:
                                            permission?.description || "",
                                          module: permission?.module || "",
                                          selected:
                                            selectedPermissions.includes(
                                              permId,
                                            ),
                                          active:
                                            permissionStatus[permId] || false,
                                        };
                                      },
                                    )}
                                    columns={[
                                      {
                                        title: "Select",
                                        dataIndex: "selected",
                                        width: 60,
                                        render: (selected, record) =>
                                          selected ? (
                                            <Popconfirm
                                              title="Remove Permission"
                                              description={`Are you sure you want to remove "${record.name}" permission?`}
                                              onConfirm={() =>
                                                handlePermissionChange(
                                                  record.id,
                                                  false,
                                                )
                                              }
                                              okText="Yes"
                                              cancelText="No"
                                            >
                                              <Checkbox
                                                checked={selected}
                                                onChange={(e) => {
                                                  if (!e.target.checked) {
                                                    // The Popconfirm will handle the actual removal
                                                    return;
                                                  }
                                                  handlePermissionChange(
                                                    record.id,
                                                    e.target.checked,
                                                  );
                                                }}
                                              />
                                            </Popconfirm>
                                          ) : (
                                            <Checkbox
                                              checked={selected}
                                              onChange={(e) =>
                                                handlePermissionChange(
                                                  record.id,
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                          ),
                                      },
                                      {
                                        title: "Description",
                                        dataIndex: "description",
                                        render: (description) => (
                                          <span className="text-xs text-gray-600">
                                            {description}
                                          </span>
                                        ),
                                      },
                                      {
                                        title: "Permission Name",
                                        dataIndex: "name",
                                        render: (name, record) => (
                                          <div>
                                            <div className="font-medium text-sm">
                                              {name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {record.id}
                                            </div>
                                          </div>
                                        ),
                                      },
                                      {
                                        title: "Module Name",
                                        dataIndex: "module",
                                        render: (module) => (
                                          <Tag color="blue">{module}</Tag>
                                        ),
                                      },
                                    ]}
                                    pagination={{
                                      pageSize: 20,
                                      showSizeChanger: true,
                                      showQuickJumper: true,
                                      showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} permissions`,
                                      pageSizeOptions: [
                                        "10",
                                        "20",
                                        "50",
                                        "100",
                                      ],
                                    }}
                                    className="role-permissions-table"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Roles Summary */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Current Roles ({selectedRoles.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoles.map((roleId) => {
                            const role = mockRoles.find((r) => r.id === roleId);
                            return role ? (
                              <Tag
                                key={role.id}
                                color={role.color}
                                className="flex items-center space-x-1"
                              >
                                <span>{role.name}</span>
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleRoleChange(role.id, false)
                                  }
                                />
                              </Tag>
                            ) : null;
                          })}
                          {selectedRoles.length === 0 && (
                            <p className="text-sm text-gray-500">
                              No roles assigned
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "permissions",
                  label: "Permissions",
                  children: (
                    <div className="space-y-4">
                      {/* Role-based Permissions */}
                      {(() => {
                        const { rolePermissions, extraPermissions } =
                          getPermissionsByRole();
                        return (
                          <>
                            {Object.keys(rolePermissions).map((roleName) => {
                              const role = mockRoles.find(
                                (r) => r.name === roleName,
                              );
                              const permissions = rolePermissions[roleName];
                              return (
                                <div
                                  key={roleName}
                                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                                >
                                  <div className="flex items-center space-x-2 mb-4">
                                    <Tag color={role?.color}>{roleName}</Tag>
                                    <span className="text-sm text-gray-600">
                                      ({permissions.length} permissions)
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {permissions.map((permissionId) => {
                                      const permission = mockPermissions.find(
                                        (p) => p.id === permissionId,
                                      );
                                      return permission ? (
                                        <div
                                          key={permission.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                        >
                                          <div>
                                            <p className="text-sm font-medium">
                                              {permission.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {permission.id}
                                            </p>
                                          </div>
                                          <X
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() =>
                                              handlePermissionChange(
                                                permission.id,
                                                false,
                                              )
                                            }
                                          />
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Extra Permissions */}
                            {extraPermissions.length > 0 && (
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center space-x-2 mb-4">
                                  <Tag color="purple">Extra Permissions</Tag>
                                  <span className="text-sm text-gray-600">
                                    ({extraPermissions.length} permissions)
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {extraPermissions.map((permissionId) => {
                                    const permission = mockPermissions.find(
                                      (p) => p.id === permissionId,
                                    );
                                    return permission ? (
                                      <div
                                        key={permission.id}
                                        className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200"
                                      >
                                        <div>
                                          <p className="text-sm font-medium">
                                            {permission.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {permission.id}
                                          </p>
                                        </div>
                                        <X
                                          className="h-4 w-4 cursor-pointer hover:text-red-500"
                                          onClick={() =>
                                            handlePermissionChange(
                                              permission.id,
                                              false,
                                            )
                                          }
                                        />
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}

                            {selectedPermissions.length === 0 && (
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">
                                  No permissions assigned
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Select roles to automatically assign
                                  permissions
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* All Available Permissions */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          All Available Permissions
                        </h4>
                        <div className="space-y-3">
                          {mockPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id,
                                )}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    permission.id,
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {permission.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {permission.description}
                                    </p>
                                  </div>
                                  <Tag color="blue">{permission.id}</Tag>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
