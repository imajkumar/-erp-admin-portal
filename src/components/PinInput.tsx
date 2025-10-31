"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  showToggle?: boolean;
  placeholder?: string;
  className?: string;
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  length = 4,
  showToggle = true,
  placeholder = "Enter PIN",
  className = "",
}) => {
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    // Limit to exactly 4 digits
    const limitedValue = numericValue.slice(0, 4);

    onChange(limitedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, arrow keys, and tab
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }

    // Only allow numeric keys
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/\D/g, "").slice(0, 4);
    onChange(numericData);
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type={showPin ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          maxLength={4}
          className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          autoComplete="off"
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* PIN dots display - always 4 dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full border-2 ${
              index < value.length
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PinInput;
