"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute'
import { env } from '@/config/env';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  isLocked?: boolean;
  metadata: string;
}

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  const checkSubscription = async () => {
    try {
      const response = await fetch(`${env.API}/user/validate`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`,
          "Content-Type": "application/json",
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.data.paidUser || false);
      } else {
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setIsSubscribed(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const [articlesRes] = await Promise.all([
        fetch(`${env.API}/page/articles-with-lock`, {
          headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`,
            "Content-Type": "application/json",
          }
        }),
        checkSubscription()
      ]);
      
      if (!articlesRes.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await articlesRes.json();
      const articlesData = Array.isArray(data.data) ? data.data : [];
      
      // Parse imageUrl and check for locked content
      const processedArticles = articlesData.map((article: Article) => ({
        ...article,
        imageUrl: article.imageUrl ? JSON.parse(article.imageUrl)[0] : '',
        isLocked: article.content.includes('<lock>'),
        description: article.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
      }));
      
      setArticles(processedArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const renderArticleContent = (article: Article) => {
    const requiresSubscription = article.isLocked && !isSubscribed;
    
    return (
      <div className={`relative ${requiresSubscription ? 'group' : ''}`}>
        <Link 
          href={requiresSubscription ? '/subscription' : `/${article.slug}`}
          className="block"
        >
          <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            requiresSubscription ? 'opacity-70 blur-[2px] group-hover:blur-[1px] transition-all duration-300' : ''
          }`}>
            <div className="relative h-48 bg-gray-100">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-100 to-yellow-200">
                  <span className="text-4xl">📝</span>
                </div>
              )}
              {article.isLocked && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Premium
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-yellow-600 transition-colors mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {article.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center text-yellow-600 font-medium">
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
        
        {requiresSubscription && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 p-4 rounded-lg shadow-lg max-w-xs">
              <h4 className="font-bold text-gray-800 mb-2">Premium Content</h4>
              <p className="text-sm text-gray-600 mb-3">Subscribe to unlock this article and all premium content</p>
              <Link 
                href="/dashboard/subscription"
                className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-[var(--bg-main)] to-yellow-50 min-h-screen">
        {/* Mobile menu button */}
        <button 
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-[var(--primary)] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Message */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-900 to-yellow-600 bg-clip-text text-transparent">
                Welcome back{isSubscribed ? ' Premium Member' : ''}!
              </h1>
              <p className="text-[var(--text-tertiary)] mt-2 text-lg">
                {isSubscribed 
                  ? 'Explore our premium content' 
                  : 'Upgrade to premium to unlock all content'}
              </p>
            </div>

            {/* Articles Section */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-900">
                  {isSubscribed ? 'Latest Articles' : 'Premium Articles'}
                </h2>
                {!isSubscribed && (
                  <Link 
                    href="/dashboard/subscription"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Upgrade to Premium
                  </Link>
                )}
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading articles. Please try again later.</p>
                  <button 
                    onClick={fetchArticles}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <div key={article.id} className="relative">
                      {renderArticleContent(article)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles found.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
