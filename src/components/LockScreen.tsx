"use client";

import {
  Battery,
  Bell,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Settings,
  Shield,
  User,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [wifiStrength, setWifiStrength] = useState(4);
  const [notifications, _setNotifications] = useState(3);
  const [userName] = useState("Admin User");
  const [lastLogin] = useState("2 hours ago");
  const [systemStatus] = useState("All systems operational");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Simulate battery and wifi changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(20, prev + (Math.random() - 0.5) * 2));
      setWifiStrength((prev) =>
        Math.max(1, Math.min(4, prev + (Math.random() - 0.5) * 0.5)),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    const displayHours = date.getHours() % 12 || 12;

    return `${displayHours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 4) {
      setPin(value);
      setError("");
    }
  };

  const handleKeyPress = (key: string) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    if (key === "backspace") {
      setPin(pin.slice(0, -1));
      setError("");
    } else if (key >= "0" && key <= "9") {
      handlePinChange(pin + key);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setIsLoading(true);
    setIsUnlocking(true);

    // Simulate validation delay with beautiful animation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (pin === "9711") {
      setError("");
      // Success animation before unlock
      await new Promise((resolve) => setTimeout(resolve, 800));
      onUnlock();
    } else {
      setError("Invalid PIN. Please try again.");
      setPin("");
      setIsUnlocking(false);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    // Remove the other key handling to prevent double input
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M60 60c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            animationDelay: "2s",
          }}
        ></div>
      </div>

      {/* Subtle Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/20 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
        />
      ))}

      {/* Professional Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-float-slow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-slate-500/6 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "6s" }}
      ></div>

      {/* Professional Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 text-white/90">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-sm font-medium">ERP Admin</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-400" />
            <div className="flex space-x-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 bg-white/40 rounded-full transition-all duration-300 ${
                    i < wifiStrength ? "bg-green-400" : "bg-white/20"
                  }`}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-blue-400" />
            {notifications > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {notifications}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Battery className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium">
              {Math.round(batteryLevel)}%
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full h-full flex animate-fade-in">
        {/* Left Column - 50% Lock Screen */}
        <div className="w-1/2 flex flex-col items-center justify-center px-8">
          {/* Professional User Profile Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-white/10">
                <User className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {userName}
            </h1>
            <p className="text-slate-300 text-base mb-4">
              Last login: {lastLogin}
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                {systemStatus}
              </span>
            </div>
          </div>

          {/* Professional Lock Icon */}
          <div className="flex justify-center mb-10">
            <div
              className={`w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl border border-white/10 ${
                isUnlocking
                  ? "animate-success-bounce bg-gradient-to-br from-green-500 to-green-600"
                  : "hover:scale-105"
              }`}
            >
              {isUnlocking ? (
                <div className="w-16 h-16 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Lock className="h-16 w-16 text-white" />
              )}
            </div>
          </div>

          {/* Professional Portal Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              ERP Admin Portal
            </h2>
            <p className="text-slate-300 text-lg font-medium">
              {isUnlocking ? "Unlocking..." : "Enter your PIN to continue"}
            </p>
          </div>
        </div>

        {/* Right Column - 50% Professional Digital Clock */}
        <div className="w-1/2 flex flex-col items-center justify-center px-8 border-l border-white/10">
          {/* Professional Digital Clock */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md scale-102"></div>
              <div className="relative text-3xl font-mono font-bold text-white mb-6 tracking-wide drop-shadow-lg bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-xl text-slate-300 animate-fade-in mb-8 font-medium drop-shadow-lg">
              {formatDate(currentTime)}
            </div>

            {/* Professional Clock Info */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-full border border-white/20">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Live Clock</span>
              </div>
              <div className="text-slate-400 text-sm font-medium tracking-wide">
                REAL-TIME SYSTEM CLOCK
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional PIN Input Card - Bottom Center */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <Card
          className={`bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl animate-slide-up transition-all duration-1000 rounded-2xl ${
            isUnlocking ? "animate-success-glow" : ""
          }`}
        >
          <CardHeader className="text-center pb-6 pt-8">
            <h2 className="text-2xl font-bold text-white mb-3 animate-fade-in bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-tight">
              Enter PIN
            </h2>
            <p className="text-slate-300 animate-fade-in font-medium">
              {isUnlocking
                ? "Unlocking..."
                : "Enter your 4-digit PIN to continue"}
            </p>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {/* Professional Number Input Field */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <Input
                  type="number"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="w-64 h-16 text-center text-4xl font-mono bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/15 focus:bg-white/15 backdrop-blur-sm"
                  autoFocus
                />
              </div>

              {/* Professional PIN Dots Display */}
              <div className="flex justify-center space-x-5">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-18 h-18 border-2 border-white/20 rounded-2xl flex items-center justify-center bg-white/5 transition-all duration-500 transform hover:scale-110 shadow-xl backdrop-blur-sm ${
                      pin.length > index
                        ? "border-blue-400 bg-blue-400/20 animate-pulse shadow-blue-400/30"
                        : ""
                    } ${isUnlocking ? "animate-success-pulse" : ""}`}
                  >
                    {showPin && pin[index] ? (
                      <span className="text-white text-3xl font-mono animate-fade-in font-bold">
                        {pin[index]}
                      </span>
                    ) : (
                      <div
                        className={`w-4 h-4 bg-white/40 rounded-full transition-all duration-500 ${
                          pin.length > index
                            ? "bg-blue-400 scale-125 animate-ping shadow-lg"
                            : ""
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show/Hide PIN Toggle */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showPin ? "Hide PIN" : "Show PIN"}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center animate-shake">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Enhanced Number Pad */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  size="lg"
                  onClick={() => handleKeyPress(num.toString())}
                  className={`h-16 text-white hover:bg-white/20 text-2xl font-mono transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                    isAnimating ? "scale-95" : ""
                  }`}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 150);
                  setPin("");
                }}
                className={`h-16 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                  isAnimating ? "scale-95" : ""
                }`}
              >
                <Settings className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("0")}
                className={`h-16 text-white hover:bg-white/20 text-2xl font-mono transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                  isAnimating ? "scale-95" : ""
                }`}
              >
                0
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("backspace")}
                className={`h-16 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                  isAnimating ? "scale-95" : ""
                }`}
              >
                ⌫
              </Button>
            </div>

            {/* Professional Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={pin.length !== 4 || isLoading}
              className={`w-full h-14 text-white font-bold transition-all duration-500 transform hover:scale-105 relative overflow-hidden rounded-2xl shadow-xl ${
                pin.length === 4
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${isUnlocking ? "animate-success-glow" : ""}`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-lg">Verifying...</span>
                </div>
              ) : (
                <span className="relative z-10 text-lg">Unlock System</span>
              )}
              {pin.length === 4 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Professional Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          © 2025 Bellpatra Digital. All rights reserved.
        </p>
      </div>
    </div>
  );
}
