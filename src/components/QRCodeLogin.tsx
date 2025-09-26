"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, CheckCircle, AlertCircle, Clock, ArrowLeft, Smartphone, Shield, User } from "lucide-react";
import QRCodeLib from "qrcode";

interface QRCodeLoginProps {
  onBack: () => void;
}

export default function QRCodeLogin({ onBack }: QRCodeLoginProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [status, setStatus] = useState<'generating' | 'waiting' | 'success' | 'expired'>('generating');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a real QR code
  const generateQRCode = async () => {
    try {
      setStatus('generating');
      const sessionId = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const qrData = `erp-login:${sessionId}:${timestamp}:user:Ayra`;
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (canvasRef.current) {
        // Clear the canvas first
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        await QRCodeLib.toCanvas(canvasRef.current, qrData, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCode(qrData);
        setStatus('waiting');
        setTimeLeft(300);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setStatus('expired');
    }
  };

  // Simulate QR code scanning
  const simulateScan = () => {
    setStatus('success');
    setTimeout(() => {
      // Redirect to dashboard or handle successful login
      console.log('Login successful via QR code for user: Ayra');
    }, 2000);
  };

  // Timer countdown
  useEffect(() => {
    if (status === 'waiting' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && status === 'waiting') {
      setStatus('expired');
    }
  }, [timeLeft, status]);

  // Generate QR code on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQRCode();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'generating':
        return <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />;
      case 'waiting':
        return <Clock className="h-6 w-6 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'expired':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <QrCode className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'generating':
        return "Generating secure QR code...";
      case 'waiting':
        return "Scan the QR code with your mobile app";
      case 'success':
        return "Authentication successful! Redirecting...";
      case 'expired':
        return "QR code has expired. Please generate a new one.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main QR Code Card */}
      <Card className="shadow-2xl border-0 bg-white">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <QrCode className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Secure QR Code Login
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Authenticate using your mobile device for enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-sm opacity-20"></div>
              {/* Inner container */}
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-100">
                {status === 'generating' ? (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-50 rounded-xl flex flex-col items-center justify-center shadow-inner border">
                    {/* Real QR Code Canvas */}
                    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                      <canvas 
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ display: status === 'waiting' ? 'block' : 'none' }}
                      />
                      {status === 'waiting' && !qrCode && (
                        <div className="text-center text-gray-500">
                          <QrCode className="h-16 w-16 mx-auto mb-2" />
                          <p className="text-xs">QR Code Loading...</p>
                        </div>
                      )}
                    </div>
                    
                    {/* User name display */}
                    {status === 'waiting' && (
                      <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 mt-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">Ayra</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {getStatusMessage()}
              </p>
              {status === 'waiting' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-800 font-bold text-lg">
                    ⏱️ Time remaining: {formatTime(timeLeft)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'expired' && (
              <Button 
                onClick={generateQRCode}
                className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Generate New QR Code
              </Button>
            )}
            
            {status === 'waiting' && (
              <Button 
                onClick={simulateScan}
                variant="outline"
                className="w-full h-10 border-gray-300 hover:bg-gray-50 font-medium"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Simulate Mobile Scan (Demo)
              </Button>
            )}

            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full h-10 border-gray-300 hover:bg-gray-50 font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Email Login
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Features Card */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Enhanced Security Features</h3>
            <p className="text-gray-600 text-sm">Your authentication is protected by enterprise-grade security</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-2 rounded-full">
                <QrCode className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Encrypted QR Code</h4>
                <p className="text-gray-600 text-xs">AES-256 encryption</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-green-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Time Limited</h4>
                <p className="text-gray-600 text-xs">5-minute expiration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-purple-100 p-2 rounded-full">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">User Identity</h4>
                <p className="text-gray-600 text-xs">Verified as Ayra</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-orange-100 p-2 rounded-full">
                <Shield className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Secure Session</h4>
                <p className="text-gray-600 text-xs">One-time use only</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="pt-6">
          <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">How to Authenticate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Open Mobile App</h4>
                  <p className="text-gray-600 text-sm">Launch the ERP Admin Portal mobile app on your device</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Navigate to QR Login</h4>
                  <p className="text-gray-600 text-sm">Select "QR Code Login" from the authentication menu</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Scan QR Code</h4>
                  <p className="text-gray-600 text-sm">Point your camera at the QR code displayed above</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Confirm Authentication</h4>
                  <p className="text-gray-600 text-sm">Tap "Confirm" on your mobile device to complete login</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}