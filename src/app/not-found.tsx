'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation Container */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse">
            404
          </div>
          
          {/* Floating elements for visual interest */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-0 -left-8 w-8 h-8 bg-pink-200 dark:bg-pink-800 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          The page you're looking for seems to have vanished into the digital void. 
          Don't worry, even the best explorers get lost sometimes!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Still can't find what you're looking for?
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• Check the URL for typos</p>
            <p>• Try using the search function</p>
            <p>• Navigate from the main menu</p>
            <p>• Contact support if you believe this is an error</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
