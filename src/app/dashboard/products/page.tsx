"use client";

import AdminLayout from "@/components/Layout";
import MainContent from "@/components/MainContent";

export default function ProductsPage() {
  const handleItemClick = (item: string) => {
    // Handle navigation if needed
    console.log('Item clicked:', item);
  };

  return (
    <AdminLayout activeItem="products" onItemClick={handleItemClick}>
      <MainContent className="flex items-center justify-center">
        {/* Page Content Placeholder */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products Management</h1>
          <p className="text-gray-600 text-lg">Content will be added here in the future</p>
        </div>
      </MainContent>
    </AdminLayout>
  );
}
