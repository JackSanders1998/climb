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
    imageUrlId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { body, imageUrlId }) => {
    const identity = await ctx.auth.getUserIdentity();

    const author = identity;

    if (!author) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("messages", {
      body,
      imageUrlId,
      author: {
        id: author.subject,
        name: author.givenName ?? author.email ?? "Anonymous",
      },
    });
  },
});


// Image upload experiment
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const author = identity;

    if (!author) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("images", {
      body: args.storageId,
      format: "image",
      author: {
        id: author.subject,
        name: author.givenName ?? author.email ?? "Anonymous",
      },
    });
  },
});

