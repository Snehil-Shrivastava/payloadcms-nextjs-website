"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Article } from "@/payload-types";

interface ArticlesContextType {
  articles: Article[];
  filteredArticles: Article[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined
);

const STRAPI_URL = "http://127.0.0.1:1337";

export const ArticlesProvider = ({
  children,
  initialArticles,
}: {
  children: ReactNode;
  initialArticles: Article[];
}) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(
      articles
        .map((article) =>
          typeof article.category === "object"
            ? article.category?.category
            : null
        )
        .filter((title): title is string => !!title)
    )
  );

  const filteredArticles = selectedCategory
    ? articles.filter(
        (article) =>
          typeof article.category === "object" &&
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
