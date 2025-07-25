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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] dark:bg-slate-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--surface-darker)] dark:border-slate-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">Transaction History</h1>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-tertiary)] dark:text-slate-300">No transactions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white dark:bg-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-slate-600"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                          {payment.subscriptionPlan} Plan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </p>
                    </div>
                    <p className="text-sm text-[var(--text-tertiary)]">Transaction ID: {payment.transactionId}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-[var(--surface-darker)] dark:text-white">
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
    </div>
  );
}