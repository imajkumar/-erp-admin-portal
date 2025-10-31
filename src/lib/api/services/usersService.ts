import { apiClient, ApiResponse, PaginatedResponse } from "../client";
import { User, UserFilters, Role } from "@/store/types";

export class UsersService {
  private static readonly SERVICE = "users" as const;

  // User management endpoints
  static async getUsers(
    filters: UserFilters = {},
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();

    // Pagination parameters
    params.append("page", (filters.page || 0).toString());
    params.append("size", (filters.limit || 10).toString());
    
    // Sorting parameters
    params.append("sortBy", filters.sortBy || "firstName");
    params.append("sortDirection", filters.sortDirection || "asc");

    // Filter parameters
    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.department) params.append("department", filters.department);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const url = `/api/v1/users/paginated?${params.toString()}`;
    console.log("UsersService.getUsers - Constructed URL:", url);
    console.log("UsersService.getUsers - Params:", params.toString());
    return apiClient.getPaginated(this.SERVICE, url);
  }

  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(this.SERVICE, `/users/${id}`);
  }

  static async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<User>> {
    console.log("UsersService.createUser called with userData:", userData);
    return apiClient.post(this.SERVICE, "/api/v1/users", userData);
  }

  static async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return apiClient.put(this.SERVICE, `/users/${id}`, data);
  }

  static async deleteUser(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/users/${id}`);
  }

  // Bulk operations
  static async bulkDeleteUsers(
    userIds: string[],
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiClient.post(this.SERVICE, "/users/bulk-delete", { userIds });
  }

  static async bulkUpdateUsers(
    userIds: string[],
    data: Partial<User>,
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.put(this.SERVICE, "/users/bulk-update", { userIds, data });
  }

  // Export/Import
  static async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.department) params.append("department", filters.department);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    return apiClient.download(
      this.SERVICE,
      `/users/export?${params.toString()}`,
    );
  }

  static async importUsers(formData: FormData): Promise<
    ApiResponse<{
      successCount: number;
      errorCount: number;
      errors: Array<{ row: number; error: string }>;
    }>
  > {
    return apiClient.upload(this.SERVICE, "/users/import", formData);
  }

  // User status management
  static async toggleUserStatus(
    id: string,
    isActive: boolean,
  ): Promise<ApiResponse<User>> {
    return apiClient.patch(this.SERVICE, `/users/${id}/status`, { isActive });
  }

  static async activateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.post(this.SERVICE, `/users/${id}/activate`);
  }

  static async deactivateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.post(this.SERVICE, `/users/${id}/deactivate`);
  }

  // Password management
  static async resetUserPassword(
    id: string,
  ): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return apiClient.post(this.SERVICE, `/users/${id}/reset-password`);
  }

  static async changeUserPassword(
    id: string,
    newPassword: string,
    temporary = false,
  ): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, `/users/${id}/change-password`, {
      newPassword,
      temporary,
    });
  }

  // Admin actions
  static async loginAsUser(
    id: string,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    return apiClient.post(this.SERVICE, `/users/${id}/login-as`);
  }

  // User activity and logs
  static async getUserActivity(
    id: string,
    page = 1,
    limit = 10,
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        action: string;
        description: string;
        ip: string;
        userAgent: string;
        timestamp: string;
        metadata?: any;
      }>
    >
  > {
    return apiClient.get(
      this.SERVICE,
      `/users/${id}/activity?page=${page}&limit=${limit}`,
    );
  }

  static async getUserSessions(id: string): Promise<
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
    return apiClient.get(this.SERVICE, `/users/${id}/sessions`);
  }

  static async revokeUserSession(
    userId: string,
    sessionId: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.delete(
      this.SERVICE,
      `/users/${userId}/sessions/${sessionId}`,
    );
  }

  // User preferences
  static async getUserPreferences(id: string): Promise<
    ApiResponse<{
      theme: string;
      language: string;
      notifications: any;
      dashboard: any;
    }>
  > {
    return apiClient.get(this.SERVICE, `/users/${id}/preferences`);
  }

  static async updateUserPreferences(
    id: string,
    preferences: any,
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/users/${id}/preferences`, preferences);
  }

  // Role management endpoints
  static async getRoles(
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<ApiResponse<Role[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 20).toString());
    if (params.search) queryParams.append("search", params.search);

    return apiClient.get(this.SERVICE, `/roles?${queryParams.toString()}`);
  }

  static async getRoleById(id: string): Promise<ApiResponse<Role>> {
    return apiClient.get(this.SERVICE, `/roles/${id}`);
  }

  static async createRole(
    roleData: Omit<Role, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Role>> {
    return apiClient.post(this.SERVICE, "/roles", roleData);
  }

  static async updateRole(
    id: string,
    data: Partial<Role>,
  ): Promise<ApiResponse<Role>> {
    return apiClient.put(this.SERVICE, `/roles/${id}`, data);
  }

  static async deleteRole(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/roles/${id}`);
  }

  // Role permissions
  static async getRolePermissions(roleId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        alias: string;
        description: string;
        code: string;
        moduleId: string;
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, `/roles/${roleId}/permissions`);
  }

  static async updateRolePermissions(
    roleId: string,
    permissions: string[],
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/roles/${roleId}/permissions`, {
      permissions,
    });
  }

  // User roles
  static async getUserRoles(userId: string): Promise<ApiResponse<Role[]>> {
    return apiClient.get(this.SERVICE, `/users/${userId}/roles`);
  }

  static async assignUserRoles(
    userId: string,
    roleIds: string[],
  ): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, `/users/${userId}/roles`, { roleIds });
  }

  static async removeUserRoles(
    userId: string,
    roleIds: string[],
  ): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/users/${userId}/roles`, {
      data: { roleIds },
    });
  }

  // Statistics and analytics
  static async getUserStats(): Promise<
    ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      newUsersThisMonth: number;
      usersByRole: Array<{ role: string; count: number }>;
      usersByDepartment: Array<{ department: string; count: number }>;
    }>
  > {
    return apiClient.get(this.SERVICE, "/users/stats");
  }

  // Department management
  static async getDepartments(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        managerId: string;
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, "/departments");
  }

  static async createDepartment(data: {
    name: string;
    description: string;
    managerId?: string;
  }): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post(this.SERVICE, "/departments", data);
  }

  static async updateDepartment(
    id: string,
    data: {
      name?: string;
      description?: string;
      managerId?: string;
    },
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/departments/${id}`, data);
  }

  static async deleteDepartment(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/departments/${id}`);
  }
}
