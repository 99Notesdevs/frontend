'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
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
        <div className="bg-green-100 p-8 rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">
            Your subscription has been activated successfully.
          </p>
          <button
            onClick={() => router.push('/subscription')}
            className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Continue to Subscription
          </button>
        </div>
      </div>
    </div>
  );
}