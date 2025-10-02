import axios from "axios";

export const logout = async () => {
  try {
    // Get the auth token
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      // Call the logout API
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with local logout even if API call fails
  } finally {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");

    // Clear cookies for middleware
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirect to login page
    window.location.href = "/";
  }
};

export const isAuthenticated = (): boolean => {
  const authToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const userData = localStorage.getItem("userData");

  return !!(authToken && refreshToken && userData);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const getUserData = (): any | null => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};
