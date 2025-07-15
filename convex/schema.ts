import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { locationSchema } from "./locations/models";
import { userSchema } from "./users/models";

export default defineSchema({
  users: defineTable(userSchema.fields).index("by_token", ["tokenIdentifier"]),
  locations: defineTable(locationSchema).searchIndex("location_search", {
    searchField: "searchIdentifiers",
  }),
  climbs: defineTable({
    body: v.string(),
  }),
  images: defineTable({
    author: v.id("users"),
    body: v.id("_storage"),
    caption: v.optional(v.string()),
    format: v.string(),
  }),
});
