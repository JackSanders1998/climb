import { Triggers } from "convex-helpers/server/triggers";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";
import { images } from "./images/models";
import { locations } from "./locations/models";
import { users } from "./users/models";

export default defineSchema({
  users,
  locations,
  climbs: defineTable({
    body: v.string(),
  }),
  sessions: defineTable({
    user: v.id("users"),
    location: v.id("locations"),
    images: v.array(v.id("images")),
    // climb: v.array(v.id("climbs")),

    created_at: v.number(),
  }).index("created_at", ["created_at"]),
  images,
});

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>();

// register a function to run when a `ctx.db.insert`, `ctx.db.patch`, `ctx.db.replace`, or `ctx.db.delete` changes the "users" table
triggers.register("users", async (ctx, change) => {
  // Note writing the count to a single document increases write contention.
  // There are more scalable methods if you need high write throughput.
  const countDoc = (await ctx.db.query("climbs").unique())!;
  if (change.operation === "insert") {
    await ctx.db.patch(countDoc._id, { count: countDoc.count + 1 });
  } else if (change.operation === "delete") {
    await ctx.db.patch(countDoc._id, { count: countDoc.count - 1 });
  }
});
