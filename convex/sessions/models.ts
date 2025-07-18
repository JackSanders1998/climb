import { v } from "convex/values";

export const sessionSchema = v.object({
  startedAt: v.string(),
  endedAt: v.optional(v.string()),
  userId: v.id("users"),
});
