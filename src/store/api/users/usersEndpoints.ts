import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { usersServiceUrl } from "@/config/env";
import {
  User,
  UserFilters,
  PaginatedResponse,
  ApiResponse,
  Role,
} from "../../types";

export const usersEndpoints = createApi({
  reducerPath: "usersEndpoints",
  baseQuery: fetchBaseQuery({
    baseUrl: usersServiceUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const token = state.auth?.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Users", "User", "Roles", "Role", "Permissions", "Activity"],
  endpoints: (builder) => ({
    // User management endpoints
    getUsers: builder.query<PaginatedResponse<User>, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        if (filters.department) params.append("department", filters.department);
        if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.append("dateTo", filters.dateTo);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());

        return `/users?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<
      ApiResponse<User>,
      Omit<User, "id" | "createdAt" | "updatedAt">
    >({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Bulk operations
    bulkDeleteUsers: builder.mutation<
      ApiResponse<{ deletedCount: number }>,
      string[]
    >({
      query: (userIds) => ({
        url: "/users/bulk-delete",
        method: "POST",
        body: { userIds },
      }),
      invalidatesTags: ["Users"],
    }),

    bulkUpdateUsers: builder.mutation<
      ApiResponse<{ updatedCount: number }>,
      {
        userIds: string[];
        data: Partial<User>;
      }
    >({
      query: ({ userIds, data }) => ({
        url: "/users/bulk-update",
        method: "PUT",
        body: { userIds, data },
      }),
      invalidatesTags: ["Users"],
    }),

    // Export/Import
    exportUsers: builder.mutation<Blob, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        if (filters.department) params.append("department", filters.department);
        if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.append("dateTo", filters.dateTo);

        return {
          url: `/users/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    importUsers: builder.mutation<
      ApiResponse<{
        successCount: number;
        errorCount: number;
        errors: Array<{ row: number; error: string }>;
      }>,
      FormData
    >({
      query: (formData) => ({
        url: "/users/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),

    // User status management
    toggleUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    activateUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    deactivateUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    // Password management
    resetUserPassword: builder.mutation<
      ApiResponse<{ temporaryPassword: string }>,
      string
    >({
      query: (id) => ({
        url: `/users/${id}/reset-password`,
        method: "POST",
      }),
    }),

    changeUserPassword: builder.mutation<
      ApiResponse<null>,
      {
        id: string;
        newPassword: string;
        temporary?: boolean;
      }
    >({
      query: ({ id, newPassword, temporary = false }) => ({
        url: `/users/${id}/change-password`,
        method: "POST",
        body: { newPassword, temporary },
      }),
    }),

    // Admin actions
    loginAsUser: builder.mutation<ApiResponse<{ accessToken: string }>, string>(
      {
        query: (id) => ({
          url: `/users/${id}/login-as`,
          method: "POST",
        }),
      },
    ),

    // User activity and logs
    getUserActivity: builder.query<
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
      >,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) =>
        `/users/${id}/activity?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: "Activity", id }],
    }),

    getUserSessions: builder.query<
      ApiResponse<
        Array<{
          id: string;
          device: string;
          location: string;
          lastActive: string;
          current: boolean;
        }>
      >,
      string
    >({
      query: (id) => `/users/${id}/sessions`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    revokeUserSession: builder.mutation<
      ApiResponse<null>,
      {
        userId: string;
        sessionId: string;
      }
    >({
      query: ({ userId, sessionId }) => ({
        url: `/users/${userId}/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    // User preferences
    getUserPreferences: builder.query<
      ApiResponse<{
        theme: string;
        language: string;
        notifications: any;
        dashboard: any;
      }>,
      string
    >({
      query: (id) => `/users/${id}/preferences`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUserPreferences: builder.mutation<
      ApiResponse<null>,
      {
        id: string;
        preferences: any;
      }
    >({
      query: ({ id, preferences }) => ({
        url: `/users/${id}/preferences`,
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Role management endpoints
    getRoles: builder.query<
      ApiResponse<Role[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 20, search }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        return `/roles?${params.toString()}`;
      },
      providesTags: ["Roles"],
    }),

    getRoleById: builder.query<ApiResponse<Role>, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<
      ApiResponse<Role>,
      Omit<Role, "id" | "createdAt" | "updatedAt">
    >({
      query: (roleData) => ({
        url: "/roles",
        method: "POST",
        body: roleData,
      }),
      invalidatesTags: ["Roles"],
    }),

    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: string; data: Partial<Role> }
    >({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Roles", { type: "Role", id: "LIST" }],
    }),

    deleteRole: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    // Role permissions
    getRolePermissions: builder.query<
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
      >,
      string
    >({
      query: (roleId) => `/roles/${roleId}/permissions`,
      providesTags: (result, error, roleId) => [
        { type: "Permissions", id: roleId },
      ],
    }),

    updateRolePermissions: builder.mutation<
      ApiResponse<null>,
      {
        roleId: string;
        permissions: string[];
      }
    >({
      query: ({ roleId, permissions }) => ({
        url: `/roles/${roleId}/permissions`,
        method: "PUT",
        body: { permissions },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: "Permissions", id: roleId },
        "Roles",
      ],
    }),

    // User roles
    getUserRoles: builder.query<ApiResponse<Role[]>, string>({
      query: (userId) => `/users/${userId}/roles`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    assignUserRoles: builder.mutation<
      ApiResponse<null>,
      {
        userId: string;
        roleIds: string[];
      }
    >({
      query: ({ userId, roleIds }) => ({
        url: `/users/${userId}/roles`,
        method: "POST",
        body: { roleIds },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    removeUserRoles: builder.mutation<
      ApiResponse<null>,
      {
        userId: string;
        roleIds: string[];
      }
    >({
      query: ({ userId, roleIds }) => ({
        url: `/users/${userId}/roles`,
        method: "DELETE",
        body: { roleIds },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    // Statistics and analytics
    getUserStats: builder.query<
      ApiResponse<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        newUsersThisMonth: number;
        usersByRole: Array<{ role: string; count: number }>;
        usersByDepartment: Array<{ department: string; count: number }>;
      }>,
      void
    >({
      query: () => "/users/stats",
      providesTags: ["Users"],
    }),

    // Department management
    getDepartments: builder.query<
      ApiResponse<
        Array<{
          id: string;
          name: string;
          description: string;
          managerId: string;
          isActive: boolean;
        }>
      >,
      void
    >({
      query: () => "/departments",
      providesTags: ["Users"],
    }),

    createDepartment: builder.mutation<
      ApiResponse<{ id: string }>,
      {
        name: string;
        description: string;
        managerId?: string;
      }
    >({
      query: (data) => ({
        url: "/departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkDeleteUsersMutation,
  useBulkUpdateUsersMutation,
  useExportUsersMutation,
  useImportUsersMutation,
  useToggleUserStatusMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useResetUserPasswordMutation,
  useChangeUserPasswordMutation,
  useLoginAsUserMutation,
  useGetUserActivityQuery,
  useGetUserSessionsQuery,
  useRevokeUserSessionMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetUserRolesQuery,
  useAssignUserRolesMutation,
  useRemoveUserRolesMutation,
  useGetUserStatsQuery,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
} = usersEndpoints;
