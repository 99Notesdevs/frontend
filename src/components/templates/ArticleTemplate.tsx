import React from 'react';
import { BaseTemplate, BaseTemplateProps } from './BaseTemplate';

interface ArticleTemplateProps extends Omit<BaseTemplateProps, 'children'> {
  content: React.ReactNode;
  author?: string;
  publishDate?: string;
  category?: string;
  tags?: string[];
  relatedArticles?: Array<{
    title: string;
    slug: string;
    description: string;
  }>;
  tableOfContents?: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  content,
  author,
  publishDate,
  category,
  tags = [],
  relatedArticles = [],
  tableOfContents = [],
  ...baseProps
}) => {
  return (
    <BaseTemplate {...baseProps}>
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{baseProps.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            {author && (
              <>
                <span>By {author}</span>
                <span className="mx-2">•</span>
              </>
            )}
            {publishDate && (
              <>
                <time dateTime={publishDate}>{new Date(publishDate).toLocaleDateString()}</time>
                <span className="mx-2">•</span>
              </>
            )}
            {category && (
              <a href={`/category/${category.toLowerCase()}`} className="text-blue-600 hover:underline">
                {category}
              </a>
            )}
          </div>
        </header>

        {tableOfContents.length > 0 && (
          <nav className="bg-gray-50 p-4 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
            <ul className="space-y-1">
              {tableOfContents.map((item) => (
                <li
                  key={item.id}
                  style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
                  className="hover:text-blue-600"
                >
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="article-content">{content}</div>

        {tags.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((article) => (
                <a
                  key={article.slug}
                  href={article.slug}
                  className="block p-6  bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600">{article.description}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </BaseTemplate>
  );
}; 