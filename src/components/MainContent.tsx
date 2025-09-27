"use client";

import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export default function MainContent({
  children,
  className = "",
}: MainContentProps) {
  return (
    <div
      className={`p-4 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm h-[calc(100vh-5.25rem)] ${className}`}
    >
      {children}
    </div>
  );
}
