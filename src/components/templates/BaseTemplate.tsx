import React from 'react';
import Head from 'next/head';

export interface BaseTemplateProps {
  title: string;
  description: string;
  keywords?: string;
  children: React.ReactNode;
  showSidebar?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

export const BaseTemplate: React.FC<BaseTemplateProps> = ({
  title,
  description,
  keywords,
  children,
  showSidebar = true,
  showBreadcrumbs = true,
  className = '',
}) => {
  return (
    <>
      <Head>
        <title>{`${title} - 99Notes`}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <main className={`container mx-auto px-4 py-8 ${className}`}>
          {showBreadcrumbs && (
            <nav className="text-sm mb-4 text-gray-500">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <a href="/" className="hover:text-blue-600">Home</a>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-gray-700">{title}</li>
              </ol>
            </nav>
          )}
          <div className={`flex ${showSidebar ? 'gap-8' : ''}`}>
            {showSidebar && (
              <aside className="w-64 flex-shrink-0">
                {/* Sidebar content will be injected by child templates */}
              </aside>
            )}
            <div className={`flex-grow ${showSidebar ? 'max-w-3xl' : 'max-w-4xl mx-auto'}`}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}; 