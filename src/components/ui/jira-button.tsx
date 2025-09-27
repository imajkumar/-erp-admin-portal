import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JiraButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  variant?: "icon" | "text" | "create";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  debounceMs?: number;
}

export const JiraButton = React.forwardRef<HTMLButtonElement, JiraButtonProps>(
  (
    {
      children,
      onClick,
      className,
      title,
      variant = "icon",
      size = "default",
      disabled = false,
      type = "button",
      debounceMs = 300,
      ...props
    },
    ref,
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastClickTime = useRef<number>(0);

    const baseClasses =
      "transition-all duration-200 rounded-md relative overflow-hidden";

    const variantClasses = {
      icon: "text-gray-600 hover:bg-blue-50 hover:text-blue-600 p-1.5 h-7 w-7",
      text: "text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-2 py-1 h-7",
      create:
        "bg-blue-600 hover:bg-blue-700 text-white px-3 h-7 text-xs font-medium",
    };

    const sizeClasses = {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
      icon: "text-sm",
    };

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        // If no onClick handler, let the event bubble (for dropdown triggers)
        if (!onClick) {
          return;
        }

        // Prevent multiple rapid clicks only for non-dropdown usage
        const now = Date.now();
        if (now - lastClickTime.current < debounceMs) {
          return;
        }
        lastClickTime.current = now;

        // Set clicking state for visual feedback
        setIsClicking(true);
        setIsAnimating(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Reset clicking state after animation
        timeoutRef.current = setTimeout(() => {
          setIsClicking(false);
          setIsAnimating(false);
        }, 200);

        onClick();
      },
      [onClick, debounceMs],
    );

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        onClick={handleClick}
        disabled={disabled || isClicking}
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          isClicking && "scale-95 transform",
          isAnimating && "animate-pulse",
          className,
        )}
        title={title}
        {...props}
      >
        {/* Ripple effect overlay */}
        {isClicking && (
          <div className="absolute inset-0 bg-white/20 rounded-md animate-ping" />
        )}

        {/* Content */}
        <span
          className={cn(
            "relative z-10 flex items-center justify-center",
            isClicking && "scale-105",
          )}
        >
          {children}
        </span>
      </Button>
    );
  },
);

JiraButton.displayName = "JiraButton";
