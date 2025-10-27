"use client";

import React, { useState, useEffect } from "react";
import PinInput from "./PinInput";
import { pinService, PinResponse } from "@/lib/api/services/pinService";
import {
  Lock,
  Shield,
  AlertCircle,
  Clock,
  Wifi,
  Battery,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LockScreenProps {
  onUnlock: () => void;
  userEmail?: string;
  userName?: string;
}

const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  userEmail = "Admin User",
  userName = "Admin User",
}) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pinStatus, setPinStatus] = useState<PinResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<"unlock" | "change" | "reset">("unlock");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showChangePinOption, setShowChangePinOption] = useState(false);
  const [showForgotPinOption, setShowForgotPinOption] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load PIN status on mount
  useEffect(() => {
    loadPinStatus();
  }, []);

  // Keyboard shortcuts for PIN options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+O or Cmd+O - Toggle Change PIN option
      if ((e.ctrlKey || e.metaKey) && e.key === "o") {
        e.preventDefault();
        setShowChangePinOption((prev) => {
          const newValue = !prev;
          // If hiding the change PIN option, reset to unlock mode
          if (!newValue) {
            setMode("unlock");
            setError(null);
            setSuccess(null);
            setPin("");
            setNewPin("");
            setConfirmPin("");
          }
          return newValue;
        });
      }

      // Ctrl+R or Cmd+R - Toggle Forgot PIN option
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        setShowForgotPinOption((prev) => {
          const newValue = !prev;
          // If hiding the forgot PIN option, reset to unlock mode
          if (!newValue) {
            setMode("unlock");
            setError(null);
            setSuccess(null);
            setPin("");
            setNewPin("");
            setConfirmPin("");
          }
          return newValue;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadPinStatus = async () => {
    try {
      const status = await pinService.getPinStatus();
      setPinStatus(status);
    } catch (err: any) {
      // Check if it's an authentication error
      if (err?.status === 401 || err?.statusCode === 401) {
        console.warn("Authentication required - token may be expired");
        // Redirect to login if token is invalid
        window.location.href = "/";
      } else {
        // Silently handle other errors - user may need to log in
        console.warn("Could not load PIN status");
        // Set default status to allow PIN entry
        setPinStatus({
          hasPin: true,
          isLocked: false,
          message: "Please enter your PIN",
        });
      }
    }
  };

  const handleUnlock = async () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await pinService.verifyPin({ pin });

      if (response.message.includes("successfully")) {
        onUnlock();
      } else {
        setError(response.message);
        setPin(""); // Clear PIN on error
      }
    } catch (err: any) {
      console.error("PIN verification error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error message:", err.message);
      setError(
        err.response?.data?.message || err.message || "Failed to verify PIN",
      );
      setPin(""); // Clear PIN on error
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async () => {
    // Validate current PIN
    if (pin.length !== 4) {
      setError("Please enter your current PIN");
      return;
    }

    // Validate new PIN
    if (newPin.length !== 4) {
      setError("New PIN must be 4 digits");
      return;
    }

    // Validate confirm PIN
    if (confirmPin.length !== 4) {
      setError("Please confirm your new PIN");
      return;
    }

    // Check if new PINs match
    if (newPin !== confirmPin) {
      setError("New PIN and confirmation do not match");
      return;
    }

    // Check if new PIN is same as current
    if (pin === newPin) {
      setError("New PIN must be different from current PIN");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // First verify current PIN
      const verifyResponse = await pinService.verifyPin({ pin });

      if (!verifyResponse.message.includes("successfully")) {
        setError("Current PIN is incorrect");
        setPin("");
        return;
      }

      // Then update to new PIN
      const updateResponse = await pinService.updatePin({
        pin: newPin,
        confirmPin: confirmPin,
      });

      if (updateResponse.message.includes("successfully")) {
        setSuccess(
          "PIN updated successfully! Please use your new PIN to unlock.",
        );
        // Clear all fields
        setPin("");
        setNewPin("");
        setConfirmPin("");
        // Switch back to unlock mode after 2 seconds
        setTimeout(() => {
          setMode("unlock");
          setSuccess(null);
        }, 2000);
      } else {
        setError(updateResponse.message);
      }
    } catch (err: any) {
      console.error("PIN change error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to change PIN",
      );
      setPin("");
      setNewPin("");
      setConfirmPin("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async () => {
    // Validate new PIN
    if (newPin.length !== 4) {
      setError("New PIN must be 4 digits");
      return;
    }

    // Validate confirm PIN
    if (confirmPin.length !== 4) {
      setError("Please confirm your new PIN");
      return;
    }

    // Check if new PINs match
    if (newPin !== confirmPin) {
      setError("New PIN and confirmation do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await pinService.resetPin({
        pin: newPin,
        confirmPin: confirmPin,
      });

      if (response.message.includes("successfully")) {
        setSuccess(
          "PIN reset successfully! You can now unlock with your new PIN.",
        );
        setNewPin("");
        setConfirmPin("");
        setMode("unlock");
        await loadPinStatus();

        // Auto-switch back to unlock mode after 2 seconds
        setTimeout(() => {
          setMode("unlock");
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("PIN reset error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to reset PIN",
      );
      setNewPin("");
      setConfirmPin("");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - User Info */}
        <div className="flex flex-col items-center lg:items-start space-y-6">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-blue-900"></div>
          </div>

          {/* User Info */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">{userName}</h2>
            <p className="text-blue-200 text-sm">Last login: 2 hours ago</p>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              All systems operational
            </span>
          </div>

          {/* Portal Access */}
          <div className="text-center lg:text-left">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              ERP Admin Portal
            </h3>
            <p className="text-blue-200 text-sm">Enter your PIN to continue</p>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
                  Ctrl+O
                </kbd>
                <span>Change PIN</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
                  Ctrl+R
                </kbd>
                <span>Reset PIN (Forgot)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - PIN Entry */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8">
            {/* Mode Toggle - Only show if Ctrl+O or Ctrl+R is pressed */}
            {(showChangePinOption || showForgotPinOption) && (
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setMode("unlock");
                    setError(null);
                    setSuccess(null);
                    setPin("");
                    setNewPin("");
                    setConfirmPin("");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === "unlock"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  Unlock
                </button>
                {showChangePinOption && (
                  <button
                    onClick={() => {
                      setMode("change");
                      setError(null);
                      setSuccess(null);
                      setPin("");
                      setNewPin("");
                      setConfirmPin("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      mode === "change"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    Change PIN
                  </button>
                )}
                {showForgotPinOption && (
                  <button
                    onClick={() => {
                      setMode("reset");
                      setError(null);
                      setSuccess(null);
                      setPin("");
                      setNewPin("");
                      setConfirmPin("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      mode === "reset"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    Reset PIN
                  </button>
                )}
              </div>
            )}

            {mode === "unlock" ? (
              <>
                {/* Unlock Mode - PIN Input */}
                <div className="mb-6">
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    placeholder="Enter 4-digit PIN"
                    showToggle={true}
                    className="mb-4"
                  />
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        if (pin.length < 4) {
                          setPin(pin + num.toString());
                        }
                      }}
                      className="w-16 h-16 bg-gray-700/50 hover:bg-gray-600/50 rounded-2xl flex items-center justify-center text-white text-xl font-medium transition-colors"
                    >
                      {num}
                    </button>
                  ))}

                  {/* Bottom row */}
                  <button className="w-16 h-16 bg-gray-700/50 hover:bg-gray-600/50 rounded-2xl flex items-center justify-center text-white transition-colors">
                    <Lock className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      if (pin.length < 4) {
                        setPin(pin + "0");
                      }
                    }}
                    className="w-16 h-16 bg-gray-700/50 hover:bg-gray-600/50 rounded-2xl flex items-center justify-center text-white text-xl font-medium transition-colors"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setPin(pin.slice(0, -1))}
                    className="w-16 h-16 bg-gray-700/50 hover:bg-gray-600/50 rounded-2xl flex items-center justify-center text-white transition-colors"
                  >
                    <span className="text-xl">⌫</span>
                  </button>
                </div>

                {/* Unlock Button */}
                <Button
                  onClick={handleUnlock}
                  disabled={loading || pin.length !== 4}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Unlocking..." : "Unlock System"}
                </Button>

                {/* Forgot PIN Link */}
                <button
                  onClick={() => {
                    setMode("reset");
                    setError(null);
                    setSuccess(null);
                    setPin("");
                    setNewPin("");
                    setConfirmPin("");
                  }}
                  className="w-full mt-4 text-center text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Forgot PIN? Reset it here
                </button>
              </>
            ) : (
              <>
                {/* Change PIN Mode */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Current PIN
                    </label>
                    <PinInput
                      value={pin}
                      onChange={setPin}
                      placeholder="Enter current PIN"
                      showToggle={true}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      New PIN
                    </label>
                    <PinInput
                      value={newPin}
                      onChange={setNewPin}
                      placeholder="Enter new PIN"
                      showToggle={true}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Confirm New PIN
                    </label>
                    <PinInput
                      value={confirmPin}
                      onChange={setConfirmPin}
                      placeholder="Confirm new PIN"
                      showToggle={true}
                    />
                  </div>
                </div>

                {/* Change PIN Button */}
                <Button
                  onClick={handleChangePin}
                  disabled={
                    loading ||
                    pin.length !== 4 ||
                    newPin.length !== 4 ||
                    confirmPin.length !== 4
                  }
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating PIN..." : "Update PIN"}
                </Button>
              </>
            )}

            {mode === "reset" && (
              <>
                {/* Reset PIN Mode - New PIN Input */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    Reset Your PIN
                  </h3>
                  <p className="text-gray-300 text-sm text-center mb-6">
                    Enter a new 4-digit PIN to replace your forgotten PIN
                  </p>

                  <div className="space-y-4">
                    {/* New PIN Input */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        New PIN
                      </label>
                      <PinInput
                        value={newPin}
                        onChange={setNewPin}
                        length={4}
                        disabled={loading}
                        className="justify-center"
                      />
                    </div>

                    {/* Confirm PIN Input */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Confirm New PIN
                      </label>
                      <PinInput
                        value={confirmPin}
                        onChange={setConfirmPin}
                        length={4}
                        disabled={loading}
                        className="justify-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Reset PIN Button */}
                <Button
                  onClick={handleResetPin}
                  disabled={
                    loading || newPin.length !== 4 || confirmPin.length !== 4
                  }
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Resetting PIN..." : "Reset PIN"}
                </Button>
              </>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                <AlertCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300 text-sm">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Right Panel - Clock */}
        <div className="flex flex-col items-center lg:items-end space-y-6">
          {/* Current Time */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-blue-200 text-sm">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Live Clock Button */}
          <button className="bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-full flex items-center gap-2 text-gray-300 text-sm transition-colors">
            <Clock className="h-4 w-4" />
            Live Clock
          </button>

          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Real-time System Clock
          </div>
        </div>
      </div>

      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold">ERP Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <Wifi className="h-5 w-5 text-white" />
          <div className="relative">
            <Bell className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Battery className="h-5 w-5 text-white" />
            <span className="text-white text-sm">85%</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <span className="text-white text-xs">
          © 2025 Bellpatra Digital. All rights reserved.
        </span>
        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">N</span>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
