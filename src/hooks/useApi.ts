import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginSuccess,
  logoutSuccess,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "@/store/slices/authSlice";
import { AuthService, UsersService, ApiResponse } from "@/lib/api";

// Generic API hook for handling API calls with Redux integration
export function useApi() {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken } = useAppSelector((state) => state.auth);

  // Generic API call wrapper with error handling
  const apiCall = useCallback(
    async <T>(
      apiFunction: () => Promise<ApiResponse<T>>,
      onSuccess?: (data: T) => void,
      onError?: (error: any) => void,
    ): Promise<T | null> => {
      try {
        const response = await apiFunction();

        if (response.status === "success") {
          onSuccess?.(response.data);
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("API call failed:", error);
        onError?.(error);
        return null;
      }
    },
    [],
  );

  // Auth-specific API calls
  const auth = {
    login: useCallback(
      async (credentials: {
        email: string;
        password: string;
        rememberMe?: boolean;
      }) => {
        return apiCall(
          () => AuthService.login(credentials),
          (data) => {
            dispatch(loginSuccess(data));
            // Store tokens in localStorage
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
          },
        );
      },
      [dispatch, apiCall],
    ),

    logout: useCallback(async () => {
      return apiCall(
        () => AuthService.logout(),
        () => {
          dispatch(logoutSuccess());
          // Clear tokens from localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        },
      );
    }, [dispatch, apiCall]),

    refreshToken: useCallback(async () => {
      if (!refreshToken) return null;

      return apiCall(
        () => AuthService.refreshToken(refreshToken),
        (data) => {
          dispatch(refreshTokenSuccess(data));
          // Update tokens in localStorage
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        },
        () => {
          dispatch(refreshTokenFailure("Token refresh failed"));
          // Clear tokens from localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        },
      );
    }, [refreshToken, dispatch, apiCall]),

    getProfile: useCallback(async () => {
      return apiCall(() => AuthService.getProfile());
    }, [apiCall]),

    updateProfile: useCallback(
      async (profileData: any) => {
        return apiCall(() => AuthService.updateProfile(profileData));
      },
      [apiCall],
    ),

    updatePassword: useCallback(
      async (passwordData: {
        currentPassword: string;
        newPassword: string;
      }) => {
        return apiCall(() => AuthService.updatePassword(passwordData));
      },
      [apiCall],
    ),

    updateAvatar: useCallback(
      async (formData: FormData) => {
        return apiCall(() => AuthService.updateAvatar(formData));
      },
      [apiCall],
    ),

    register: useCallback(
      async (userData: any) => {
        return apiCall(() => AuthService.register(userData));
      },
      [apiCall],
    ),

    verifyEmail: useCallback(
      async (token: string) => {
        return apiCall(() => AuthService.verifyEmail(token));
      },
      [apiCall],
    ),

    resendVerification: useCallback(
      async (email: string) => {
        return apiCall(() => AuthService.resendVerification(email));
      },
      [apiCall],
    ),

    forgotPassword: useCallback(
      async (email: string) => {
        return apiCall(() => AuthService.forgotPassword(email));
      },
      [apiCall],
    ),

    resetPassword: useCallback(
      async (data: { token: string; password: string }) => {
        return apiCall(() => AuthService.resetPassword(data));
      },
      [apiCall],
    ),

    enable2FA: useCallback(async () => {
      return apiCall(() => AuthService.enable2FA());
    }, [apiCall]),

    verify2FA: useCallback(
      async (token: string) => {
        return apiCall(() => AuthService.verify2FA(token));
      },
      [apiCall],
    ),

    disable2FA: useCallback(
      async (password: string) => {
        return apiCall(() => AuthService.disable2FA(password));
      },
      [apiCall],
    ),

    getSessions: useCallback(async () => {
      return apiCall(() => AuthService.getSessions());
    }, [apiCall]),

    revokeSession: useCallback(
      async (sessionId: string) => {
        return apiCall(() => AuthService.revokeSession(sessionId));
      },
      [apiCall],
    ),

    revokeAllSessions: useCallback(async () => {
      return apiCall(() => AuthService.revokeAllSessions());
    }, [apiCall]),

    getSecurityLogs: useCallback(
      async (params: { page?: number; limit?: number } = {}) => {
        return apiCall(() => AuthService.getSecurityLogs(params));
      },
      [apiCall],
    ),

    deactivateAccount: useCallback(
      async (password: string) => {
        return apiCall(() => AuthService.deactivateAccount(password));
      },
      [apiCall],
    ),

    deleteAccount: useCallback(
      async (password: string) => {
        return apiCall(() => AuthService.deleteAccount(password));
      },
      [apiCall],
    ),

    getOAuthProviders: useCallback(async () => {
      return apiCall(() => AuthService.getOAuthProviders());
    }, [apiCall]),

    oauthLogin: useCallback(
      async (provider: string, code: string, state?: string) => {
        return apiCall(
          () => AuthService.oauthLogin(provider, code, state),
          (data) => {
            dispatch(loginSuccess(data));
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
          },
        );
      },
      [dispatch, apiCall],
    ),

    linkOAuthAccount: useCallback(
      async (provider: string, code: string, state?: string) => {
        return apiCall(() =>
          AuthService.linkOAuthAccount(provider, code, state),
        );
      },
      [apiCall],
    ),

    unlinkOAuthAccount: useCallback(
      async (provider: string) => {
        return apiCall(() => AuthService.unlinkOAuthAccount(provider));
      },
      [apiCall],
    ),
  };

  // Users-specific API calls
  const users = {
    getUsers: useCallback(
      async (filters: any = {}) => {
        return apiCall(() => UsersService.getUsers(filters) as any);
      },
      [apiCall],
    ),

    getUserById: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.getUserById(id));
      },
      [apiCall],
    ),

    createUser: useCallback(
      async (userData: any) => {
        return apiCall(() => UsersService.createUser(userData));
      },
      [apiCall],
    ),

    updateUser: useCallback(
      async (id: string, data: any) => {
        return apiCall(() => UsersService.updateUser(id, data));
      },
      [apiCall],
    ),

    deleteUser: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.deleteUser(id));
      },
      [apiCall],
    ),

    bulkDeleteUsers: useCallback(
      async (userIds: string[]) => {
        return apiCall(() => UsersService.bulkDeleteUsers(userIds));
      },
      [apiCall],
    ),

    bulkUpdateUsers: useCallback(
      async (userIds: string[], data: any) => {
        return apiCall(() => UsersService.bulkUpdateUsers(userIds, data));
      },
      [apiCall],
    ),

    exportUsers: useCallback(async (filters: any = {}) => {
      return UsersService.exportUsers(filters);
    }, []),

    importUsers: useCallback(
      async (formData: FormData) => {
        return apiCall(() => UsersService.importUsers(formData));
      },
      [apiCall],
    ),

    toggleUserStatus: useCallback(
      async (id: string, isActive: boolean) => {
        return apiCall(() => UsersService.toggleUserStatus(id, isActive));
      },
      [apiCall],
    ),

    activateUser: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.activateUser(id));
      },
      [apiCall],
    ),

    deactivateUser: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.deactivateUser(id));
      },
      [apiCall],
    ),

    resetUserPassword: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.resetUserPassword(id));
      },
      [apiCall],
    ),

    changeUserPassword: useCallback(
      async (id: string, newPassword: string, temporary = false) => {
        return apiCall(() =>
          UsersService.changeUserPassword(id, newPassword, temporary),
        );
      },
      [apiCall],
    ),

    loginAsUser: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.loginAsUser(id));
      },
      [apiCall],
    ),

    getUserActivity: useCallback(
      async (id: string, page = 1, limit = 10) => {
        return apiCall(() => UsersService.getUserActivity(id, page, limit));
      },
      [apiCall],
    ),

    getUserSessions: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.getUserSessions(id));
      },
      [apiCall],
    ),

    revokeUserSession: useCallback(
      async (userId: string, sessionId: string) => {
        return apiCall(() => UsersService.revokeUserSession(userId, sessionId));
      },
      [apiCall],
    ),

    getUserPreferences: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.getUserPreferences(id));
      },
      [apiCall],
    ),

    updateUserPreferences: useCallback(
      async (id: string, preferences: any) => {
        return apiCall(() =>
          UsersService.updateUserPreferences(id, preferences),
        );
      },
      [apiCall],
    ),

    getRoles: useCallback(
      async (params: any = {}) => {
        return apiCall(() => UsersService.getRoles(params));
      },
      [apiCall],
    ),

    getRoleById: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.getRoleById(id));
      },
      [apiCall],
    ),

    createRole: useCallback(
      async (roleData: any) => {
        return apiCall(() => UsersService.createRole(roleData));
      },
      [apiCall],
    ),

    updateRole: useCallback(
      async (id: string, data: any) => {
        return apiCall(() => UsersService.updateRole(id, data));
      },
      [apiCall],
    ),

    deleteRole: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.deleteRole(id));
      },
      [apiCall],
    ),

    getRolePermissions: useCallback(
      async (roleId: string) => {
        return apiCall(() => UsersService.getRolePermissions(roleId));
      },
      [apiCall],
    ),

    updateRolePermissions: useCallback(
      async (roleId: string, permissions: string[]) => {
        return apiCall(() =>
          UsersService.updateRolePermissions(roleId, permissions),
        );
      },
      [apiCall],
    ),

    getUserRoles: useCallback(
      async (userId: string) => {
        return apiCall(() => UsersService.getUserRoles(userId));
      },
      [apiCall],
    ),

    assignUserRoles: useCallback(
      async (userId: string, roleIds: string[]) => {
        return apiCall(() => UsersService.assignUserRoles(userId, roleIds));
      },
      [apiCall],
    ),

    removeUserRoles: useCallback(
      async (userId: string, roleIds: string[]) => {
        return apiCall(() => UsersService.removeUserRoles(userId, roleIds));
      },
      [apiCall],
    ),

    getUserStats: useCallback(async () => {
      return apiCall(() => UsersService.getUserStats());
    }, [apiCall]),

    getDepartments: useCallback(async () => {
      return apiCall(() => UsersService.getDepartments());
    }, [apiCall]),

    createDepartment: useCallback(
      async (data: any) => {
        return apiCall(() => UsersService.createDepartment(data));
      },
      [apiCall],
    ),

    updateDepartment: useCallback(
      async (id: string, data: any) => {
        return apiCall(() => UsersService.updateDepartment(id, data));
      },
      [apiCall],
    ),

    deleteDepartment: useCallback(
      async (id: string) => {
        return apiCall(() => UsersService.deleteDepartment(id));
      },
      [apiCall],
    ),
  };

  return {
    auth,
    users,
    apiCall,
  };
}
