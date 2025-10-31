"use client";

import React, { useState } from "react";
import PinManagement from "@/components/PinManagement";
import LockScreen from "@/components/LockScreen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Shield, Settings } from "lucide-react";

export default function PinSettingsPage() {
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowLockScreen(false);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setShowLockScreen(true);
  };

  if (showLockScreen) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PIN Management
        </h1>
        <p className="text-gray-600">
          Manage your 4-digit PIN for secure access to your account
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              PIN Status
            </CardTitle>
            <CardDescription>Check your current PIN status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowLockScreen(true)}
              className="w-full"
              variant="outline"
            >
              <Lock className="h-4 w-4 mr-2" />
              Test Lock Screen
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              PIN Settings
            </CardTitle>
            <CardDescription>Create or update your PIN</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowLockScreen(true)}
              className="w-full"
              variant="outline"
            >
              Manage PIN
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>PIN security features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 4-digit numeric PIN only</p>
              <p>• 3 failed attempts lockout</p>
              <p>• 15-minute lock duration</p>
              <p>• Secure encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PIN Management Component */}
      <Card>
        <CardHeader>
          <CardTitle>PIN Management</CardTitle>
          <CardDescription>
            Create, update, or delete your 4-digit PIN for secure access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PinManagement />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>PIN Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                PIN Requirements
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Must be exactly 4 digits</li>
                <li>• Only numbers (0-9) allowed</li>
                <li>• Cannot be all the same digit</li>
                <li>• Cannot be sequential (1234, 4321)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Security Features
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3 failed attempts = 15 min lockout</li>
                <li>• PIN is encrypted and secure</li>
                <li>• Last used timestamp tracked</li>
                <li>• Can be updated anytime</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
