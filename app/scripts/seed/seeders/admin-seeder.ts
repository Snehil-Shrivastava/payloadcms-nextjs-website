import { getPayload } from "payload";
import config from "@payload-config";
import { isDuplicateError } from "../lib/is-duplicate-error";

export async function seedAdmin() {
  const payload = await getPayload({ config });

  try {
    const response = await payload.create({
      collection: "users",
      data: {
        email: process.env.CMS_SEED_ADMIN_EMAIL || "",
        password: process.env.CMS_SEED_ADMIN_PASSWORD || "",
      },
    });
    console.log("Admin user created", response);
  } catch (error) {
    if (isDuplicateError(error)) {
      console.error("Admin user already exists.");
    } else {
      console.error(
        "Error seeding admin user:",
        JSON.stringify(error, null, 2)
      );
    }
  }
}
