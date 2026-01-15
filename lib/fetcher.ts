import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Article } from "@/payload-types";

export async function getArticles() {
  const payload = await getPayload({ config: configPromise });

  try {
    const { docs: articles } = await payload.find({
      collection: "articles",
      depth: 2,
      sort: "-publishedAt",
    });

    return articles as Article[];
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return [];
  }
}

export async function getArticleFromSlug(slug: string) {
  const payload = await getPayload({ config: configPromise });

  try {
    const { docs: articles } = await payload.find({
      collection: "articles",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    });

    return (articles[0] as Article) || null;
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return null;
  }
}
