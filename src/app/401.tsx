"use client";

import { AlertTriangle, Home, Lock, LogIn, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { JiraButton } from "@/components/ui/jira-button";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo className="h-16 w-auto mx-auto" alt="Coca-Cola" />
        </div>

        {/* 401 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 animate-pulse">
            401
          </div>
          <div className="text-2xl font-semibold text-gray-700 mt-4 animate-bounce">
            Unauthorized Access
          </div>
        </div>

        {/* Lock Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full animate-pulse">
            <Lock className="h-10 w-10 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-4">
            You don't have permission to access this resource.
          </p>
          <p className="text-sm text-gray-500">
            Please log in with valid credentials or contact your administrator.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Security Notice
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This area requires proper authentication. Your access attempt has
            been logged for security purposes.
          </p>
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-500">Access Denied</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <JiraButton
            onClick={() => router.push("/api/auth/login")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </JiraButton>

          <JiraButton
            onClick={() => router.push("/dashboard")}
            variant="text"
            className="border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </JiraButton>
        </div>

        {/* Help Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Need Help?
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            If you believe you should have access to this resource, please
            contact your system administrator.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <JiraButton variant="text" className="text-red-600 hover:bg-red-50">
              Contact Admin
            </JiraButton>
            <JiraButton variant="text" className="text-red-600 hover:bg-red-50">
              Forgot Password
            </JiraButton>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400">
          <p>© 2024 Coca-Cola ERP System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
