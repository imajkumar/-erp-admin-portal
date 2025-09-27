import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { authApi } from "@/store/api/authApi";
import {
  loginSuccess,
  logoutSuccess,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "@/store/slices/authSlice";

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Handle successful login
  if (authApi.endpoints.login.matchFulfilled(action)) {
    const { data } = action.payload;
    store.dispatch(loginSuccess(data));

    // Store tokens in localStorage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  // Handle successful logout
  if (authApi.endpoints.logout.matchFulfilled(action)) {
    store.dispatch(logoutSuccess());

    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  // Handle successful token refresh
  if (authApi.endpoints.refreshToken.matchFulfilled(action)) {
    const { data } = action.payload;
    store.dispatch(refreshTokenSuccess(data));

    // Update tokens in localStorage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  // Handle failed token refresh
  if (authApi.endpoints.refreshToken.matchRejected(action)) {
    store.dispatch(refreshTokenFailure("Token refresh failed"));

    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  return next(action);
};

// Initialize auth state from localStorage
export const initializeAuthFromStorage = (store: any) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const userStr = localStorage.getItem("user");

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      store.dispatch(
        loginSuccess({
          user,
          accessToken,
          refreshToken,
          expiresIn: 3600, // Default 1 hour
        }),
      );
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }
};
