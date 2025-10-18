"use client";

import React, { useState, useEffect } from "react";
import PinInput from "./PinInput";
import { pinService, PinResponse } from "@/lib/api/services/pinService";
import {
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PinManagementProps {
  onPinVerified?: () => void;
  onClose?: () => void;
}

const PinManagement: React.FC<PinManagementProps> = ({
  onPinVerified,
  onClose,
}) => {
  const [pinStatus, setPinStatus] = useState<PinResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // PIN creation/update states
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // PIN verification states
  const [verifyPin, setVerifyPin] = useState("");
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  useEffect(() => {
    loadPinStatus();
  }, []);

  const loadPinStatus = async () => {
    try {
      setLoading(true);
      const status = await pinService.getPinStatus();
      setPinStatus(status);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load PIN status");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePin = async () => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PIN and confirm PIN do not match");
      return;
    }

    // Additional validation for common weak PINs (temporarily disabled)
    // if (pin === '0000' || pin === '1111' || pin === '1234' || pin === '4321') {
    //   setError('Please choose a more secure PIN');
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);

      const response = await pinService.createPin({ pin, confirmPin });
      setPinStatus(response);
      setSuccess("PIN created successfully!");
      setShowCreateForm(false);
      setPin("");
      setConfirmPin("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async () => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PIN and confirm PIN do not match");
      return;
    }

    // Additional validation for common weak PINs (temporarily disabled)
    // if (pin === '0000' || pin === '1111' || pin === '1234' || pin === '4321') {
    //   setError('Please choose a more secure PIN');
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);

      const response = await pinService.updatePin({ pin, confirmPin });
      setPinStatus(response);
      setSuccess("PIN updated successfully!");
      setShowUpdateForm(false);
      setPin("");
      setConfirmPin("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async () => {
    if (verifyPin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await pinService.verifyPin({ pin: verifyPin });

      if (response.message.includes("successfully")) {
        setSuccess("PIN verified successfully!");
        setShowVerifyForm(false);
        setVerifyPin("");
        onPinVerified?.();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePin = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your PIN? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await pinService.deletePin();
      setPinStatus(response);
      setSuccess("PIN deleted successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete PIN");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  if (loading && !pinStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PIN Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            PIN Status
          </CardTitle>
          <CardDescription>Current status of your lock PIN</CardDescription>
        </CardHeader>
        <CardContent>
          {pinStatus && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${pinStatus.hasPin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span className="font-medium">
                  {pinStatus.hasPin ? "PIN is set up" : "No PIN set up"}
                </span>
              </div>

              {pinStatus.hasPin && (
                <>
                  <div className="text-sm text-gray-600">
                    <p>Created: {formatDate(pinStatus.createdAt)}</p>
                    <p>Last used: {formatDate(pinStatus.lastUsedAt)}</p>
                    {pinStatus.failedAttempts > 0 && (
                      <p className="text-orange-600">
                        Failed attempts: {pinStatus.failedAttempts}
                      </p>
                    )}
                  </div>

                  {pinStatus.isLocked && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        PIN is locked until {formatDate(pinStatus.lockedUntil)}{" "}
                        due to too many failed attempts.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* PIN Verification Form */}
      {showVerifyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Verify PIN</CardTitle>
            <CardDescription>
              Enter your PIN to unlock the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PinInput
              value={verifyPin}
              onChange={setVerifyPin}
              placeholder="Enter your 4-digit PIN"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleVerifyPin}
                disabled={loading || verifyPin.length !== 4}
                className="flex-1"
              >
                {loading ? "Verifying..." : "Verify PIN"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerifyForm(false);
                  setVerifyPin("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PIN Creation Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create PIN</CardTitle>
            <CardDescription>
              Create a 4-digit PIN for secure access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">PIN</label>
              <PinInput
                value={pin}
                onChange={setPin}
                placeholder="Enter 4-digit PIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm PIN
              </label>
              <PinInput
                value={confirmPin}
                onChange={setConfirmPin}
                placeholder="Confirm 4-digit PIN"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreatePin}
                disabled={
                  loading || pin.length !== 4 || confirmPin.length !== 4
                }
                className="flex-1"
              >
                {loading ? "Creating..." : "Create PIN"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setPin("");
                  setConfirmPin("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PIN Update Form */}
      {showUpdateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Update PIN</CardTitle>
            <CardDescription>Update your existing 4-digit PIN</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New PIN</label>
              <PinInput
                value={pin}
                onChange={setPin}
                placeholder="Enter new 4-digit PIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New PIN
              </label>
              <PinInput
                value={confirmPin}
                onChange={setConfirmPin}
                placeholder="Confirm new 4-digit PIN"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdatePin}
                disabled={
                  loading || pin.length !== 4 || confirmPin.length !== 4
                }
                className="flex-1"
              >
                {loading ? "Updating..." : "Update PIN"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpdateForm(false);
                  setPin("");
                  setConfirmPin("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!showCreateForm && !showUpdateForm && !showVerifyForm && (
        <div className="flex flex-wrap gap-2">
          {!pinStatus?.hasPin ? (
            <Button onClick={() => setShowCreateForm(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Create PIN
            </Button>
          ) : (
            <>
              <Button onClick={() => setShowVerifyForm(true)}>
                <Shield className="h-4 w-4 mr-2" />
                Verify PIN
              </Button>
              <Button variant="outline" onClick={() => setShowUpdateForm(true)}>
                Update PIN
              </Button>
              <Button variant="destructive" onClick={handleDeletePin}>
                Delete PIN
              </Button>
            </>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PinManagement;
