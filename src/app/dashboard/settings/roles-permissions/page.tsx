"use client";

import {
  Button as AntButton,
  Drawer,
  Popconfirm,
  Space,
  Switch,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeft,
  Edit,
  Home,
  Key,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Mock data for roles
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    isActive: true,
    userCount: 2,
    createdAt: "2024-01-15",
    permissions: {
      modules: ["1", "2", "3", "4"],
      individual: [
        "dashboard.view",
        "dashboard.edit",
        "dashboard.delete",
        "users.view",
        "users.create",
        "users.edit",
        "users.delete",
        "sales.view",
        "sales.create",
        "sales.edit",
        "sales.delete",
        "analytics.view",
        "analytics.export",
        "analytics.share",
      ],
      extra: ["system.backup", "system.restore", "system.maintenance"],
    },
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access with most permissions",
    isActive: true,
    userCount: 5,
    createdAt: "2024-01-20",
    permissions: {
      modules: ["1", "2", "3"],
      individual: [
        "dashboard.view",
        "dashboard.edit",
        "users.view",
        "users.create",
        "users.edit",
        "sales.view",
        "sales.create",
        "sales.edit",
      ],
      extra: ["users.manage", "settings.view"],
    },
  },
  {
    id: "3",
    name: "Manager",
    description: "Management level access for team oversight",
    isActive: true,
    userCount: 12,
    createdAt: "2024-02-01",
    permissions: {
      modules: ["1", "2"],
      individual: [
        "dashboard.view",
        "dashboard.edit",
        "users.view",
        "users.create",
      ],
      extra: ["reports.view", "analytics.view"],
    },
  },
  {
    id: "4",
    name: "User",
    description: "Basic user access with limited permissions",
    isActive: true,
    userCount: 45,
    createdAt: "2024-02-10",
    permissions: {
      modules: ["1"],
      individual: ["dashboard.view"],
      extra: [],
    },
  },
  {
    id: "5",
    name: "Guest",
    description: "Read-only access for external users",
    isActive: false,
    userCount: 8,
    createdAt: "2024-02-15",
    permissions: {
      modules: [],
      individual: [],
      extra: ["dashboard.view"],
    },
  },
];

// Mock data for modules
const mockModules = [
  {
    id: "1",
    name: "Dashboard",
    description: "Main dashboard module",
    permissions: [
      {
        id: "dashboard.view",
        name: "dashboard.view",
        description: "View dashboard content and widgets",
      },
      {
        id: "dashboard.edit",
        name: "dashboard.edit",
        description: "Edit dashboard layout and settings",
      },
      {
        id: "dashboard.delete",
        name: "dashboard.delete",
        description: "Delete dashboard components",
      },
    ],
  },
  {
    id: "2",
    name: "User Management",
    description: "User management module",
    permissions: [
      {
        id: "users.view",
        name: "users.view",
        description: "View user profiles and information",
      },
      {
        id: "users.create",
        name: "users.create",
        description: "Create new user accounts",
      },
      {
        id: "users.edit",
        name: "users.edit",
        description: "Edit user information and settings",
      },
      {
        id: "users.delete",
        name: "users.delete",
        description: "Delete user accounts",
      },
    ],
  },
  {
    id: "3",
    name: "Sales",
    description: "Sales management module",
    permissions: [
      {
        id: "sales.view",
        name: "sales.view",
        description: "View sales data and reports",
      },
      {
        id: "sales.create",
        name: "sales.create",
        description: "Create new sales records",
      },
      {
        id: "sales.edit",
        name: "sales.edit",
        description: "Edit existing sales records",
      },
      {
        id: "sales.delete",
        name: "sales.delete",
        description: "Delete sales records",
      },
    ],
  },
  {
    id: "4",
    name: "Analytics",
    description: "Analytics and reporting module",
    permissions: [
      {
        id: "analytics.view",
        name: "analytics.view",
        description: "View analytics data and charts",
      },
      {
        id: "analytics.export",
        name: "analytics.export",
        description: "Export analytics reports",
      },
      {
        id: "analytics.share",
        name: "analytics.share",
        description: "Share analytics with other users",
      },
    ],
  },
];

// Mock data for extra permissions
const mockExtraPermissions = [
  {
    id: "system.backup",
    name: "System Backup",
    description: "Create system backups",
  },
  {
    id: "system.restore",
    name: "System Restore",
    description: "Restore system from backup",
  },
  {
    id: "system.maintenance",
    name: "System Maintenance",
    description: "Perform system maintenance",
  },
  { id: "users.manage", name: "Manage Users", description: "Manage all users" },
  {
    id: "settings.view",
    name: "View Settings",
    description: "View system settings",
  },
  { id: "reports.view", name: "View Reports", description: "View all reports" },
  {
    id: "analytics.view",
    name: "View Analytics",
    description: "View analytics data",
  },
  {
    id: "dashboard.view",
    name: "View Dashboard",
    description: "View main dashboard",
  },
];

export default function RolesPermissionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [_activeTab, _setActiveTab] = useState("roles");
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    isActive: true,
    permissions: {
      modules: [] as string[],
      individual: [] as string[],
      extra: [] as string[],
    },
  });

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      const role = {
        id: Date.now().toString(),
        ...newRole,
        userCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles([...roles, role]);
      setNewRole({
        name: "",
        description: "",
        isActive: true,
        permissions: { modules: [], individual: [], extra: [] },
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `Role "${role.name}" has been added successfully`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(roles.map((r) => (r.id === editingRole.id ? editingRole : r)));
      setEditingRole(null);
      toast({
        title: "Success",
        description: `Role "${editingRole.name}" has been updated successfully`,
        variant: "default",
      });
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    setRoles(roles.filter((r) => r.id !== roleId));
    toast({
      title: "Success",
      description: `Role "${role?.name}" has been deleted`,
      variant: "default",
    });
  };

  const handleToggleActive = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    const newStatus = !role?.isActive;

    setRoles(
      roles.map((r) => (r.id === roleId ? { ...r, isActive: newStatus } : r)),
    );

    if (newStatus) {
      toast({
        title: "Success",
        description: `Role "${role?.name}" activated`,
        variant: "default",
      });
    } else {
      toast({
        title: "Warning",
        description: `Role "${role?.name}" deactivated`,
        variant: "destructive",
      });
    }
  };

  const handleModulePermissionChange = (
    roleId: string,
    moduleId: string,
    checked: boolean,
  ) => {
    const module = mockModules.find((m) => m.id === moduleId);
    if (!module) return;

    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const newModules = checked
            ? [...role.permissions.modules, moduleId]
            : role.permissions.modules.filter((id) => id !== moduleId);

          // Update individual permissions based on module checkbox
          const modulePermissionIds = module.permissions.map((p) => p.id);
          const newIndividual = checked
            ? [
                ...new Set([
                  ...role.permissions.individual,
                  ...modulePermissionIds,
                ]),
              ]
            : role.permissions.individual.filter(
                (permission) => !modulePermissionIds.includes(permission),
              );

          return {
            ...role,
            permissions: {
              ...role.permissions,
              modules: newModules,
              individual: newIndividual,
            },
          };
        }
        return role;
      }),
    );

    // Update selectedRole state for immediate UI update
    if (selectedRole && selectedRole.id === roleId) {
      setSelectedRole((prev) => {
        if (!prev) return prev;
        const newModules = checked
          ? [...prev.permissions.modules, moduleId]
          : prev.permissions.modules.filter((id) => id !== moduleId);

        // Update individual permissions based on module checkbox
        const modulePermissionIds = module.permissions.map((p) => p.id);
        const newIndividual = checked
          ? [
              ...new Set([
                ...prev.permissions.individual,
                ...modulePermissionIds,
              ]),
            ]
          : prev.permissions.individual.filter(
              (permission) => !modulePermissionIds.includes(permission),
            );

        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            modules: newModules,
            individual: newIndividual,
          },
        };
      });
    }
  };

  const handleIndividualPermissionChange = (
    roleId: string,
    permissionId: string,
    checked: boolean,
  ) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const newPermissions = checked
            ? [...role.permissions.individual, permissionId]
            : role.permissions.individual.filter((id) => id !== permissionId);

          // Check if all permissions of a module are selected/deselected
          const module = mockModules.find((m) =>
            m.permissions.some((p) => p.id === permissionId),
          );
          let newModules = [...role.permissions.modules];

          if (module) {
            const modulePermissionIds = module.permissions.map((p) => p.id);
            const hasAllModulePermissions = modulePermissionIds.every((perm) =>
              checked
                ? newPermissions.includes(perm)
                : newPermissions.includes(perm),
            );

            if (
              checked &&
              hasAllModulePermissions &&
              !newModules.includes(module.id)
            ) {
              newModules.push(module.id);
            } else if (
              !checked &&
              !hasAllModulePermissions &&
              newModules.includes(module.id)
            ) {
              newModules = newModules.filter((id) => id !== module.id);
            }
          }

          return {
            ...role,
            permissions: {
              ...role.permissions,
              individual: newPermissions,
              modules: newModules,
            },
          };
        }
        return role;
      }),
    );

    // Update selectedRole state for immediate UI update
    if (selectedRole && selectedRole.id === roleId) {
      setSelectedRole((prev) => {
        if (!prev) return prev;
        const newPermissions = checked
          ? [...prev.permissions.individual, permissionId]
          : prev.permissions.individual.filter((id) => id !== permissionId);

        // Check if all permissions of a module are selected/deselected
        const module = mockModules.find((m) =>
          m.permissions.some((p) => p.id === permissionId),
        );
        let newModules = [...prev.permissions.modules];

        if (module) {
          const modulePermissionIds = module.permissions.map((p) => p.id);
          const hasAllModulePermissions = modulePermissionIds.every((perm) =>
            checked
              ? newPermissions.includes(perm)
              : newPermissions.includes(perm),
          );

          if (
            checked &&
            hasAllModulePermissions &&
            !newModules.includes(module.id)
          ) {
            newModules.push(module.id);
          } else if (
            !checked &&
            !hasAllModulePermissions &&
            newModules.includes(module.id)
          ) {
            newModules = newModules.filter((id) => id !== module.id);
          }
        }

        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            individual: newPermissions,
            modules: newModules,
          },
        };
      });
    }
  };

  const handleExtraPermissionChange = (
    roleId: string,
    permissionId: string,
    checked: boolean,
  ) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const newExtra = checked
            ? [...role.permissions.extra, permissionId]
            : role.permissions.extra.filter((id) => id !== permissionId);
          return {
            ...role,
            permissions: {
              ...role.permissions,
              extra: newExtra,
            },
          };
        }
        return role;
      }),
    );

    // Update selectedRole state for immediate UI update
    if (selectedRole && selectedRole.id === roleId) {
      setSelectedRole((prev) => {
        if (!prev) return prev;
        const newExtra = checked
          ? [...prev.permissions.extra, permissionId]
          : prev.permissions.extra.filter((id) => id !== permissionId);
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            extra: newExtra,
          },
        };
      });
    }
  };

  const _getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // Table columns configuration
  const columns: ColumnsType<any> = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-xs text-gray-500">
              {record.userCount} users
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Permissions",
      key: "permissions",
      width: 150,
      render: (_, record) => (
        <div className="text-center">
          <Badge className="bg-blue-100 text-blue-800">
            {record.permissions.modules.length +
              record.permissions.individual.length +
              record.permissions.extra.length}{" "}
            total
          </Badge>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record.id)}
          size="small"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <AntButton
            type="text"
            size="small"
            icon={<Edit className="h-3 w-3" />}
            onClick={() => handleEditRole(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <AntButton
            type="text"
            size="small"
            icon={<Settings className="h-3 w-3" />}
            onClick={() => setSelectedRole(record)}
            className="text-green-600 hover:text-green-800"
          />
          <Popconfirm
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <AntButton
              type="text"
              size="small"
              icon={<Trash2 className="h-3 w-3" />}
              className="text-red-600 hover:text-red-800"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4 mb-6">
        <JiraButton
          variant="text"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </JiraButton>
        <JiraButton
          variant="text"
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </JiraButton>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Role & Permissions
          </h1>
          <p className="text-gray-600 mt-2">
            Manage user roles and their permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <JiraButton variant="create">
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </JiraButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new role with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <Input
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  placeholder="e.g., Manager"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  placeholder="Describe the role's responsibilities..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={newRole.isActive}
                  onCheckedChange={(checked) =>
                    setNewRole({ ...newRole, isActive: checked as boolean })
                  }
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <DialogFooter>
              <JiraButton
                variant="text"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </JiraButton>
              <JiraButton variant="create" onClick={handleAddRole}>
                <Save className="h-4 w-4 mr-2" />
                Add Role
              </JiraButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Roles List
              </CardTitle>
              <CardDescription>
                Manage system roles and their permissions
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Total: {filteredRoles.length} roles
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            dataSource={filteredRoles}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} roles`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 800 }}
            size="small"
            className="permissions-table"
          />
        </CardContent>
      </Card>

      {/* Role Permissions Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Permissions for {selectedRole?.name}</span>
          </div>
        }
        placement="right"
        size="large"
        open={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        width="100%"
        className="permissions-drawer"
        extra={
          <div className="flex space-x-2">
            <JiraButton variant="text" onClick={() => setSelectedRole(null)}>
              Close
            </JiraButton>
            <JiraButton variant="create" onClick={() => setSelectedRole(null)}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </JiraButton>
          </div>
        }
      >
        {selectedRole && (
          <TooltipProvider>
            <div className="space-y-6">
              <div className="text-gray-600 mb-6">
                Configure module and extra permissions for this role.
              </div>

              {/* Module Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Module Permissions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockModules.map((module) => (
                    <Card key={module.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold">
                              {module.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {module.description}
                            </CardDescription>
                          </div>
                          <Checkbox
                            checked={selectedRole.permissions.modules.includes(
                              module.id,
                            )}
                            onCheckedChange={(checked) => {
                              console.log(
                                "Module permission change:",
                                module.id,
                                checked,
                              );
                              handleModulePermissionChange(
                                selectedRole.id,
                                module.id,
                                checked as boolean,
                              );
                            }}
                            className="checkbox-blue"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {module.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-gray-600 cursor-help">
                                      {permission.name}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">
                                      {permission.description}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <Checkbox
                                checked={selectedRole.permissions.individual.includes(
                                  permission.id,
                                )}
                                onCheckedChange={(checked) => {
                                  console.log(
                                    "Individual permission change:",
                                    permission.id,
                                    checked,
                                  );
                                  handleIndividualPermissionChange(
                                    selectedRole.id,
                                    permission.id,
                                    checked as boolean,
                                  );
                                }}
                                className="checkbox-blue"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Extra Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>Extra Permissions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockExtraPermissions.map((permission) => (
                    <Card
                      key={permission.id}
                      className="border border-gray-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold">
                              {permission.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {permission.description}
                            </CardDescription>
                          </div>
                          <Checkbox
                            checked={selectedRole.permissions.extra.includes(
                              permission.id,
                            )}
                            onCheckedChange={(checked) => {
                              console.log(
                                "Extra permission change:",
                                permission.id,
                                checked,
                              );
                              handleExtraPermissionChange(
                                selectedRole.id,
                                permission.id,
                                checked as boolean,
                              );
                            }}
                            className="checkbox-blue"
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cross-Module Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Cross-Module Permissions</span>
                </h3>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Individual Permissions from All Modules
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Select specific permissions from any module
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {mockModules.flatMap((module) =>
                        module.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-gray-700 cursor-help">
                                    {permission.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    {permission.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <Badge variant="outline" className="text-xs">
                                {module.name}
                              </Badge>
                            </div>
                            <Checkbox
                              checked={selectedRole.permissions.individual.includes(
                                permission.id,
                              )}
                              onCheckedChange={(checked) => {
                                console.log(
                                  "Cross-module permission change:",
                                  permission.id,
                                  checked,
                                );
                                handleIndividualPermissionChange(
                                  selectedRole.id,
                                  permission.id,
                                  checked as boolean,
                                );
                              }}
                              className="checkbox-blue"
                            />
                          </div>
                        )),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TooltipProvider>
        )}
      </Drawer>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role details.</DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <Input
                  value={editingRole.name}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={editingRole.description}
                  onChange={(e) =>
                    setEditingRole({
                      ...editingRole,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={editingRole.isActive}
                  onCheckedChange={(checked) =>
                    setEditingRole({
                      ...editingRole,
                      isActive: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="edit-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <JiraButton variant="text" onClick={() => setEditingRole(null)}>
              Cancel
            </JiraButton>
            <JiraButton variant="create" onClick={handleUpdateRole}>
              <Save className="h-4 w-4 mr-2" />
              Update Role
            </JiraButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No roles found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new role."}
          </p>
          {!searchTerm && (
            <JiraButton
              variant="create"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </JiraButton>
          )}
        </div>
      )}
    </div>
  );
}
