import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JiraButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  variant?: "icon" | "text" | "create";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function JiraButton({
  children,
  onClick,
  className,
  title,
  variant = "icon",
  size = "sm",
  disabled = false,
  type = "button",
}: JiraButtonProps) {
  const baseClasses = "transition-colors rounded-md";

  const variantClasses = {
    icon: "text-gray-600 hover:bg-blue-50 hover:text-blue-600 p-1.5 h-7 w-7",
    text: "text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-2 py-1 h-7",
    create:
      "bg-blue-600 hover:bg-blue-700 text-white px-3 h-7 text-xs font-medium",
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      title={title}
    >
      {children}
    </Button>
  );
}
