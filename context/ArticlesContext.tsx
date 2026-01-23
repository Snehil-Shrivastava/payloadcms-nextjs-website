// "use client";

// import { createContext, useContext, useState, ReactNode, useMemo } from "react";
// // Import the generated type instead of defining it manually
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

// // We accept `initialArticles` passed down from the Server Component
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

//   // Extract unique category names
//   // const categories = useMemo(() => {
//   //   const cats = new Set<string>();
//   //   initialArticles.forEach((article) => {
//   //     // Type guard to ensure category is populated (depth > 0)
//   //     const catName = (article.category as Category)?.category;
//   //     if (catName) cats.add(catName);
//   //   });
//   //   return Array.from(cats);
//   // }, [initialArticles]);

//   const categoryTree = useMemo(() => {
//     return buildCategoryTree(initialCategories);
//   }, [initialCategories]);

//   // Filter logic
//   const filteredArticles = useMemo(() => {
//     if (!selectedCategory) return initialArticles;

//     return initialArticles.filter(
//       (article) =>
//         (article.category as Category)?.category?.toLowerCase() ===
//         selectedCategory.toLowerCase(),
//     );
//   }, [selectedCategory, initialArticles]);

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

// -----------------------------------------------------------------------------------

"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Article, Category } from "@/payload-types";
import {
  buildCategoryTree,
  CategoryWithChildren,
} from "@/lib/categoryTreeWithChildren";

interface ArticlesContextType {
  articles: Article[];
  filteredArticles: Article[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categoryTree: CategoryWithChildren[];
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined,
);

export const ArticlesProvider = ({
  children,
  initialArticles,
  initialCategories,
}: {
  children: ReactNode;
  initialArticles: Article[];
  initialCategories: Category[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. Build the Tree
  const categoryTree = useMemo(() => {
    return buildCategoryTree(initialCategories);
  }, [initialCategories]);

  // 2. Advanced Filter Logic
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return initialArticles;

    // A. Find the Category Object corresponding to the selected name
    // We search both top-level parents and their children
    let selectedCatObj: CategoryWithChildren | undefined;

    // Check parents
    selectedCatObj = categoryTree.find(
      (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );

    // If not found in parents, check children
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

    if (!selectedCatObj) return []; // Should not happen

    // B. Create a set of Valid IDs (The selected category ID + all its children IDs)
    const validCategoryIds = new Set<number>();
    validCategoryIds.add(selectedCatObj.id);

    if (selectedCatObj.children) {
      selectedCatObj.children.forEach((child) =>
        validCategoryIds.add(child.id),
      );
    }

    // C. Filter Articles based on IDs
    return initialArticles.filter((article) => {
      const articleCat = article.category as Category;
      // Check if the article's category ID is in our list of valid IDs
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
