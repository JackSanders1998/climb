import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const insert = mutation({
  args: { storageId: v.id('_storage'), author: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.insert('images', {
      body: args.storageId,
      format: 'image',
      caption: 'A sweet caption!',
      author: args.author
    });
  },
});