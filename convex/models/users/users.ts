import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";

export const store = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const get = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, { id }) => {
    if (!id) {
      return await ctx.db.query("users").collect();
    }
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  },
});
