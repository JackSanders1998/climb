import { v } from "convex/values";
import { createImage } from "./modules/images/images.service";
import { mutationWithRLS } from "./utils/rowLevelSecurity";

/**
 * POST /images
 * Creates a new image document in the database.
 */
export const create = mutationWithRLS({
  args: { storageId: v.id("_storage"), author: v.id("users") },
  handler: async (ctx, { storageId, author }) => {
    return createImage(ctx, { storageId, author });
  },
});
