import { Category } from "@/payload-types";

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};

export const buildCategoryTree = (
  categories: Category[],
): CategoryWithChildren[] => {
  const categoryMap: Record<string, CategoryWithChildren> = {};
  const tree: CategoryWithChildren[] = [];

  // 1. Initialize map
  categories.forEach((cat) => {
    categoryMap[cat.id] = { ...cat, children: [] };
  });

  // 2. Build tree
  categories.forEach((cat) => {
    // Check if parent exists and is populated (not just an ID string)
    const parentId =
      cat.parent && typeof cat.parent === "object" ? cat.parent.id : cat.parent;

    if (parentId && categoryMap[parentId]) {
      categoryMap[parentId].children?.push(categoryMap[cat.id]);
    } else {
      tree.push(categoryMap[cat.id]);
    }
  });

  return tree;
};
