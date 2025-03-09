export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  topics: string[];
  type: string;
  pdfLink?: string;
  relatedArticles?: RelatedArticle[];
  author?: string;
  lastUpdated?: string;
  viewCount?: number;
}

export interface RelatedArticle {
  title: string;
  path: string;
  excerpt?: string;
  date?: string;
}

export interface PageConfig {
  title: string;
  description: string;
  topics: string[];
  icon?: string;
}

export interface SectionConfig {
  [key: string]: PageConfig;
}

export interface NavigationItem {
  title: string;
  path: string;
  icon?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FilterOptions {
  topic?: string;
  sortBy?: 'latest' | 'oldest' | 'popular';
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// API Response Types
export interface ArticleListResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export interface ArticleResponse {
  article: Article;
  relatedArticles: RelatedArticle[];
  nextArticle?: RelatedArticle;
  previousArticle?: RelatedArticle;
} 