"use client";

import { Button as AntButton, Popconfirm, Space, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeft,
  Check,
  Copy,
  Edit,
  Home,
  Lock,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

// Mock data for permissions
const mockPermissions = [
  {
    id: "1",
    name: "View Dashboard",
    alias: "dashboard.view",
    description: "Allow users to view the main dashboard",
    permissionCode: "DASH_VIEW",
    isActive: true,
    moduleId: "1",
  },
  {
    id: "2",
    name: "Edit Dashboard",
    alias: "dashboard.edit",
    description: "Allow users to edit dashboard widgets",
    permissionCode: "DASH_EDIT",
    isActive: true,
    moduleId: "1",
  },
  {
    id: "3",
    name: "Delete Dashboard",
    alias: "dashboard.delete",
    description: "Allow users to delete dashboard items",
    permissionCode: "DASH_DELETE",
    isActive: false,
    moduleId: "1",
  },
  {
    id: "4",
    name: "View Users",
    alias: "users.view",
    description: "Allow users to view user list",
    permissionCode: "USR_VIEW",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "5",
    name: "Create Users",
    alias: "users.create",
    description: "Allow users to create new users",
    permissionCode: "USR_CREATE",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "6",
    name: "Edit Users",
    alias: "users.edit",
    description: "Allow users to edit existing users",
    permissionCode: "USR_EDIT",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "7",
    name: "Delete Users",
    alias: "users.delete",
    description: "Allow users to delete users",
    permissionCode: "USR_DELETE",
    isActive: false,
    moduleId: "2",
  },
  {
    id: "8",
    name: "View User Profile",
    alias: "users.profile.view",
    description: "Allow users to view user profiles",
    permissionCode: "USR_PROF_VIEW",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "9",
    name: "Edit User Profile",
    alias: "users.profile.edit",
    description: "Allow users to edit user profiles",
    permissionCode: "USR_PROF_EDIT",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "10",
    name: "Change User Password",
    alias: "users.password.change",
    description: "Allow users to change passwords",
    permissionCode: "USR_PWD_CHANGE",
    isActive: false,
    moduleId: "2",
  },
  {
    id: "11",
    name: "Reset User Password",
    alias: "users.password.reset",
    description: "Allow users to reset passwords",
    permissionCode: "USR_PWD_RESET",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "12",
    name: "Assign User Roles",
    alias: "users.roles.assign",
    description: "Allow users to assign roles to users",
    permissionCode: "USR_ROLE_ASSIGN",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "13",
    name: "View User Roles",
    alias: "users.roles.view",
    description: "Allow users to view user roles",
    permissionCode: "USR_ROLE_VIEW",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "14",
    name: "Manage User Permissions",
    alias: "users.permissions.manage",
    description: "Allow users to manage user permissions",
    permissionCode: "USR_PERM_MANAGE",
    isActive: false,
    moduleId: "2",
  },
  {
    id: "15",
    name: "Export User Data",
    alias: "users.export",
    description: "Allow users to export user data",
    permissionCode: "USR_EXPORT",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "16",
    name: "Import User Data",
    alias: "users.import",
    description: "Allow users to import user data",
    permissionCode: "USR_IMPORT",
    isActive: false,
    moduleId: "2",
  },
  {
    id: "17",
    name: "Bulk User Operations",
    alias: "users.bulk",
    description: "Allow users to perform bulk operations",
    permissionCode: "USR_BULK",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "18",
    name: "View User Activity",
    alias: "users.activity.view",
    description: "Allow users to view user activity logs",
    permissionCode: "USR_ACT_VIEW",
    isActive: true,
    moduleId: "2",
  },
  {
    id: "19",
    name: "Manage User Sessions",
    alias: "users.sessions.manage",
    description: "Allow users to manage user sessions",
    permissionCode: "USR_SESS_MANAGE",
    isActive: false,
    moduleId: "2",
  },
  {
    id: "20",
    name: "View User Statistics",
    alias: "users.stats.view",
    description: "Allow users to view user statistics",
    permissionCode: "USR_STATS_VIEW",
    isActive: true,
    moduleId: "2",
  },
];

// Mock module data
const mockModules = [
  { id: "1", name: "Dashboard", description: "Main dashboard module" },
  { id: "2", name: "User Management", description: "User management module" },
  { id: "3", name: "Sales", description: "Sales management module" },
  { id: "4", name: "Analytics", description: "Analytics and reporting module" },
];

export default function ModulePermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  const { toast } = useToast();

  const [permissions, setPermissions] = useState(
    mockPermissions.filter((p) => p.moduleId === moduleId),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [newPermission, setNewPermission] = useState({
    name: "",
    alias: "",
    description: "",
    permissionCode: "",
    isActive: true,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentModule = mockModules.find((m) => m.id === moduleId);

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.permissionCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleAddPermission = () => {
    if (
      newPermission.name &&
      newPermission.alias &&
      newPermission.permissionCode
    ) {
      const permission = {
        id: Date.now().toString(),
        ...newPermission,
        moduleId: moduleId,
      };
      setPermissions([...permissions, permission]);
      setNewPermission({
        name: "",
        alias: "",
        description: "",
        permissionCode: "",
        isActive: true,
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `Permission "${newPermission.name}" has been added successfully`,
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

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
  };

  const handleUpdatePermission = () => {
    if (editingPermission) {
      setPermissions(
        permissions.map((p) =>
          p.id === editingPermission.id ? editingPermission : p,
        ),
      );
      setEditingPermission(null);
      toast({
        title: "Success",
        description: `Permission "${editingPermission.name}" has been updated successfully`,
        variant: "default",
      });
    }
  };

  const handleToggleActive = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    const newStatus = !permission?.isActive;

    setPermissions(
      permissions.map((p) =>
        p.id === permissionId ? { ...p, isActive: newStatus } : p,
      ),
    );

    // Show different toaster messages based on the new status
    if (newStatus) {
      toast({
        title: "Success",
        description: `Permission "${permission?.name}" activated`,
        variant: "default",
      });
    } else {
      toast({
        title: "Warning",
        description: `Permission "${permission?.name}" deactivated`,
        variant: "destructive",
      });
    }
  };

  const handleDeletePermission = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    setPermissions(permissions.filter((p) => p.id !== permissionId));
    toast({
      title: "Success",
      description: `Permission "${permission?.name}" has been deleted`,
      variant: "default",
    });
  };

  const handleCopyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Success",
        description: `Permission code "${code}" copied to clipboard`,
        variant: "default",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (_err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const _getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // Table columns configuration
  const columns: ColumnsType<Permission> = [
    {
      title: "Permission Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-xs text-gray-500">{record.alias}</div>
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
      title: "Permission Code",
      dataIndex: "permissionCode",
      key: "permissionCode",
      width: 180,
      render: (text) => (
        <div className="flex items-center space-x-2">
          <code
            className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1 cursor-pointer hover:bg-gray-200 transition-colors select-none"
            onDoubleClick={() => handleCopyToClipboard(text)}
            title="Double-click to copy"
          >
            {text}
          </code>
          <AntButton
            type="text"
            size="small"
            icon={
              copiedCode === text ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )
            }
            onClick={() => handleCopyToClipboard(text)}
            className={`text-gray-500 hover:text-blue-600 ${
              copiedCode === text ? "text-green-600" : ""
            }`}
            title="Click to copy"
          />
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
            onClick={() => handleEditPermission(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Popconfirm
            title="Delete Permission"
            description="Are you sure you want to delete this permission?"
            onConfirm={() => handleDeletePermission(record.id)}
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
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Module Permissions
          </h1>
          <p className="text-gray-600 mt-2">
            Manage permissions for{" "}
            <span className="font-semibold text-blue-600">
              {currentModule?.name}
            </span>{" "}
            module
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Permission</DialogTitle>
              <DialogDescription>
                Create a new permission for the {currentModule?.name} module.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="permission-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Permission Name
                </label>
                <Input
                  id="permission-name"
                  value={newPermission.name}
                  onChange={(e) =>
                    setNewPermission({ ...newPermission, name: e.target.value })
                  }
                  placeholder="e.g., View Dashboard"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="permission-alias"
                  className="text-sm font-medium text-gray-700"
                >
                  Alias
                </label>
                <Input
                  id="permission-alias"
                  value={newPermission.alias}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      alias: e.target.value,
                    })
                  }
                  placeholder="e.g., dashboard.view"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="permission-code"
                  className="text-sm font-medium text-gray-700"
                >
                  Permission Code
                </label>
                <Input
                  id="permission-code"
                  value={newPermission.permissionCode}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      permissionCode: e.target.value,
                    })
                  }
                  placeholder="e.g., DASH_VIEW"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="permission-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Textarea
                  id="permission-description"
                  value={newPermission.description}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what this permission allows..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={newPermission.isActive}
                  onCheckedChange={(checked) =>
                    setNewPermission({
                      ...newPermission,
                      isActive: checked as boolean,
                    })
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
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPermission}>
                <Save className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Permissions List
              </CardTitle>
              <CardDescription>
                Manage permissions for the {currentModule?.name} module
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Total: {filteredPermissions.length} permissions
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            dataSource={filteredPermissions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} permissions`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 800 }}
            size="small"
            className="permissions-table"
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No permissions found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new permission."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          )}
        </div>
      )}

      {/* Edit Permission Dialog */}
      <Dialog
        open={!!editingPermission}
        onOpenChange={() => setEditingPermission(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the permission details.
            </DialogDescription>
          </DialogHeader>
          {editingPermission && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Permission Name
                </label>
                <Input
                  value={editingPermission.name}
                  onChange={(e) =>
                    setEditingPermission({
                      ...editingPermission,
                      name: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Alias
                </label>
                <Input
                  value={editingPermission.alias}
                  onChange={(e) =>
                    setEditingPermission({
                      ...editingPermission,
                      alias: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Permission Code
                </label>
                <Input
                  value={editingPermission.permissionCode}
                  onChange={(e) =>
                    setEditingPermission({
                      ...editingPermission,
                      permissionCode: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={editingPermission.description}
                  onChange={(e) =>
                    setEditingPermission({
                      ...editingPermission,
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
                  checked={editingPermission.isActive}
                  onCheckedChange={(checked) =>
                    setEditingPermission({
                      ...editingPermission,
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
            <Button
              variant="outline"
              onClick={() => setEditingPermission(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePermission}>
              <Save className="h-4 w-4 mr-2" />
              Update Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
