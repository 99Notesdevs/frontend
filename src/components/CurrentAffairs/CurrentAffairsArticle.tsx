import React from 'react';
import Link from 'next/link';

interface CurrentAffairsArticleProps {
  title: string;
  date: string;
  content: string;
  topics: string[];
  relatedArticles?: {
    title: string;
    path: string;
  }[];
  pdfLink?: string;
}

const CurrentAffairsArticle: React.FC<CurrentAffairsArticleProps> = ({
  title,
  date,
  content,
  topics,
  relatedArticles,
  pdfLink,
}) => {
  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Article Header */}
      <div className="p-8 border-b">
        <div className="flex items-center text-sm text-[var(--text-tertiary)] mb-4">
          <span className="mr-4">
            <time dateTime={date}>{date}</time>
          </span>
          <span className="mr-4">•</span>
          <span>UPSC Current Affairs</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--surface-darker)] mb-6">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-8">
        <div className="prose max-w-none">
          {content}
        </div>

        {/* PDF Download Section */}
        {pdfLink && (
          <div className="mt-8 p-4 bg-[var(--bg-main)] rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--surface-darker)]">Download PDF Notes</h3>
                <p className="text-sm text-[var(--text-base)]">Get offline access to these notes</p>
              </div>
              <a
                href={pdfLink}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--surface-darker)] mb-6">Related Articles</h2>
            <div className="grid gap-6">
              {relatedArticles.map((article, index) => (
                <Link 
                  key={index}
                  href={article.path}
                  className="block p-4 bg-[var(--bg-main)] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-medium text-[var(--surface-darker)] hover:text-blue-600">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article Footer */}
      <div className="p-8 border-t bg-[var(--bg-main)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-[var(--border-light)] rounded-md shadow-sm text-sm font-medium text-[var(--text-strong)] bg-white hover:bg-gray-50">
              Share
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-[var(--border-light)] rounded-md shadow-sm text-sm font-medium text-[var(--text-strong)] bg-white hover:bg-gray-50">
              Save for Later
            </button>
          </div>
          <div className="text-sm text-[var(--text-tertiary)]">
            Last updated: {date}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CurrentAffairsArticle;