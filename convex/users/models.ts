import { Infer, v } from "convex/values";

/**
 * Schema for users table.
 */
export const userSchema = v.object({
  name: v.string(),
  tokenIdentifier: v.string(),
  timezone: v.optional(v.string()),
});
export type UserType = Infer<typeof userSchema>;
