"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface Article {
  id: string;
  title: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any;
  publishedAt: Date;
}

interface ArticlesContextType {
  articles: Article[];
  filteredArticles: Article[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
  strapiURL: string;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined
);

const STRAPI_URL = "http://127.0.0.1:1337";

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
        const data = await response.json();
        if (isMounted && data.data) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log("data", articles);

  const categories = Array.from(
    new Set(articles.map((article) => article.category.name))
  );

  const filteredArticles = selectedCategory
    ? articles.filter(
        (article) =>
          article.category?.category.toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    : articles;

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        filteredArticles,
        selectedCategory,
        setSelectedCategory,
        categories,
        strapiURL: STRAPI_URL,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};
