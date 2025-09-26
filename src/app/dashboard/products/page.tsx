"use client";

import AdminLayout from "@/components/Layout";

export default function ProductsPage() {
  const handleItemClick = (item: string) => {
    // Handle navigation if needed
    console.log('Item clicked:', item);
  };

  return (
    <AdminLayout activeItem="products" onItemClick={handleItemClick}>
      <div className="p-4 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm h-[calc(100vh-6rem)] flex items-center justify-center">
        {/* Page Content Placeholder */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products Management</h1>
          <p className="text-gray-600 text-lg">Content will be added here in the future</p>
        </div>
      </div>
    </AdminLayout>
  );
}
