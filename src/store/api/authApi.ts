import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authServiceUrl, API_ENDPOINTS } from "@/config/env";
import { LoginRequest, LoginResponse, User, ApiResponse } from "../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const state = getState() as any;
      const token = state.auth?.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: `${authServiceUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Logout
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${authServiceUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Refresh token
    refreshToken: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: "POST",
        body: { refreshToken },
      }),
    }),

    // Get current user profile
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => API_ENDPOINTS.AUTH.PROFILE,
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (profileData) => ({
        url: API_ENDPOINTS.AUTH.PROFILE,
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Register new user
    register: builder.mutation<
      ApiResponse<User>,
      { email: string; password: string; firstName: string; lastName: string }
    >({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Verify OTP
    verifyOTP: builder.mutation<
      ApiResponse<null>,
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      ApiResponse<null>,
      {
        email: string;
        otp: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        method: "POST",
        body: data,
      }),
    }),

    // PIN operations
    createPin: builder.mutation<ApiResponse<null>, { pin: string }>({
      query: (data) => ({
        url: "/api/auth/create-pin",
        method: "POST",
        body: data,
      }),
    }),

    updatePin: builder.mutation<ApiResponse<null>, { pin: string }>({
      query: (data) => ({
        url: "/api/auth/update-pin",
        method: "POST",
        body: data,
      }),
    }),

    resetPin: builder.mutation<ApiResponse<null>, { pin: string }>({
      query: (data) => ({
        url: "/api/auth/reset-pin",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useCreatePinMutation,
  useUpdatePinMutation,
  useResetPinMutation,
} = authApi;
