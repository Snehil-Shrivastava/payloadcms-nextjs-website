// "use client";

// import { createContext, useContext, useState, ReactNode, useMemo } from "react";
// import { Article, Category } from "@/payload-types";
// import {
//   buildCategoryTree,
//   CategoryWithChildren,
// } from "@/lib/categoryTreeWithChildren";

// interface ArticlesContextType {
//   articles: Article[];
//   filteredArticles: Article[];
//   selectedCategory: string | null;
//   setSelectedCategory: (category: string | null) => void;
//   categoryTree: CategoryWithChildren[];
// }

// const ArticlesContext = createContext<ArticlesContextType | undefined>(
//   undefined,
// );

// export const ArticlesProvider = ({
//   children,
//   initialArticles,
//   initialCategories,
// }: {
//   children: ReactNode;
//   initialArticles: Article[];
//   initialCategories: Category[];
// }) => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   // 1. Build the Tree
//   const categoryTree = useMemo(() => {
//     return buildCategoryTree(initialCategories);
//   }, [initialCategories]);

//   // 2. Advanced Filter Logic
//   const filteredArticles = useMemo(() => {
//     if (!selectedCategory) return initialArticles;

//     // A. Find the Category Object corresponding to the selected name
//     // We search both top-level parents and their children
//     let selectedCatObj: CategoryWithChildren | undefined;

//     // Check parents
//     selectedCatObj = categoryTree.find(
//       (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase(),
//     );

//     // If not found in parents, check children
//     if (!selectedCatObj) {
//       for (const parent of categoryTree) {
//         const childMatch = parent.children?.find(
//           (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase(),
//         );
//         if (childMatch) {
//           selectedCatObj = childMatch;
//           break;
//         }
//       }
//     }

//     if (!selectedCatObj) return []; // Should not happen

//     // B. Create a set of Valid IDs (The selected category ID + all its children IDs)
//     const validCategoryIds = new Set<number>();
//     validCategoryIds.add(selectedCatObj.id);

//     if (selectedCatObj.children) {
//       selectedCatObj.children.forEach((child) =>
//         validCategoryIds.add(child.id),
//       );
//     }

//     // C. Filter Articles based on IDs
//     return initialArticles.filter((article) => {
//       const articleCat = article.category as Category;
//       // Check if the article's category ID is in our list of valid IDs
//       return validCategoryIds.has(articleCat.id);
//     });
//   }, [selectedCategory, initialArticles, categoryTree]);

//   return (
//     <ArticlesContext.Provider
//       value={{
//         articles: initialArticles,
//         filteredArticles,
//         selectedCategory,
//         setSelectedCategory,
//         categoryTree,
//       }}
//     >
//       {children}
//     </ArticlesContext.Provider>
//   );
// };

// export const useArticles = () => {
//   const context = useContext(ArticlesContext);
//   if (context === undefined) {
//     throw new Error("useArticles must be used within an ArticlesProvider");
//   }
//   return context;
// };

// -------------------------------------------------------------------------------------------------

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Article, Category } from "@/payload-types";
import {
  buildCategoryTree,
  CategoryWithChildren,
} from "@/lib/categoryTreeWithChildren";
import { usePathname } from "next/navigation";

interface ArticlesContextType {
  articles: Article[];
  filteredArticles: Article[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categoryTree: CategoryWithChildren[];
  activeSlug: string | null;
  toggleArticle: (slug: string) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined,
);

export const ArticlesProvider = ({
  children,
  initialArticles,
  initialCategories,
  initialSlug = null,
}: {
  children: ReactNode;
  initialArticles: Article[];
  initialCategories: Category[];
  initialSlug?: string | null;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize with the slug passed from the server
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug);

  const pathname = usePathname();

  /* ---------------- FIX: SYNC STATE WITH URL ---------------- */
  useEffect(() => {
    // 1. Calculate what the slug SHOULD be based on Next.js current path
    const urlSlug = pathname.startsWith("/article/")
      ? pathname.split("/").pop() || null
      : null;

    // 2. Strict Check: Only update state if it doesn't match the URL.
    // This prevents the "synchronous setState" error.
    if (activeSlug !== urlSlug) {
      setActiveSlug(urlSlug);
    }

    // IMPORTANT: Do NOT include 'activeSlug' in the dependency array.
    // We only want to react when the PATHNAME changes (browser navigation).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* ---------------- TOGGLE LOGIC (MANUAL HISTORY) ---------------- */
  const toggleArticle = (slug: string) => {
    if (activeSlug === slug) {
      // Close
      setActiveSlug(null);
      window.history.pushState(null, "", "/");
    } else {
      // Open
      setActiveSlug(slug);
      window.history.pushState(null, "", `/article/${slug}`);
    }
  };

  /* ---------------- DATA PREP ---------------- */
  const categoryTree = useMemo(() => {
    return buildCategoryTree(initialCategories);
  }, [initialCategories]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return initialArticles;

    let selectedCatObj: CategoryWithChildren | undefined;

    selectedCatObj = categoryTree.find(
      (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );

    if (!selectedCatObj) {
      for (const parent of categoryTree) {
        const childMatch = parent.children?.find(
          (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );
        if (childMatch) {
          selectedCatObj = childMatch;
          break;
        }
      }
    }

    if (!selectedCatObj) return [];

    const validCategoryIds = new Set<number>();
    validCategoryIds.add(selectedCatObj.id);

    if (selectedCatObj.children) {
      selectedCatObj.children.forEach((child) =>
        validCategoryIds.add(child.id),
      );
    }

    return initialArticles.filter((article) => {
      const articleCat = article.category as Category;
      return validCategoryIds.has(articleCat.id);
    });
  }, [selectedCategory, initialArticles, categoryTree]);

  return (
    <ArticlesContext.Provider
      value={{
        articles: initialArticles,
        filteredArticles,
        selectedCategory,
        setSelectedCategory,
        categoryTree,
        activeSlug,
        toggleArticle,
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
