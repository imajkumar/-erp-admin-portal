"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication tokens
        const authToken = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userData = localStorage.getItem("userData");

        if (!authToken || authToken.length < 10) {
          console.log("No valid auth token found");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if this is a demo token
        if (
          authToken.includes("demo-signature") ||
          authToken.includes("mock-jwt-token")
        ) {
          // Demo token - just check if we have user data
          if (userData) {
            try {
              const parsedUserData = JSON.parse(userData);
              if (parsedUserData && parsedUserData.email) {
                console.log("Demo authentication valid");
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
              }
            } catch (e) {
              console.log("Invalid user data in demo mode");
            }
          }
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // For real JWT tokens, validate expiration
        try {
          const tokenParts = authToken.split(".");
          if (tokenParts.length === 3) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if (tokenPayload.exp && tokenPayload.exp < currentTime) {
              console.log("Token expired, attempting refresh");
              // Token is expired, try to refresh
              if (refreshToken) {
                const refreshResponse = await fetch("/api/auth/refresh", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json();
                  localStorage.setItem(
                    "authToken",
                    refreshData.data.accessToken,
                  );
                  localStorage.setItem(
                    "refreshToken",
                    refreshData.data.refreshToken,
                  );
                  setIsAuthenticated(true);
                } else {
                  // Refresh failed, clear tokens and redirect to login
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("userData");
                  setIsAuthenticated(false);
                }
              } else {
                // No refresh token, clear and redirect
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userData");
                setIsAuthenticated(false);
              }
            } else {
              // Token is valid
              console.log("Token is valid");
              setIsAuthenticated(true);
            }
          } else {
            // Invalid JWT format
            console.log("Invalid JWT format");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          // Invalid token format, clear and redirect
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Don't redirect if we're already on the login page to prevent loops
      if (window.location.pathname !== "/") {
        const redirectUrl = searchParams.get("redirect") || "/dashboard";
        router.push(`/?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to access this page.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
