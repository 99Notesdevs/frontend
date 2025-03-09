import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CurrentAffairsArticle from '@/components/CurrentAffairs/CurrentAffairsArticle';
import CurrentAffairsLayout from '@/components/CurrentAffairs/CurrentAffairsLayout';

interface Article {
  slug: string;
  title: string;
  date: string;
  content: string;
  topics: string[];
  type: string;
  pdfLink?: string;
  relatedArticles?: {
    title: string;
    path: string;
  }[];
}

// This would be replaced with actual API call
const fetchArticle = async (category: string, section: string, slug: string): Promise<Article | null> => {
  // TODO: Replace with actual API call
  return {
    slug,
    title: "Sample Article Title",
    date: new Date().toISOString(),
    content: `
      <h2>Introduction</h2>
      <p>Sample article content...</p>
    `,
    topics: ["Topic 1", "Topic 2"],
    type: section,
    pdfLink: "/sample.pdf",
    relatedArticles: [
      {
        title: "Related Article 1",
        path: "/current-affairs/daily/news-analysis/related-1"
      }
    ]
  };
};

const CurrentAffairsArticlePage = () => {
  const router = useRouter();
  const { category, section, slug } = router.query;
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);

  const path = `/current-affairs/${category}/${section}`;

  React.useEffect(() => {
    const loadArticle = async () => {
      if (category && section && slug) {
        setLoading(true);
        try {
          const data = await fetchArticle(
            category as string,
            section as string,
            slug as string
          );
          setArticle(data);
        } catch (error) {
          console.error('Error loading article:', error);
        }
        setLoading(false);
      }
    };

    loadArticle();
  }, [category, section, slug]);

  if (loading) {
    return (
      <CurrentAffairsLayout activeSection={path}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </CurrentAffairsLayout>
    );
  }

  if (!article) {
    return (
      <CurrentAffairsLayout activeSection={path}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-red-600">Article Not Found</h1>
          <p className="mt-4 text-gray-600">The requested article could not be found.</p>
        </div>
      </CurrentAffairsLayout>
    );
  }

  return (
    <CurrentAffairsLayout activeSection={path}>
      <Head>
        <title>{article.title} - UPSC Current Affairs</title>
        <meta name="description" content={article.title} />
      </Head>

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
        <a href="/current-affairs" className="hover:text-gray-900">Current Affairs</a>
        <span className="mx-2">/</span>
        <a href={`/current-affairs/${category}`} className="hover:text-gray-900">
          {category?.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </a>
        <span className="mx-2">/</span>
        <a href={`/current-affairs/${category}/${section}`} className="hover:text-gray-900">
          {section?.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{article.title}</span>
      </nav>

      <CurrentAffairsArticle {...article} />

      {/* Additional Resources */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <h3 className="font-medium text-gray-900">Practice Questions</h3>
                <p className="text-sm text-gray-600">Test your understanding</p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-medium text-gray-900">Study Material</h3>
                <p className="text-sm text-gray-600">Additional reading material</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </CurrentAffairsLayout>
  );
};

export default CurrentAffairsArticlePage; 