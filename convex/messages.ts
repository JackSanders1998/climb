import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('messages').collect();
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, message) => {
    await ctx.db.insert('messages', message);
  },
});
