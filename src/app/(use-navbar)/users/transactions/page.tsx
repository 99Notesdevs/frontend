'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { env } from 'process';

interface Payment {
  id: string;
  amount: number;
  transactionId: string;
  createdAt: string;
  subscriptionPlan: string;
}

const dummyData: Payment[] = [
  {
    id: '1',
    amount: 999,
    transactionId: 'TXN123456789',
    createdAt: new Date().toISOString(),
    subscriptionPlan: 'Basic'
  },
  {
    id: '2',
    amount: 1999,
    transactionId: 'TXN987654321',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subscriptionPlan: 'Premium'
  }
];

export default function TransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${env.API}/user`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data.payments || dummyData);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction History</h1>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {payment.subscriptionPlan} Plan
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}