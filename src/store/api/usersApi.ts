import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { usersServiceUrl, API_ENDPOINTS } from "@/config/env";
import { User, UserFilters, PaginatedResponse, ApiResponse } from "../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${usersServiceUrl}/users`,
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
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    // Get users list with filters
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

        return `?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),

    // Get single user by ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Create new user
    createUser: builder.mutation<
      ApiResponse<User>,
      Omit<User, "id" | "createdAt" | "updatedAt">
    >({
      query: (userData) => ({
        url: "",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Bulk delete users
    bulkDeleteUsers: builder.mutation<
      ApiResponse<{ deletedCount: number }>,
      string[]
    >({
      query: (userIds) => ({
        url: "/bulk-delete",
        method: "POST",
        body: { userIds },
      }),
      invalidatesTags: ["Users"],
    }),

    // Export users
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
          url: `/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    // Block/Unblock user
    toggleUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Users", { type: "User", id: "LIST" }],
    }),

    // Reset user password
    resetUserPassword: builder.mutation<
      ApiResponse<{ temporaryPassword: string }>,
      string
    >({
      query: (id) => ({
        url: `/${id}/reset-password`,
        method: "POST",
      }),
    }),

    // Login as user (admin only)
    loginAsUser: builder.mutation<ApiResponse<{ accessToken: string }>, string>(
      {
        query: (id) => ({
          url: `/${id}/login-as`,
          method: "POST",
        }),
      },
    ),

    // Get user activity logs
    getUserActivity: builder.query<
      ApiResponse<any[]>,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) =>
        `/${id}/activity?page=${page}&limit=${limit}`,
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
  useExportUsersMutation,
  useToggleUserStatusMutation,
  useResetUserPasswordMutation,
  useLoginAsUserMutation,
  useGetUserActivityQuery,
} = usersApi;
