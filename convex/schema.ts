import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    imageUrlId: v.optional(v.id('_storage')),
    author: v.object({
      id: v.string(),
      name: v.string(),
    }),
  }),
  images: defineTable({
    body: v.id("_storage"),
    format: v.string(),
    author: v.object({
      id: v.string(),
      name: v.string(),
    }),
  }),
});
