'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPage() {
  const [selectedSection, setSelectedSection] = useState<'Articles' | 'Books' | 'Notes'>('Articles');

  const plans = [
    {
      title: 'Experimentor Pack',
      price: 'Rs. 9/Day',
      features: [
        'Get Access to this article',
        'Access Lasts upto 48 hours'
      ],
      buttonText: 'Buy Now',
      buttonLink: '#',
      id: '78645'
    },
    {
      title: 'Refreshment Pack',
      price: 'Rs. 99/Month',
      features: [
        'Get Access to all articles',
        'Access Lasts upto 30 Days'
      ],
      buttonText: 'Buy Now',
      buttonLink: '#',
      id: '78646'
    },
    {
      title: 'UPSC Special Pack',
      price: 'Rs. 999/Year',
      features: [
        'Get Access to all articles',
        'Access upto 365 Days'
      ],
      buttonText: 'Buy Now',
      buttonLink: '#',
      id: '78647'
    },
    {
      title: 'UPSC Ranker Pack',
      price: 'Rs. 1999/Day',
      features: [
        'Get Access to this article',
        'Access Lasts upto 3 Years'
      ],
      buttonText: 'Buy Now',
      buttonLink: '#',
      id: '78648'
    }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'Articles':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className="border-2 border-amber-500 hover:border-amber-600 hover:border-primary transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.title}</CardTitle>
                  <p className="text-3xl font-bold text-primary">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
                      asChild
                    >
                      <a href={`${plan.buttonLink}?add-to-cart=${plan.id}&quantity=1`}>
                        {plan.buttonText}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 'Books':
        return (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Cover Your Entire UPSC Syllabus with 20 Books</h2>
              {/* <p className="text-gray-600 mb-8">Get access to our comprehensive collection of UPSC preparation books</p> */}
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="https://shop.99notes.in/books/" className="text-white">
                  Shop Now
                </a>
              </Button>
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Cover Your Entire UPSC Syllabus with Handwritten Notes</h2>
             <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="https://shop.99notes.in/notes/" className="text-white">
                  Download Now
                </a>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex justify-center gap-4">
          <Button
            className={`px-6 py-3 ${selectedSection === 'Articles' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            onClick={() => setSelectedSection('Articles')}
          >
            Articles
          </Button>
          <Button
            className={`px-6 py-3 ${selectedSection === 'Books' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            onClick={() => setSelectedSection('Books')}
          >
            Books
          </Button>
          <Button
            className={`px-6 py-3 ${selectedSection === 'Notes' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            onClick={() => setSelectedSection('Notes')}
          >
            Notes
          </Button>
        </div>
        
        <div className="mt-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}