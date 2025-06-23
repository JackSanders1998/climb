import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const send = mutation({
  args: {
    body: v.string(),
  },
  handler: async (ctx, { body }) => {
    const identity = await ctx.auth.getUserIdentity();

    const author = identity;

    if (!author) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("messages", {
      body,
      author: {
        id: author.subject,
        name: author.givenName ?? author.email ?? "Anonymous",
      },
    });
  },
});
