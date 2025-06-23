import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.object({
      id: v.string(),
      name: v.string(),
    }),
  }),
});
