import { apiClient, ApiResponse } from "../client";
import { LoginRequest, LoginResponse, User } from "@/store/types";

export class AuthService {
  private static readonly SERVICE = "auth" as const;

  // Authentication endpoints
  static async login(
    credentials: LoginRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/login", credentials);
  }

  static async logout(): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/logout");
  }

  static async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/refresh", {
      refreshToken,
    });
  }

  // User profile endpoints
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get(this.SERVICE, "/api/v1/auth/profile");
  }

  static async updateProfile(
    profileData: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return apiClient.put(this.SERVICE, "/api/v1/auth/profile", profileData);
  }

  static async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, "/profile/password", data);
  }

  static async updateAvatar(
    formData: FormData,
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    return apiClient.upload(this.SERVICE, "/profile/avatar", formData);
  }

  // Registration endpoints
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
  }): Promise<ApiResponse<User>> {
    return apiClient.post(this.SERVICE, "/register", userData);
  }

  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/verify-email", { token });
  }

  static async resendVerification(email: string): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/resend-verification", { email });
  }

  // Password reset endpoints
  static async forgotPassword(email: string): Promise<ApiResponse<string>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/forgot-password", {
      email,
    });
  }

  static async verifyOTP(
    email: string,
    otp: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/verify-otp", {
      email,
      otp,
    });
  }

  static async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/api/v1/auth/reset-password", data);
  }

  // Two-factor authentication endpoints
  static async enable2FA(): Promise<
    ApiResponse<{ qrCode: string; secret: string }>
  > {
    return apiClient.post(this.SERVICE, "/2fa/enable");
  }

  static async verify2FA(token: string): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/2fa/verify", { token });
  }

  static async disable2FA(password: string): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/2fa/disable", { password });
  }

  // Session management endpoints
  static async getSessions(): Promise<
    ApiResponse<
      Array<{
        id: string;
        device: string;
        location: string;
        lastActive: string;
        current: boolean;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, "/sessions");
  }

  static async revokeSession(sessionId: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/sessions/${sessionId}`);
  }

  static async revokeAllSessions(): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/sessions/revoke-all");
  }

  // Security endpoints
  static async getSecurityLogs(
    params: { page?: number; limit?: number } = {},
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        action: string;
        ip: string;
        userAgent: string;
        timestamp: string;
        success: boolean;
      }>
    >
  > {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    return apiClient.get(
      this.SERVICE,
      `/security-logs?${queryParams.toString()}`,
    );
  }

  // Account management endpoints
  static async deactivateAccount(password: string): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, "/account/deactivate", { password });
  }

  static async deleteAccount(password: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, "/account/delete", {
      data: { password },
    });
  }

  // OAuth endpoints
  static async getOAuthProviders(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        enabled: boolean;
        clientId: string;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, "/oauth/providers");
  }

  static async oauthLogin(
    provider: string,
    code: string,
    state?: string,
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post(this.SERVICE, `/oauth/${provider}/login`, {
      code,
      state,
    });
  }

  static async linkOAuthAccount(
    provider: string,
    code: string,
    state?: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, `/oauth/${provider}/link`, {
      code,
      state,
    });
  }

  static async unlinkOAuthAccount(
    provider: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/oauth/${provider}/unlink`);
  }
}
