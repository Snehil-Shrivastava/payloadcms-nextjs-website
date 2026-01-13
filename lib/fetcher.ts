import { getPayloadClient } from "@/lib/client";

export async function getArticles() {
  const payload = await getPayloadClient();
  try {
    const { docs: articles } = await payload.find({
      collection: "articles",
    });
    return articles ?? [];
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return [];
  }
}
