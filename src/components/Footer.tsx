"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react";

export default function Footer() {
  const [time, setTime] = useState<Date | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize time on client side only
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '--, --- --, ----';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return <Battery className="h-3 w-3 text-green-500" />;
    if (batteryLevel > 25) return <Battery className="h-3 w-3 text-yellow-500" />;
    return <BatteryLow className="h-3 w-3 text-red-500" />;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gray-50 text-gray-600 border-t border-gray-200 shadow-lg">
      <div className="px-3 py-1.5">
        <div className="flex items-center justify-between">
          {/* Left Side - Quick Actions and Copyright */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 p-1.5 h-6"
              title="Start Menu"
            >
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">W</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 p-1.5 h-6"
              title="Search"
            >
              <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">S</span>
              </div>
            </Button>
            
            <div className="text-xs text-gray-500">
              © 2025
            </div>
            
            <div className="text-xs text-gray-500">
              Powered by <a href="https://bellpatra.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Bellpatra Digital</a>
            </div>
          </div>

          {/* Right Side - Digital Clock and System Status */}
          <div className="flex items-center space-x-4">
            {/* Digital Clock */}
            <div className="text-center">
              <div className="text-sm font-mono font-medium text-gray-800">
                {formatTime(time)}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(time)}
              </div>
            </div>
            
            {/* System Status Icons */}
            <div className="flex items-center space-x-1">
              {/* WiFi */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 p-1 h-6"
              title={isWifiConnected ? "WiFi Connected" : "WiFi Disconnected"}
            >
              {isWifiConnected ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
            </Button>

            {/* Volume */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-600 hover:bg-gray-100 p-1 h-6"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-3 w-3 text-red-500" />
              ) : (
                <Volume2 className="h-3 w-3 text-green-500" />
              )}
            </Button>

            {/* Battery */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 p-1 h-6"
              title={`Battery ${batteryLevel}%`}
            >
              {getBatteryIcon()}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100 p-1 h-6"
              title="Settings"
            >
              <Settings className="h-3 w-3" />
            </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
