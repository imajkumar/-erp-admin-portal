import { apiClient, ApiResponse } from "../client";

export interface Module {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "maintenance";
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

export interface ModuleFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class ModulesService {
  private static readonly SERVICE = "modules" as const;

  // Module management endpoints
  static async getModules(
    filters: ModuleFilters = {},
  ): Promise<ApiResponse<Module[]>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient.get(this.SERVICE, `/modules?${params.toString()}`);
  }

  static async getModuleById(id: string): Promise<ApiResponse<Module>> {
    return apiClient.get(this.SERVICE, `/modules/${id}`);
  }

  static async createModule(
    moduleData: Omit<Module, "id" | "createdAt" | "updatedAt" | "permissions">,
  ): Promise<ApiResponse<Module>> {
    return apiClient.post(this.SERVICE, "/modules", moduleData);
  }

  static async updateModule(
    id: string,
    data: Partial<Module>,
  ): Promise<ApiResponse<Module>> {
    return apiClient.put(this.SERVICE, `/modules/${id}`, data);
  }

  static async deleteModule(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/modules/${id}`);
  }

  // Module status management
  static async activateModule(id: string): Promise<ApiResponse<Module>> {
    return apiClient.post(this.SERVICE, `/modules/${id}/activate`);
  }

  static async deactivateModule(id: string): Promise<ApiResponse<Module>> {
    return apiClient.post(this.SERVICE, `/modules/${id}/deactivate`);
  }

  static async toggleModuleStatus(
    id: string,
    isActive: boolean,
  ): Promise<ApiResponse<Module>> {
    return apiClient.patch(this.SERVICE, `/modules/${id}/status`, { isActive });
  }

  // Module permissions
  static async getModulePermissions(
    moduleId: string,
  ): Promise<ApiResponse<Permission[]>> {
    return apiClient.get(this.SERVICE, `/modules/${moduleId}/permissions`);
  }

  static async createPermission(
    moduleId: string,
    permissionData: Omit<
      Permission,
      "id" | "moduleId" | "createdAt" | "updatedAt"
    >,
  ): Promise<ApiResponse<Permission>> {
    return apiClient.post(
      this.SERVICE,
      `/modules/${moduleId}/permissions`,
      permissionData,
    );
  }

  static async updatePermission(
    moduleId: string,
    permissionId: string,
    data: Partial<Permission>,
  ): Promise<ApiResponse<Permission>> {
    return apiClient.put(
      this.SERVICE,
      `/modules/${moduleId}/permissions/${permissionId}`,
      data,
    );
  }

  static async deletePermission(
    moduleId: string,
    permissionId: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.delete(
      this.SERVICE,
      `/modules/${moduleId}/permissions/${permissionId}`,
    );
  }

  static async togglePermissionStatus(
    moduleId: string,
    permissionId: string,
    isActive: boolean,
  ): Promise<ApiResponse<Permission>> {
    return apiClient.patch(
      this.SERVICE,
      `/modules/${moduleId}/permissions/${permissionId}/status`,
      { isActive },
    );
  }

  // Module categories
  static async getCategories(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        moduleCount: number;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, "/categories");
  }

  static async createCategory(data: {
    name: string;
    description: string;
  }): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post(this.SERVICE, "/categories", data);
  }

  static async updateCategory(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/categories/${id}`, data);
  }

  static async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/categories/${id}`);
  }

  // Module dependencies
  static async getModuleDependencies(moduleId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        version: string;
        required: boolean;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, `/modules/${moduleId}/dependencies`);
  }

  static async addModuleDependency(
    moduleId: string,
    dependencyId: string,
    required = false,
  ): Promise<ApiResponse<null>> {
    return apiClient.post(this.SERVICE, `/modules/${moduleId}/dependencies`, {
      dependencyId,
      required,
    });
  }

  static async removeModuleDependency(
    moduleId: string,
    dependencyId: string,
  ): Promise<ApiResponse<null>> {
    return apiClient.delete(
      this.SERVICE,
      `/modules/${moduleId}/dependencies/${dependencyId}`,
    );
  }

  // Module installation/updates
  static async installModule(
    moduleId: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(this.SERVICE, `/modules/${moduleId}/install`);
  }

  static async uninstallModule(
    moduleId: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(this.SERVICE, `/modules/${moduleId}/uninstall`);
  }

  static async updateModuleVersion(
    moduleId: string,
    version: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(this.SERVICE, `/modules/${moduleId}/update`, {
      version,
    });
  }

  // Module configuration
  static async getModuleConfig(
    moduleId: string,
  ): Promise<ApiResponse<Record<string, any>>> {
    return apiClient.get(this.SERVICE, `/modules/${moduleId}/config`);
  }

  static async updateModuleConfig(
    moduleId: string,
    config: Record<string, any>,
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/modules/${moduleId}/config`, config);
  }

  // Module statistics
  static async getModuleStats(): Promise<
    ApiResponse<{
      totalModules: number;
      activeModules: number;
      inactiveModules: number;
      modulesByCategory: Array<{ category: string; count: number }>;
      recentActivity: Array<{
        id: string;
        action: string;
        moduleName: string;
        timestamp: string;
      }>;
    }>
  > {
    return apiClient.get(this.SERVICE, "/modules/stats");
  }

  // Module logs
  static async getModuleLogs(
    moduleId: string,
    params: { page?: number; limit?: number; level?: string } = {},
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        level: string;
        message: string;
        timestamp: string;
        metadata?: any;
      }>
    >
  > {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.level) queryParams.append("level", params.level);

    return apiClient.get(
      this.SERVICE,
      `/modules/${moduleId}/logs?${queryParams.toString()}`,
    );
  }

  // Module health check
  static async checkModuleHealth(moduleId: string): Promise<
    ApiResponse<{
      status: "healthy" | "unhealthy" | "degraded";
      responseTime: number;
      lastCheck: string;
      issues: Array<{
        type: string;
        message: string;
        severity: "low" | "medium" | "high";
      }>;
    }>
  > {
    return apiClient.get(this.SERVICE, `/modules/${moduleId}/health`);
  }

  // Bulk operations
  static async bulkActivateModules(
    moduleIds: string[],
  ): Promise<ApiResponse<{ activatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/modules/bulk-activate", {
      moduleIds,
    });
  }

  static async bulkDeactivateModules(
    moduleIds: string[],
  ): Promise<ApiResponse<{ deactivatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/modules/bulk-deactivate", {
      moduleIds,
    });
  }

  static async bulkDeleteModules(
    moduleIds: string[],
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiClient.post(this.SERVICE, "/modules/bulk-delete", { moduleIds });
  }

  // Export/Import
  static async exportModules(filters: ModuleFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);

    return apiClient.download(
      this.SERVICE,
      `/modules/export?${params.toString()}`,
    );
  }

  static async importModules(formData: FormData): Promise<
    ApiResponse<{
      successCount: number;
      errorCount: number;
      errors: Array<{ row: number; error: string }>;
    }>
  > {
    return apiClient.upload(this.SERVICE, "/modules/import", formData);
  }
}
