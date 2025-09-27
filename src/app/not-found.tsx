"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo className="h-16 w-auto mx-auto" alt="Coca-Cola" />
        </div>

        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </div>
          <div className="text-2xl font-semibold text-gray-700 mt-4 animate-bounce">
            Oops! Page Not Found
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-4">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Looking for something specific?</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Try searching for what you need or check out our main sections:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => router.push('/dashboard/products')}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              Products
            </Button>
            <Button
              onClick={() => router.push('/dashboard/about')}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              About
            </Button>
            <Button
              onClick={() => router.push('/dashboard/settings')}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8">
          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400">
          <p>© 2024 Coca-Cola ERP System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
