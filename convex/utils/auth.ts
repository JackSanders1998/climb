import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// The tiping is all fucked up here so not using this method rn
export const test = internalMutation({
  returns: v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    name: v.string(),
    tokenIdentifier: v.string(),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be signed in to perform this action");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    return user;
  },
});
