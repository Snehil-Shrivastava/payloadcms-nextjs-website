import sharp from "sharp";
import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { Articles } from "./app/collections/Articles/config";
import { Media } from "./app/collections/Media/config";
import { ArticleAuthors } from "./app/collections/ArticleAuthors";
import { Categories } from "./app/collections/Categories";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
    ],
  }),

  admin: {
    autoLogin: {
      email: process.env.CMS_SEED_ADMIN_EMAIL || "",
      password: process.env.CMS_SEED_ADMIN_PASSWORD || "",
    },
  },

  // Define and configure your collections in this array
  collections: [Media, Articles, ArticleAuthors, Categories],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
});
