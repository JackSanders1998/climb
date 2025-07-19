import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for users table.
 */
const userSchema = v.object({
  name: v.string(),
  tokenIdentifier: v.string(),
});

export const users = defineTable(userSchema.fields).index("by_token", [
  "tokenIdentifier",
]);
