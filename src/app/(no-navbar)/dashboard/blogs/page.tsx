'use client';

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <h1 className="font-bold text-slate-900 lg:text-3xl text-center mb-6">Content Dashboard</h1>
        <DashboardContent />
      </div>
    </div>
  );
}
