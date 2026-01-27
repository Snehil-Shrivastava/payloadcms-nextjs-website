// import type { CollectionConfig } from "payload";
// import { generateSlugHook } from "./hooks/generate-slug-hook";
// import { generateContentSummaryHook } from "./hooks/generate-content-summary-hook";
// import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
// import { revalidatePath } from "next/cache";

// export const Articles: CollectionConfig = {
//   slug: "articles",
//   fields: [
//     {
//       name: "title",
//       type: "text",
//       required: true,
//       unique: true,
//     },
//     {
//       name: "slug",
//       type: "text",
//       required: true,
//       unique: true,
//       hooks: {
//         beforeValidate: [generateSlugHook],
//       },
//     },
//     {
//       name: "content",
//       type: "richText",
//       required: true,
//     },
//     {
//       name: "contentSummary",
//       type: "textarea",
//       required: true,
//       hooks: {
//         beforeValidate: [generateContentSummaryHook],
//       },
//     },
//     {
//       name: "readTimeInMins",
//       type: "number",
//       defaultValue: 0,
//       hooks: {
//         beforeChange: [
//           ({ siblingData }) => {
//             // ensure that the data is not stored in DB
//             delete siblingData.readTimeInMins;
//           },
//         ],
//         afterRead: [
//           ({ data }) => {
//             const text = convertLexicalToPlaintext({ data: data?.content });
//             const wordsPerMinutes = 200;
//             const words = text.trim().split(/\s+/).length;
//             return Math.max(1, Math.ceil(words / wordsPerMinutes));
//           },
//         ],
//       },
//     },
//     {
//       name: "coverImage",
//       type: "upload",
//       relationTo: "media",
//       required: true,
//     },
//     {
//       name: "author",
//       type: "relationship",
//       relationTo: "article-authors",
//       required: true,
//     },
//     {
//       name: "status",
//       type: "select",
//       required: true,
//       options: ["Draft", "Published"],
//       defaultValue: "Draft",
//     },
//     {
//       name: "publishedAt",
//       type: "date",
//       required: true,
//       admin: {
//         condition: (data) => data?.status === "Published",
//         date: { pickerAppearance: "dayAndTime" },
//       },
//     },
//     {
//       name: "category",
//       type: "relationship",
//       relationTo: "categories",
//       required: true,
//     },
//   ],
//   hooks: {
//     afterChange: [
//       ({ doc }) => {
//         revalidatePath("/");
//         revalidatePath(`/article/${doc.slug}`);
//         revalidatePath("/admin");

//         return doc;
//       },
//     ],
//     afterDelete: [
//       ({ doc }) => {
//         revalidatePath("/");
//         revalidatePath(`/article/${doc.slug}`);
//         return doc;
//       },
//     ],
//   },
// };

// -------------------------------------------------------------------------------

import type { CollectionConfig } from "payload";
import { generateSlugHook } from "./hooks/generate-slug-hook";
import { generateContentSummaryHook } from "./hooks/generate-content-summary-hook";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { revalidatePath } from "next/cache";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

export const Articles: CollectionConfig = {
  slug: "articles",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [generateSlugHook],
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              // Content Column Block - groups heading + paragraphs
              {
                slug: "contentColumn",
                fields: [
                  {
                    name: "heading",
                    type: "text",
                    label: "Heading (optional)",
                  },
                  {
                    name: "content",
                    type: "richText",
                    label: "Content",
                    required: true,
                  },
                ],
                labels: {
                  singular: "Content Column",
                  plural: "Content Columns",
                },
              },
              // Image Block
              {
                slug: "imageBlock",
                fields: [
                  {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                  },
                  {
                    name: "caption",
                    type: "text",
                    label: "Caption (optional)",
                  },
                ],
                labels: {
                  singular: "Image",
                  plural: "Images",
                },
              },
              // Video Block (if needed)
              {
                slug: "videoBlock",
                fields: [
                  {
                    name: "videoUrl",
                    type: "text",
                    required: true,
                    label: "Video URL",
                  },
                  {
                    name: "caption",
                    type: "text",
                    label: "Caption (optional)",
                  },
                ],
                labels: {
                  singular: "Video",
                  plural: "Videos",
                },
              },
            ],
          }),
        ],
      }),
    },
    {
      name: "contentSummary",
      type: "textarea",
      required: true,
      hooks: {
        beforeValidate: [generateContentSummaryHook],
      },
    },
    {
      name: "readTimeInMins",
      type: "number",
      defaultValue: 0,
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.readTimeInMins;
          },
        ],
        afterRead: [
          ({ data }) => {
            const text = convertLexicalToPlaintext({ data: data?.content });
            const wordsPerMinutes = 200;
            const words = text.trim().split(/\s+/).length;
            return Math.max(1, Math.ceil(words / wordsPerMinutes));
          },
        ],
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "article-authors",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      options: ["Draft", "Published"],
      defaultValue: "Draft",
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        condition: (data) => data?.status === "Published",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath("/");
        revalidatePath(`/article/${doc.slug}`);
        revalidatePath("/admin");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePath("/");
        revalidatePath(`/article/${doc.slug}`);
        return doc;
      },
    ],
  },
};
