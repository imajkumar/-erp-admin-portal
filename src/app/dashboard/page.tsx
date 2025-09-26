"use client";

import { useState } from "react";
import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";

export default function Dashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const handleItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    <AdminLayout activeItem={activeMenuItem} onItemClick={handleItemClick}>
      <MainContent>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your business metrics</p>
        </div>
      </MainContent>
    </AdminLayout>
  );
}