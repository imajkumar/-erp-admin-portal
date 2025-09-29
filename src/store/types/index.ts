import { RootState } from "../index";

// Re-export RootState for convenience
export type { RootState };

// Common types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  status: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  timestamp: string;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePictureUrl: string | null;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string;
  preferences: {
    language: string;
    timezone: string;
    theme: string;
    notifications: {
      emailEnabled: boolean;
      smsEnabled: boolean;
      pushEnabled: boolean;
      securityEnabled: boolean;
    };
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: User;
  role: string;
  session: {
    sessionId: string;
    deviceId: string | null;
    deviceName: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    expiresAt: string;
    rememberMe: boolean;
    timeoutMinutes: number;
  };
  security: {
    twoFactorEnabled: boolean;
    pinEnabled: boolean;
    linkedProviders: string[];
    lastPasswordChange: string;
    securityScore: number;
    securityRecommendations: string[];
    failedLoginAttempts: number;
    lockedUntil: string | null;
  };
  rememberMeSession: boolean;
  sessionTimeoutMinutes: number;
  accountLocked: boolean;
}

// Module types
export interface Module {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  version: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  alias: string;
  description: string;
  code: string;
  moduleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Role types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Settings types
export interface ThemeSettings {
  theme: "default" | "blue" | "green" | "purple";
  mode: "light" | "dark";
}

export interface LanguageSettings {
  language: "en" | "hi" | "ru" | "pl";
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface GeneralSettings {
  theme: ThemeSettings;
  language: LanguageSettings;
  notifications: NotificationSettings;
}

// Filter types
export interface UserFilters {
  search?: string;
  role?: string;
  status?: "active" | "inactive";
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ModuleFilters {
  search?: string;
  category?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
}

export interface NotificationFilters {
  type?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}
