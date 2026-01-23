import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "category",
  },
  fields: [
    {
      name: "category",
      type: "text",
      required: true,
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
    },
  ],
};
