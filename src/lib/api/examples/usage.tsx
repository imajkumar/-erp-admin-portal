// Example usage of the API system
import React from "react";
import { useApi } from "@/hooks/useApi";
import {
  AuthService,
  UsersService,
  ModulesService,
  NotificationsService,
} from "@/lib/api";

// Example 1: Using the useApi hook (recommended for React components)
export function ExampleComponent() {
  const { auth, users, apiCall } = useApi();

  // Login example
  const handleLogin = async () => {
    try {
      const result = await auth.login({
        email: "user@example.com",
        password: "password123",
        rememberMe: true,
      });

      if (result) {
        console.log("Login successful:", result);
        // Redirect or update UI
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Get users example
  const handleGetUsers = async () => {
    try {
      const result = await users.getUsers({
        search: "john",
        status: "active",
        page: 1,
        limit: 10,
      });

      if (result) {
        console.log("Users loaded:", result);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  // Create user example
  const handleCreateUser = async () => {
    try {
      const result = await users.createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        department: "IT",
        role: "user",
        isActive: true,
      });

      if (result) {
        console.log("User created:", result);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGetUsers}>Get Users</button>
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
}

// Example 2: Using services directly (for non-React code)
export class ExampleService {
  // Direct service usage
  static async loginUser(email: string, password: string) {
    try {
      const response = await AuthService.login({ email, password });

      if (response.status === "success") {
        // Store tokens
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  // Get user with error handling
  static async getUserById(id: string) {
    try {
      const response = await UsersService.getUserById(id);
      return response.data;
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  // File upload example
  static async uploadUserAvatar(userId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await AuthService.updateAvatar(formData);
      return response.data;
    } catch (error) {
      console.error("Avatar upload failed:", error);
      throw error;
    }
  }

  // Export data example
  static async exportUsers(filters: any = {}) {
    try {
      const blob = await UsersService.exportUsers(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }
}

// Example 3: Custom API call with error handling
export async function customApiCall() {
  try {
    // Using the generic apiCall method
    const { apiCall } = useApi();

    const result = await apiCall(
      () => ModulesService.getModules({ status: "active" }),
      (data) => {
        console.log("Modules loaded successfully:", data);
        // Handle success
      },
      (error) => {
        console.error("Failed to load modules:", error);
        // Handle error
      },
    );

    return result;
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
}

// Example 4: Batch operations
export async function batchUserOperations() {
  try {
    // Get users
    const users = await UsersService.getUsers({ limit: 100 });

    if (users.status === "success" && users.data.length > 0) {
      // Bulk update users
      const userIds = users.data.map((user) => user.id);
      const updateResult = await UsersService.bulkUpdateUsers(userIds, {
        lastLogin: new Date().toISOString(),
      });

      console.log("Bulk update result:", updateResult);
    }
  } catch (error) {
    console.error("Batch operations failed:", error);
  }
}

// Example 5: Real-time notifications
export async function setupNotificationSubscription(userId: string) {
  try {
    const ws = await NotificationsService.subscribeToNotifications(userId);

    ws.onopen = () => {
      console.log("Connected to notifications");
    };

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("New notification:", notification);
      // Handle notification
    };

    ws.onclose = () => {
      console.log("Disconnected from notifications");
      // Reconnect logic
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  } catch (error) {
    console.error("Failed to setup notification subscription:", error);
    return null;
  }
}

// Example 6: Error handling patterns
export class ApiErrorHandler {
  static handle(error: any) {
    if (error.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/login";
    } else if (error.status === 403) {
      // Forbidden - show access denied message
      console.error("Access denied");
    } else if (error.status === 404) {
      // Not found - show not found message
      console.error("Resource not found");
    } else if (error.status >= 500) {
      // Server error - show server error message
      console.error("Server error");
    } else {
      // Other errors
      console.error("API error:", error.message);
    }
  }
}

// Example 7: API call with retry logic
export async function apiCallWithRetry<T>(
  apiFunction: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
): Promise<T | null> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error("Max retries reached:", error);
        return null;
      }

      console.warn(`Retry ${i + 1}/${maxRetries} failed:`, error);
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i)),
      );
    }
  }

  return null;
}

// Example 8: Caching API responses
export class ApiCache {
  private static cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  static async get<T>(
    key: string,
    apiFunction: () => Promise<T>,
    ttl = 5 * 60 * 1000, // 5 minutes
  ): Promise<T> {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const data = await apiFunction();
    this.cache.set(key, { data, timestamp: Date.now(), ttl });

    return data;
  }

  static clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Example usage of caching
export async function getCachedUsers() {
  return ApiCache.get(
    "users",
    () => UsersService.getUsers(),
    5 * 60 * 1000, // 5 minutes cache
  );
}
