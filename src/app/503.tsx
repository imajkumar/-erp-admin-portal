"use client";

import { AlertTriangle, Clock, Home, RefreshCw, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function ServiceUnavailable() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo className="h-16 w-auto mx-auto" alt="Coca-Cola" />
        </div>

        {/* 503 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 animate-pulse">
            503
          </div>
          <div className="text-2xl font-semibold text-gray-700 mt-4 animate-bounce">
            Service Temporarily Unavailable
          </div>
        </div>

        {/* Server Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full animate-pulse">
            <Server className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Our servers are currently undergoing maintenance or experiencing
            high traffic.
          </p>
          <p className="text-sm text-gray-500">
            We're working hard to get everything back up and running smoothly!
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Service Status
            </span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">
              Maintenance in Progress
            </span>
          </div>
          <p className="text-xs text-gray-500">Estimated time: 15-30 minutes</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Help Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Need Immediate Help?
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            If you're experiencing persistent issues, please contact our support
            team.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:bg-orange-50"
            >
              Contact Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:bg-orange-50"
            >
              Status Page
            </Button>
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
