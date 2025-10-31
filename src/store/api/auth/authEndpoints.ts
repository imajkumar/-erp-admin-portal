import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authServiceUrl } from "@/config/env";
import { LoginRequest, LoginResponse, User, ApiResponse } from "../../types";

export const authEndpoints = createApi({
  reducerPath: "authEndpoints",
  baseQuery: fetchBaseQuery({
    baseUrl: authServiceUrl,
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
  tagTypes: ["Auth", "User", "Profile"],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User", "Profile"],
    }),

    refreshToken: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: "/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    // User profile endpoints
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile", "User"],
    }),

    updatePassword: builder.mutation<
      ApiResponse<null>,
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/profile/password",
        method: "PUT",
        body: data,
      }),
    }),

    updateAvatar: builder.mutation<
      ApiResponse<{ avatarUrl: string }>,
      FormData
    >({
      query: (formData) => ({
        url: "/profile/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Registration endpoints
    register: builder.mutation<
      ApiResponse<User>,
      {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        company?: string;
        phone?: string;
      }
    >({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
      query: (data) => ({
        url: "/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    resendVerification: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "/resend-verification",
        method: "POST",
        body: data,
      }),
    }),

    // Password reset endpoints
    forgotPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<null>,
      { token: string; password: string }
    >({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Two-factor authentication endpoints
    enable2FA: builder.mutation<
      ApiResponse<{ qrCode: string; secret: string }>,
      void
    >({
      query: () => ({
        url: "/2fa/enable",
        method: "POST",
      }),
    }),

    verify2FA: builder.mutation<ApiResponse<null>, { token: string }>({
      query: (data) => ({
        url: "/2fa/verify",
        method: "POST",
        body: data,
      }),
    }),

    disable2FA: builder.mutation<ApiResponse<null>, { password: string }>({
      query: (data) => ({
        url: "/2fa/disable",
        method: "POST",
        body: data,
      }),
    }),

    // Session management endpoints
    getSessions: builder.query<
      ApiResponse<
        Array<{
          id: string;
          device: string;
          location: string;
          lastActive: string;
          current: boolean;
        }>
      >,
      void
    >({
      query: () => "/sessions",
      providesTags: ["Auth"],
    }),

    revokeSession: builder.mutation<ApiResponse<null>, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),

    revokeAllSessions: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/sessions/revoke-all",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Security endpoints
    getSecurityLogs: builder.query<
      ApiResponse<
        Array<{
          id: string;
          action: string;
          ip: string;
          userAgent: string;
          timestamp: string;
          success: boolean;
        }>
      >,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) =>
        `/security-logs?page=${page}&limit=${limit}`,
      providesTags: ["Auth"],
    }),

    // Account management endpoints
    deactivateAccount: builder.mutation<
      ApiResponse<null>,
      { password: string }
    >({
      query: (data) => ({
        url: "/account/deactivate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User", "Profile"],
    }),

    deleteAccount: builder.mutation<ApiResponse<null>, { password: string }>({
      query: (data) => ({
        url: "/account/delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Auth", "User", "Profile"],
    }),

    // OAuth endpoints
    getOAuthProviders: builder.query<
      ApiResponse<
        Array<{
          id: string;
          name: string;
          enabled: boolean;
          clientId: string;
        }>
      >,
      void
    >({
      query: () => "/oauth/providers",
    }),

    oauthLogin: builder.mutation<
      ApiResponse<LoginResponse>,
      {
        provider: string;
        code: string;
        state?: string;
      }
    >({
      query: (data) => ({
        url: `/oauth/${data.provider}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    linkOAuthAccount: builder.mutation<
      ApiResponse<null>,
      {
        provider: string;
        code: string;
        state?: string;
      }
    >({
      query: (data) => ({
        url: `/oauth/${data.provider}/link`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    unlinkOAuthAccount: builder.mutation<
      ApiResponse<null>,
      { provider: string }
    >({
      query: ({ provider }) => ({
        url: `/oauth/${provider}/unlink`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useEnable2FAMutation,
  useVerify2FAMutation,
  useDisable2FAMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useGetSecurityLogsQuery,
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
  useGetOAuthProvidersQuery,
  useOauthLoginMutation,
  useLinkOAuthAccountMutation,
  useUnlinkOAuthAccountMutation,
} = authEndpoints;
