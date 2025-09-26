"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

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
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      }));
      setParticles(newParticles);
    };

    generateParticles();
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
    } else if (e.key === "Backspace") {
      handleKeyPress("backspace");
    } else if (e.key >= "0" && e.key <= "9") {
      handleKeyPress(e.key);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        {/* Digital Clock with Animation */}
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-white mb-2 animate-pulse">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg text-gray-300 animate-fade-in">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Lock Screen Card */}
        <Card className={`bg-white/10 backdrop-blur-md border-white/20 shadow-2xl animate-slide-up transition-all duration-1000 ${
          isUnlocking ? 'animate-success-glow' : ''
        }`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center transition-all duration-500 ${
                isUnlocking ? 'animate-success-bounce bg-green-500' : 'animate-bounce'
              }`}>
                {isUnlocking ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Lock className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2 animate-fade-in">
              ERP Admin Portal
            </h2>
            <p className="text-gray-300 animate-fade-in">
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
                  className="w-48 h-12 text-center text-2xl font-mono bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                  autoFocus
                />
              </div>

              {/* PIN Dots Display */}
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 border-2 border-white/30 rounded-lg flex items-center justify-center bg-white/10 transition-all duration-500 transform hover:scale-105 ${
                      pin.length > index ? 'border-blue-400 bg-blue-400/20 animate-pulse' : ''
                    } ${isUnlocking ? 'animate-success-pulse' : ''}`}
                  >
                    {showPin && pin[index] ? (
                      <span className="text-white text-xl font-mono animate-fade-in">
                        {pin[index]}
                      </span>
                    ) : (
                      <div className={`w-2 h-2 bg-white/50 rounded-full transition-all duration-500 ${
                        pin.length > index ? 'bg-blue-400 scale-125 animate-ping' : ''
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

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  size="lg"
                  onClick={() => handleKeyPress(num.toString())}
                  className={`h-12 text-white hover:bg-white/20 text-xl font-mono transition-all duration-200 transform hover:scale-105 ${
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
                className={`h-12 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105 ${
                  isAnimating ? 'scale-95' : ''
                }`}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("0")}
                className={`h-12 text-white hover:bg-white/20 text-xl font-mono transition-all duration-200 transform hover:scale-105 ${
                  isAnimating ? 'scale-95' : ''
                }`}
              >
                0
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleKeyPress("backspace")}
                className={`h-12 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105 ${
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
