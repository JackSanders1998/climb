import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { images } from "./modules/images/models";
import { locations } from "./modules/locations/models";
import { settingsSchema } from "./modules/settings/settings.models";
import { users } from "./modules/users/users.models";

export default defineSchema({
  users,
  locations,
  climbs: defineTable({
    user: v.id("users"),
    location: v.id("locations"),
    images: v.array(v.id("images")),
    sessionn: v.id("sessions"),

    body: v.string(),
  }),
  sessions: defineTable({
    user: v.id("users"),
    location: v.id("locations"),
    images: v.array(v.id("images")),
    notes: v.optional(v.string()),
    climbs: v.array(v.id("climbs")), // to be updated via trigger
    endedAt: v.optional(v.number()), // timestamp of when the session ended
  }),
  images,
  settings: defineTable(settingsSchema.fields).index("userId", ["userId"]),
});

// start using Triggers, with table types from schema.ts
// const triggers = new Triggers<DataModel>();

// register a function to run when a `ctx.db.insert`, `ctx.db.patch`, `ctx.db.replace`, or `ctx.db.delete` changes the "users" table
// triggers.register("users", async (ctx, change) => {
//   // Note writing the count to a single document increases write contention.
//   // There are more scalable methods if you need high write throughput.
//   const countDoc = (await ctx.db.query("climbs").unique())!;
//   if (change.operation === "insert") {
//     await ctx.db.patch(countDoc._id, { count: countDoc.count + 1 });
//   } else if (change.operation === "delete") {
//     await ctx.db.patch(countDoc._id, { count: countDoc.count - 1 });
//   }
//   settings: defineTable(settingsSchema.fields).index("userId", ["userId"]),
// });
