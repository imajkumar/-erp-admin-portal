"use client";

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Building,
  Database,
  DollarSign,
  FileText,
  Globe,
  Key,
  Lock,
  Mail,
  Palette,
  Settings,
  Shield,
  UserCog,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const [activeMenuItem, setActiveMenuItem] = useState("erp-settings");
  const router = useRouter();

  const handleItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  const handleModuleClick = () => {
    router.push("/dashboard/settings/modules");
  };

  const handleRolePermissionsClick = () => {
    router.push("/dashboard/settings/roles-permissions");
  };

  const settingsCategories = [
    {
      title: "ADMINISTRATE",
      description: "System administration and user management",
      icon: UserCog,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      items: [
        {
          name: "Modules",
          icon: Shield,
          description: "Manage modules and features",
        },
        {
          name: "Role & Permissions",
          icon: Shield,
          description: "Manage user roles and access control",
        },

        {
          name: "User Management",
          icon: Users,
          description: "Add, edit, and manage system users",
        },
        {
          name: "System Logs",
          icon: FileText,
          description: "View system activity and audit logs",
        },
      ],
    },
    {
      title: "MASTER",
      description: "Core system configuration and data management",
      icon: Database,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      items: [
        {
          name: "Company Settings",
          icon: Building,
          description: "Configure company information and details",
        },
        {
          name: "Currency Settings",
          icon: DollarSign,
          description: "Manage currencies and exchange rates",
        },
        {
          name: "Default Language",
          icon: Globe,
          description: "Set system default language and localization",
        },
      ],
    },
    {
      title: "EMAIL SETTINGS",
      description: "Email configuration and notification management",
      icon: Mail,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      items: [
        {
          name: "Email Templates",
          icon: Mail,
          description: "Customize email templates and formatting",
        },
        {
          name: "SMTP Configuration",
          icon: Settings,
          description: "Configure email server settings",
        },
        {
          name: "Notification Rules",
          icon: Bell,
          description: "Set up automated notification triggers",
        },
      ],
    },
    {
      title: "THEME SETTINGS",
      description: "Customize appearance and user interface",
      icon: Palette,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      items: [
        {
          name: "Color Scheme",
          icon: Palette,
          description: "Customize system colors and themes",
        },
        {
          name: "Layout Settings",
          icon: BarChart3,
          description: "Configure dashboard and page layouts",
        },
        {
          name: "Branding",
          icon: Building,
          description: "Upload logos and customize branding",
        },
      ],
    },
    {
      title: "SECURITY",
      description: "Security settings and access control",
      icon: Lock,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      items: [
        {
          name: "Password Policy",
          icon: Key,
          description: "Configure password requirements and policies",
        },
        {
          name: "Two-Factor Auth",
          icon: Shield,
          description: "Enable and configure 2FA settings",
        },
        {
          name: "Session Management",
          icon: Lock,
          description: "Manage user sessions and timeouts",
        },
      ],
    },
    {
      title: "INTEGRATION",
      description: "Third-party integrations and API settings",
      icon: Settings,
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
      items: [
        {
          name: "API Keys",
          icon: Key,
          description: "Manage API keys and access tokens",
        },
        {
          name: "Webhooks",
          icon: Settings,
          description: "Configure webhook endpoints and triggers",
        },
        {
          name: "External Services",
          icon: Globe,
          description: "Connect to external services and APIs",
        },
      ],
    },
  ];

  return (
    <AdminLayout activeItem={activeMenuItem} onItemClick={handleItemClick}>
      <MainContent>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ERP Settings
          </h1>
          <p className="text-gray-600">
            Configure and manage your ERP system settings
          </p>
        </div>

        {/* Your Shortcuts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Shortcuts
          </h2>
          <div className="flex flex-wrap gap-3">
            <JiraButton variant="text" className="flex items-center gap-2">
              <span>Accounts Settings</span>
              <ArrowUpRight className="h-4 w-4" />
            </JiraButton>
            <JiraButton variant="text" className="flex items-center gap-2">
              <span>Stock Settings</span>
              <ArrowUpRight className="h-4 w-4" />
            </JiraButton>
            <JiraButton variant="text" className="flex items-center gap-2">
              <span>Buying Settings</span>
              <ArrowUpRight className="h-4 w-4" />
            </JiraButton>
          </div>
        </div>

        {/* Settings Categories */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCategories.map((category, index) => (
              <Card
                key={index}
                className={`${category.color} hover:shadow-lg transition-shadow duration-200`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color} border`}>
                      <category.icon
                        className={`h-5 w-5 ${category.iconColor}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        onClick={
                          item.name === "Modules"
                            ? handleModuleClick
                            : item.name === "Role & Permissions"
                              ? handleRolePermissionsClick
                              : undefined
                        }
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Settings Section */}
        <div className="mt-8">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <JiraButton
                  variant="text"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Settings className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">System Config</span>
                </JiraButton>
                <JiraButton
                  variant="text"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Database className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">Database</span>
                </JiraButton>
                <JiraButton
                  variant="text"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Mail className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">Email Setup</span>
                </JiraButton>
                <JiraButton
                  variant="text"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Shield className="h-6 w-6 text-red-600" />
                  <span className="text-sm font-medium">Security</span>
                </JiraButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </AdminLayout>
  );
}
