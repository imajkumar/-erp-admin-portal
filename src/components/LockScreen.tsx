"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, Shield, Clock, User, Settings, Bell, Wifi, Battery } from "lucide-react";

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
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [wifiStrength, setWifiStrength] = useState(4);
  const [notifications, setNotifications] = useState(3);
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
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Simulate battery and wifi changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev + (Math.random() - 0.5) * 2));
      setWifiStrength(prev => Math.max(1, Math.min(4, prev + (Math.random() - 0.5) * 0.5)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (pin === "9711") {
      setError("");
      // Success animation before unlock
      await new Promise(resolve => setTimeout(resolve, 800));
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            animationDelay: '1s'
          }}
        ></div>
      </div>

      {/* Enhanced Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/30 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }}
        />
      ))}

      {/* Enhanced Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '3s'}}></div>

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 text-white/80">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4" />
            <div className="flex space-x-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 bg-white/60 rounded-full transition-all duration-300 ${
                    i < wifiStrength ? 'bg-white' : 'bg-white/30'
                  }`}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifications}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Battery className="h-4 w-4" />
            <span className="text-xs">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4 animate-fade-in">
        {/* User Profile Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 animate-pulse">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 animate-ping"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{userName}</h1>
          <p className="text-gray-300 text-sm">Last login: {lastLogin}</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-xs">{systemStatus}</span>
          </div>
        </div>

        {/* Digital Clock with Enhanced Animation */}
        <div className="text-center mb-8">
          <div className="text-7xl font-mono font-bold text-white mb-2 animate-pulse bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {formatTime(currentTime)}
          </div>
          <div className="text-xl text-gray-300 animate-fade-in">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Lock Screen Card */}
        <Card className={`bg-white/10 backdrop-blur-md border-white/20 shadow-2xl animate-slide-up transition-all duration-1000 ${
          isUnlocking ? 'animate-success-glow' : ''
        }`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                isUnlocking ? 'animate-success-bounce bg-gradient-to-br from-green-500 to-green-600' : 'animate-bounce'
              }`}>
                {isUnlocking ? (
                  <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Lock className="h-10 w-10 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              ERP Admin Portal
            </h2>
            <p className="text-gray-300 animate-fade-in text-lg">
              {isUnlocking ? 'Unlocking...' : 'Enter your PIN to continue'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Number Input Field */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <Input
                  type="number"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="w-56 h-14 text-center text-3xl font-mono bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/25 focus:bg-white/25"
                  autoFocus
                />
              </div>

              {/* Enhanced PIN Dots Display */}
              <div className="flex justify-center space-x-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 border-2 border-white/30 rounded-xl flex items-center justify-center bg-white/10 transition-all duration-500 transform hover:scale-110 shadow-lg ${
                      pin.length > index ? 'border-blue-400 bg-blue-400/20 animate-pulse shadow-blue-400/25' : ''
                    } ${isUnlocking ? 'animate-success-pulse' : ''}`}
                  >
                    {showPin && pin[index] ? (
                      <span className="text-white text-2xl font-mono animate-fade-in">
                        {pin[index]}
                      </span>
                    ) : (
                      <div className={`w-3 h-3 bg-white/50 rounded-full transition-all duration-500 ${
                        pin.length > index ? 'bg-blue-400 scale-125 animate-ping shadow-lg' : ''
                      }`}></div>
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
                    isAnimating ? 'scale-95' : ''
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
                  isAnimating ? 'scale-95' : ''
                }`}
              >
                <Settings className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("0")}
                className={`h-16 text-white hover:bg-white/20 text-2xl font-mono transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                  isAnimating ? 'scale-95' : ''
                }`}
              >
                0
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("backspace")}
                className={`h-16 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110 rounded-xl shadow-lg hover:shadow-xl ${
                  isAnimating ? 'scale-95' : ''
                }`}
              >
                ⌫
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={pin.length !== 4 || isLoading}
              className={`w-full h-12 text-white font-semibold transition-all duration-500 transform hover:scale-105 relative overflow-hidden ${
                pin.length === 4 ? 'bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
              } ${isUnlocking ? 'animate-success-glow' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <span className="relative z-10">Unlock</span>
              )}
              {pin.length === 4 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2025 Bellpatra Digital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
