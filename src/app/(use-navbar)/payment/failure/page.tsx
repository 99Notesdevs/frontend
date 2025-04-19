'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentFailurePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to subscription page if user tries to go back
    const handleBack = (event: PopStateEvent) => {
      event.preventDefault();
      router.push('/subscription');
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBack);

    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="bg-red-50 p-8 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Failed</h1>
          <p className="text-gray-600 mt-2">
            We're sorry, but your payment couldn't be processed. Please try again.
          </p>
          <button
            onClick={() => router.push('/subscription')}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}