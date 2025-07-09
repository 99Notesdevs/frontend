'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/config/env';
import Cookies from 'js-cookie';
import { redirect } from 'next/dist/server/api-utils';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<'Articles' | 'Books' | 'Notes'>('Articles');
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${env.API}/product`);
        if (!response.ok) throw new Error('Failed to fetch plans');
        const { data } = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyClick = async (plan: any) => {
    // implement buy click logic here
    const data = {
      orderDate: new Date().toISOString(),
      totalAmount: Number(plan.price),
      status: "Pending",
      billingAddress: "",
      shippingAddress: "",
    };
    const response = await fetch(`${env.API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 403) {
      alert('Please login to continue');
      window.location.href = '/users/login';
      return;
    }
    const responseData = await response.json();
    console.log("First ", responseData);
    const orderId = responseData.data.id;
    const orderData = {
      orderId: orderId,
      phonepe_transactionId: "",
      status: "",
      amount: data.totalAmount,
      redirectUrl: "",
      validity: Number(plan.validity)
    }
    const response2 = await fetch(`${env.API}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    const responseData2 = await response2.json();
    console.log(responseData2.data);
    const redirectUrl = responseData2.redirectUrl;
    window.location.href = redirectUrl;
  };

  const extractFeatures = (description: string) => {
    const features = [];
    const lines = description.split('\n');
    for (const line of lines) {
      // Match lines that start with numbers followed by a period or dot
      const match = line.match(/^(\d+\.\s+)(.+)/);
      if (match) {
        features.push(match[2].trim());
      }
    }
    return features.slice(0, 3); // Return only the first 3 features
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-center gap-4 mb-12">
              <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 animate-pulse h-80">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4 mx-auto"></div>
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-6 mx-auto"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full mt-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (selectedSection) {
      case 'Articles':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className="group border-2 border-[var(--nav-primary)] dark:border-slate-700 hover:border-[var(--nav-secondary)] dark:hover:border-slate-600 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30 bg-white dark:bg-slate-800 overflow-hidden"
              >
                <div className="p-1 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)]">
                  <div className="bg-white dark:bg-slate-800 p-5 md:p-6">
                    <CardHeader className="text-center p-0 mb-4">
                      <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {plan.name}
                      </CardTitle>
                      <p className="text-2xl md:text-3xl font-bold text-[var(--nav-primary)] dark:text-blue-400">
                        ₹{plan.price}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{plan.validity} Days</span>
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                        {extractFeatures(plan.description).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5"
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
                            <span className="text-sm md:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] hover:from-[var(--nav-secondary)] hover:to-[var(--nav-primary)] text-white font-semibold py-3 md:py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                        onClick={() => handleBuyClick(plan)}
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'Books':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-12 text-center border border-gray-200 dark:border-slate-700 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Cover Your Entire UPSC Syllabus with 20 Books
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                Get access to our comprehensive collection of UPSC preparation books
              </p>
              <a 
                href="https://shop.99notes.in/books/" 
                className="inline-block bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] hover:from-[var(--nav-secondary)] hover:to-[var(--nav-primary)] text-white font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Shop Now
              </a>
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-12 text-center border border-gray-200 dark:border-slate-700 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Cover Your Entire UPSC Syllabus with Handwritten Notes
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                Access high-quality handwritten notes for comprehensive UPSC preparation
              </p>
              <a 
                href="https://shop.99notes.in/notes/" 
                className="inline-block bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] hover:from-[var(--nav-secondary)] hover:to-[var(--nav-primary)] text-white font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Download Now
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 md:mb-12 flex flex-wrap justify-center gap-3 md:gap-4">
          {['Articles', 'Books', 'Notes'].map((section) => (
            <Button
              key={section}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedSection === section
                  ? 'bg-[var(--nav-primary)] hover:bg-[var(--nav-secondary)] text-white shadow-lg'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
              }`}
              onClick={() => setSelectedSection(section as any)}
            >
              {section}
            </Button>
          ))}
        </div>
        
        <div className="mt-8 md:mt-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}