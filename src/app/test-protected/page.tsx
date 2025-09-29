"use client";

import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/auth";

export default function TestProtectedPage() {
  const handleLogout = () => {
    logout();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Protected Page Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page is protected and can only be accessed when logged in.
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
