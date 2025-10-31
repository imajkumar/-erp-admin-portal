import { apiClient, ApiResponse } from "../client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "read" | "archived";
  userId: string;
  category: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "email" | "sms" | "push" | "in_app";
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  search?: string;
  type?: string;
  priority?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export class NotificationsService {
  private static readonly SERVICE = "notifications" as const;

  // Notification management endpoints
  static async getNotifications(
    filters: NotificationFilters = {},
  ): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient.get(this.SERVICE, `/notifications?${params.toString()}`);
  }

  static async getNotificationById(
    id: string,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.get(this.SERVICE, `/notifications/${id}`);
  }

  static async createNotification(
    notificationData: Omit<
      Notification,
      "id" | "createdAt" | "updatedAt" | "readAt"
    >,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.post(this.SERVICE, "/notifications", notificationData);
  }

  static async updateNotification(
    id: string,
    data: Partial<Notification>,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.put(this.SERVICE, `/notifications/${id}`, data);
  }

  static async deleteNotification(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/notifications/${id}`);
  }

  // Notification status management
  static async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.patch(this.SERVICE, `/notifications/${id}/read`);
  }

  static async markAsUnread(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.patch(this.SERVICE, `/notifications/${id}/unread`);
  }

  static async markAllAsRead(): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/mark-all-read");
  }

  static async archiveNotification(
    id: string,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.patch(this.SERVICE, `/notifications/${id}/archive`);
  }

  static async unarchiveNotification(
    id: string,
  ): Promise<ApiResponse<Notification>> {
    return apiClient.patch(this.SERVICE, `/notifications/${id}/unarchive`);
  }

  // Bulk operations
  static async bulkMarkAsRead(
    notificationIds: string[],
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/bulk-read", {
      notificationIds,
    });
  }

  static async bulkMarkAsUnread(
    notificationIds: string[],
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/bulk-unread", {
      notificationIds,
    });
  }

  static async bulkArchive(
    notificationIds: string[],
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/bulk-archive", {
      notificationIds,
    });
  }

  static async bulkDelete(
    notificationIds: string[],
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/bulk-delete", {
      notificationIds,
    });
  }

  // Notification sending
  static async sendNotification(data: {
    userIds: string[];
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    priority: "low" | "medium" | "high" | "urgent";
    category: string;
    metadata?: any;
  }): Promise<ApiResponse<{ sentCount: number; failedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/send", data);
  }

  static async sendBulkNotification(data: {
    userIds: string[];
    templateId: string;
    variables: Record<string, any>;
    metadata?: any;
  }): Promise<ApiResponse<{ sentCount: number; failedCount: number }>> {
    return apiClient.post(this.SERVICE, "/notifications/send-bulk", data);
  }

  // Notification templates
  static async getTemplates(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    } = {},
  ): Promise<ApiResponse<NotificationTemplate[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 20).toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.type) queryParams.append("type", params.type);

    return apiClient.get(this.SERVICE, `/templates?${queryParams.toString()}`);
  }

  static async getTemplateById(
    id: string,
  ): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.get(this.SERVICE, `/templates/${id}`);
  }

  static async createTemplate(
    templateData: Omit<NotificationTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.post(this.SERVICE, "/templates", templateData);
  }

  static async updateTemplate(
    id: string,
    data: Partial<NotificationTemplate>,
  ): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.put(this.SERVICE, `/templates/${id}`, data);
  }

  static async deleteTemplate(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/templates/${id}`);
  }

  static async toggleTemplateStatus(
    id: string,
    isActive: boolean,
  ): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.patch(this.SERVICE, `/templates/${id}/status`, {
      isActive,
    });
  }

  // Notification preferences
  static async getUserPreferences(userId: string): Promise<
    ApiResponse<{
      email: boolean;
      sms: boolean;
      push: boolean;
      inApp: boolean;
      categories: Record<string, boolean>;
      quietHours: {
        enabled: boolean;
        start: string;
        end: string;
        timezone: string;
      };
    }>
  > {
    return apiClient.get(this.SERVICE, `/users/${userId}/preferences`);
  }

  static async updateUserPreferences(
    userId: string,
    preferences: any,
  ): Promise<ApiResponse<null>> {
    return apiClient.put(
      this.SERVICE,
      `/users/${userId}/preferences`,
      preferences,
    );
  }

  // Notification categories
  static async getCategories(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        color: string;
        icon: string;
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(this.SERVICE, "/categories");
  }

  static async createCategory(data: {
    name: string;
    description: string;
    color: string;
    icon: string;
  }): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post(this.SERVICE, "/categories", data);
  }

  static async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
    },
  ): Promise<ApiResponse<null>> {
    return apiClient.put(this.SERVICE, `/categories/${id}`, data);
  }

  static async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(this.SERVICE, `/categories/${id}`);
  }

  // Notification statistics
  static async getNotificationStats(): Promise<
    ApiResponse<{
      totalNotifications: number;
      unreadNotifications: number;
      readNotifications: number;
      archivedNotifications: number;
      notificationsByType: Array<{ type: string; count: number }>;
      notificationsByPriority: Array<{ priority: string; count: number }>;
      recentActivity: Array<{
        id: string;
        action: string;
        timestamp: string;
      }>;
    }>
  > {
    return apiClient.get(this.SERVICE, "/notifications/stats");
  }

  static async getUserNotificationStats(userId: string): Promise<
    ApiResponse<{
      totalNotifications: number;
      unreadNotifications: number;
      readNotifications: number;
      archivedNotifications: number;
      notificationsByType: Array<{ type: string; count: number }>;
      notificationsByPriority: Array<{ priority: string; count: number }>;
    }>
  > {
    return apiClient.get(this.SERVICE, `/users/${userId}/notifications/stats`);
  }

  // Notification logs
  static async getNotificationLogs(
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

    return apiClient.get(this.SERVICE, `/logs?${queryParams.toString()}`);
  }

  // Real-time notifications (WebSocket)
  static async subscribeToNotifications(userId: string): Promise<WebSocket> {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8083"}/notifications/${userId}`;
    return new WebSocket(wsUrl);
  }

  // Export/Import
  static async exportNotifications(
    filters: NotificationFilters = {},
  ): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    return apiClient.download(
      this.SERVICE,
      `/notifications/export?${params.toString()}`,
    );
  }

  static async importNotifications(formData: FormData): Promise<
    ApiResponse<{
      successCount: number;
      errorCount: number;
      errors: Array<{ row: number; error: string }>;
    }>
  > {
    return apiClient.upload(this.SERVICE, "/notifications/import", formData);
  }
}
