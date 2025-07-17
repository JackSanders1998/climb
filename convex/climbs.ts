import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("climbs").collect();
  },
});

export const create = mutation({
  args: {
    body: v.string(),
  },
  handler: async (ctx, { body }) => {
    await ctx.db.insert("climbs", {
      body,
    });
  },
});

export const getById = query({
  args: { id: v.id("climbs") },
  handler: async (ctx, args) => {
    const climb = await ctx.db.get(args.id);
    if (!climb) {
      throw new Error(`Climb with id ${args.id} not found`);
    }
    return climb;
  },
});

// get function that inserts a climb if on doesn't exist
export const getOrCreate = mutation({
  args: {
    id: v.id("climbs"),
    body: v.string(),
  },
  handler: async (ctx, { id, body }) => {
    const existingClimb = await ctx.db.get(id);

    if (existingClimb) {
      return existingClimb;
    }

    const new_climb_id = await ctx.db.insert("climbs", {
      body,
    });

    return await ctx.db.get(new_climb_id);
  },
});
