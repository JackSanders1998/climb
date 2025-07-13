import { v } from "convex/values";

/**
 * Schema for user table.
 */
export const userSchema = {
  name: v.string(),
  tokenIdentifier: v.string(),
};
