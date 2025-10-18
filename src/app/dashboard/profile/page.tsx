"use client";

import {
  Activity,
  CheckCircle,
  Edit,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Save,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreatePinMutation,
  useUpdatePinMutation,
  useResetPinMutation,
} from "@/store/api/authApi";
import PinManagement from "@/components/PinManagement";
import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";
import AuthGuard from "@/components/AuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getUserData, logout } from "@/utils/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    bio: "",
    location: "",
  });

  const [lockPinData, setLockPinData] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");

  // RTK Query hooks
  const [createPin, { isLoading: isCreatingPin }] = useCreatePinMutation();
  const [updatePin, { isLoading: isUpdatingPinRTK }] = useUpdatePinMutation();
  const [resetPin, { isLoading: isResettingPin }] = useResetPinMutation();

  const handleItemClick = (item: string) => {
    // Handle navigation if needed
    console.log("Item clicked:", item);
  };

  useEffect(() => {
    const loadUserData = () => {
      const userData = getUserData();
      if (userData) {
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          username: userData.username || "",
          bio: userData.bio || "",
          location: userData.location || "",
        });
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        // Update local user data
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setIsEditing(false);
        console.log("Profile updated successfully");
      } else {
        console.error("Error updating profile:", result.message);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // You could add a toast notification here
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      username: user?.username || "",
      bio: user?.bio || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLockPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLockPinData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (pinError) setPinError("");
  };

  const validatePin = (pin: string): boolean => {
    // PIN should be 4-6 digits
    return /^\d{4,6}$/.test(pin);
  };

  const handleUpdatePin = async () => {
    setPinError("");
    setPinSuccess("");

    // Validation
    if (!lockPinData.currentPin) {
      setPinError("Current PIN is required");
      return;
    }

    if (!validatePin(lockPinData.currentPin)) {
      setPinError("Current PIN must be 4-6 digits");
      return;
    }

    if (!lockPinData.newPin) {
      setPinError("New PIN is required");
      return;
    }

    if (!validatePin(lockPinData.newPin)) {
      setPinError("New PIN must be 4-6 digits");
      return;
    }

    if (lockPinData.newPin !== lockPinData.confirmPin) {
      setPinError("New PIN and confirmation PIN do not match");
      return;
    }

    if (lockPinData.currentPin === lockPinData.newPin) {
      setPinError("New PIN must be different from current PIN");
      return;
    }

    setIsUpdatingPin(true);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setPinError("Authentication required");
        return;
      }

      const response = await fetch("/api/auth/update-pin", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPin: lockPinData.currentPin,
          newPin: lockPinData.newPin,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setPinSuccess("PIN updated successfully");
        setLockPinData({
          currentPin: "",
          newPin: "",
          confirmPin: "",
        });
        // Update user data to reflect PIN status
        const updatedUser = { ...user, hasLockPin: true };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        setPinError(result.message || "Failed to update PIN");
      }
    } catch (error) {
      setPinError("An error occurred while updating PIN");
      console.error("Error updating PIN:", error);
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const handleCreatePin = async () => {
    setPinError("");
    setPinSuccess("");

    // Validation for creating new PIN
    if (!lockPinData.newPin) {
      setPinError("PIN is required");
      return;
    }

    if (!validatePin(lockPinData.newPin)) {
      setPinError("PIN must be 4-6 digits");
      return;
    }

    if (lockPinData.newPin !== lockPinData.confirmPin) {
      setPinError("PIN and confirmation do not match");
      return;
    }

    try {
      const result = await createPin({
        pin: lockPinData.newPin,
      }).unwrap();

      if (result.status === "success") {
        setPinSuccess("PIN created successfully");
        setLockPinData({
          currentPin: "",
          newPin: "",
          confirmPin: "",
        });
        // Update user data to reflect PIN status
        const updatedUser = { ...user, hasLockPin: true };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        setPinError(result.message || "Failed to create PIN");
      }
    } catch (error: any) {
      setPinError(
        error?.data?.message || "An error occurred while creating PIN",
      );
      console.error("Error creating PIN:", error);
    }
  };

  const handleResetPin = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset your lock PIN? This action cannot be undone.",
      )
    ) {
      return;
    }

    setPinError("");
    setPinSuccess("");
    setIsUpdatingPin(true);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setPinError("Authentication required");
        return;
      }

      const response = await fetch("/api/auth/reset-pin", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        setPinSuccess("PIN reset successfully");
        setLockPinData({
          currentPin: "",
          newPin: "",
          confirmPin: "",
        });
        // Update user data to reflect PIN status
        const updatedUser = { ...user, hasLockPin: false };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        setPinError(result.message || "Failed to reset PIN");
      }
    } catch (error) {
      setPinError("An error occurred while resetting PIN");
      console.error("Error resetting PIN:", error);
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const clearPinMessages = () => {
    setPinError("");
    setPinSuccess("");
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <AdminLayout activeItem="profile" onItemClick={handleItemClick}>
          <MainContent>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </MainContent>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminLayout activeItem="profile" onItemClick={handleItemClick}>
        <MainContent>
          {/* Main Profile Content */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          user?.profilePictureUrl ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        }
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || "U"}
                        {user?.lastName?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {user?.fullName || "User Name"}
                        </h1>
                        {user?.emailVerified && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-600">
                        {user?.username || "Username"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user?.location || "Location"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{user?.email || "email@example.com"}</span>
                        </div>
                        {user?.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <JiraButton
                          onClick={handleSave}
                          variant="create"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </JiraButton>
                        <JiraButton
                          onClick={handleCancel}
                          variant="text"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </JiraButton>
                      </>
                    ) : (
                      <>
                        <JiraButton
                          onClick={() => setIsEditing(true)}
                          variant="text"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </JiraButton>
                        <JiraButton
                          onClick={handleLogout}
                          variant="text"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Logout
                        </JiraButton>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card className="border-0 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          ↑ $4,500
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Earnings</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          ↓ 80
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Projects</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          ↑ 60%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Success Rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Completion */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Profile Completion
                    </span>
                    <span className="text-sm text-gray-500">50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                {/* Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-6"
                >
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="lockpin">Lock PIN</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            First Name
                          </Label>
                          <p className="text-gray-900">
                            {user?.firstName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Last Name
                          </Label>
                          <p className="text-gray-900">
                            {user?.lastName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <p className="text-gray-900">
                            {user?.email || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Phone
                          </Label>
                          <p className="text-gray-900">
                            {user?.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Username
                          </Label>
                          <p className="text-gray-900">
                            {user?.username || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <p className="text-gray-900">
                            {user?.status || "Unknown"}
                          </p>
                        </div>
                      </div>
                      {user?.bio && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Bio
                          </Label>
                          <p className="text-gray-900">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="edit" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      {!isEditing && (
                        <div className="flex justify-end">
                          <JiraButton
                            onClick={() => setIsEditing(true)}
                            variant="create"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </JiraButton>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Security Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">
                                Two-Factor Authentication
                              </h4>
                              <p className="text-sm text-gray-600">
                                Add an extra layer of security
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              {user?.security?.twoFactorEnabled
                                ? "Disable"
                                : "Enable"}
                            </Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Change Password</h4>
                              <p className="text-sm text-gray-600">
                                Update your password regularly
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Login Sessions</h4>
                              <p className="text-sm text-gray-600">
                                Manage your active sessions
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Sessions
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="lockpin" className="mt-6">
                    <PinManagement />
                  </TabsContent>

                  <TabsContent value="preferences" className="mt-6">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>User Preferences</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Language</Label>
                              <p className="text-sm text-gray-600">
                                {user?.preferences?.language || "English"}
                              </p>
                            </div>
                            <div>
                              <Label>Timezone</Label>
                              <p className="text-sm text-gray-600">
                                {user?.preferences?.timezone || "UTC"}
                              </p>
                            </div>
                            <div>
                              <Label>Theme</Label>
                              <p className="text-sm text-gray-600">
                                {user?.preferences?.theme || "Light"}
                              </p>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2">
                              Notification Preferences
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Email Notifications
                                </span>
                                <span className="text-sm text-gray-600">
                                  {user?.preferences?.notifications
                                    ?.emailEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  SMS Notifications
                                </span>
                                <span className="text-sm text-gray-600">
                                  {user?.preferences?.notifications?.smsEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Push Notifications
                                </span>
                                <span className="text-sm text-gray-600">
                                  {user?.preferences?.notifications?.pushEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">
                            Profile updated
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">
                            Password changed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            1 day ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">
                            Login from new device
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            3 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Statistics</CardTitle>
                <CardDescription>More than 400 new members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Chart visualization for Recent Statistics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>890,344 Sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        08:42 Outlines keep you honest. And keep structure
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        10:00 AEOL meeting
                      </p>
                      <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        14:37 Make deposit USD 700. to ESL
                      </p>
                      <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        16:50 Indulging in poorly driving and keep structure
                        keep great
                      </p>
                      <p className="text-xs text-gray-500 mt-1">8 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        21:03 New order placed #XF-2356.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">12 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        10:30 Finance KPI Mobile app launch preparation meeting
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </MainContent>
      </AdminLayout>
    </AuthGuard>
  );
}
