import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { createImage } from "./modules/images/images.service";

export const create = mutation({
  args: { storageId: v.id("_storage"), author: v.id("users") },
  handler: async (ctx, { storageId, author }) => {
    return createImage(ctx, { storageId, author });
  },
});
