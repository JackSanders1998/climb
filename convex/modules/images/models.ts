import { defineTable } from "convex/server";
import { v } from "convex/values";

export const images = defineTable({
  author: v.id("users"),
  body: v.id("_storage"),
  caption: v.optional(v.string()),
  format: v.string(),
});
