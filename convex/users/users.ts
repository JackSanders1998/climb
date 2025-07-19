import { v } from "convex/values";
import { internal } from "../_generated/api";
import { DataModel } from "../_generated/dataModel";
import { internalQuery, mutation, query } from "../_generated/server";

export const setTimeZone = mutation({
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, { timezone }) => {
    const user: DataModel["users"]["document"] = await ctx.runQuery(
      internal.users.users.getUser,
    );

    await ctx.db.patch(user._id, { timezone });

    return { ...user, timezone };
  },
});

export const getUser = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getUser internal without authentication present");
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
  handler: async (ctx) => {
    const user: DataModel["users"]["document"] = await ctx.runQuery(
      internal.users.users.getUser,
    );

    return user;
  },
});
