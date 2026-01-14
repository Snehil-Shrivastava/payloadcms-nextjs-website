// import { getPayloadClient } from "@/lib/client";

// export async function getArticles() {
//   const payload = await getPayloadClient();
//   try {
//     const { docs: articles } = await payload.find({
//       collection: "articles",
//     });
//     return articles ?? [];
//   } catch (error) {
//     console.error("Failed to fetch articles", error);
//     return [];
//   }
// }

import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Article } from "@/payload-types";

export async function getArticles() {
  const payload = await getPayload({ config: configPromise });

  try {
    const { docs: articles } = await payload.find({
      collection: "articles",
      // 1. Depth: 2 is needed to see the Author's Avatar (Article -> Author -> Avatar)
      depth: 2,
      // 2. Sort: Show newest articles first
      sort: "-publishedAt",
      // 3. Filter: Only show "Published" articles on the live site
      // where: {
      //   status: {
      //     equals: 'Published',
      //   },
      // },
    });

    return articles as Article[];
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return [];
  }
}
