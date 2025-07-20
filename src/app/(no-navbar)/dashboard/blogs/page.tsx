"use client";

import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--admin-bg-lightest)] py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <h1 className="font-bold text-[var(--admin-bg-dark)] lg:text-3xl text-center mb-6">
          Content Dashboard
        </h1>
        <DashboardContent />
      </div>
    </div>
  );
}
