import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import { DisplayMapRegionType } from "./models";

const geospatial = new GeospatialIndex<Id<"locations">, DisplayMapRegionType>(
  components.geospatial
);

export const insert = mutation({
  args: {
    locationId: v.id("locations"),
    latitude: v.number(),
    longitude: v.number(),
    eastLongitude: v.number(),
    northLatitude: v.number(),
    southLatitude: v.number(),
    westLongitude: v.number(),
  },
  handler: async (ctx, args) => {
    // This whole geospatial index may not be necessary --> TODO: figure out of it is needed
    const res = await geospatial.insert(
      ctx, // The Convex mutation context
      args.locationId, // The unique string key to associate with the coordinate -- pk on locations table
      {
        latitude: args.latitude,
        longitude: args.longitude,
      },
      {
        eastLongitude: args.eastLongitude,
        northLatitude: args.northLatitude,
        southLatitude: args.southLatitude,
        westLongitude: args.westLongitude,
      }
    );

    return geospatial.get(ctx, locationId);
  },
});

// https://www.convex.dev/components/geospatial#example
// https://github.com/get-convex/geospatial/tree/main/example
export const searchByRectangleExperiment = query({
  handler: (ctx) => {
    const rectangle = {
      west: -88.9712,
      south: 40.7831,
      east: -86.9712,
      north: 42.7831,
    };
    return geospatial.query(ctx, {
      shape: { type: "rectangle", rectangle },
    });
  },
});

// https://github.com/get-convex/convex-demos/tree/main/search
export const search = query({
  args: {
    searchTerm: v.string(),
    showPending: v.optional(v.boolean()),
    showRejected: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm) {
      return ctx.db
        .query("locations")
        .filter((q) => q.eq(q.field("reviewStatus"), "approved"))
        .take(10);
    }

    // Build the status filter based on the optional parameters
    const buildStatusFilter = (q: any) => {
      const conditions = [q.eq(q.field("reviewStatus"), "approved")];

      if (args.showPending) {
        conditions.push(q.eq(q.field("reviewStatus"), "pending"));
      }

      if (args.showRejected) {
        conditions.push(q.eq(q.field("reviewStatus"), "rejected"));
      }

      return conditions.length === 1 ? conditions[0] : q.or(...conditions);
    };

    return ctx.db
      .query("locations")
      .withSearchIndex("location_search", (q) =>
        q.search("searchIdentifiers", args.searchTerm)
      )
      .filter(buildStatusFilter)
      .take(10);
  },
});

export const getById = query({
  args: { id: v.id("locations") },
  handler: async (ctx, args) => {
    const location = await ctx.db.get(args.id);
    if (!location) {
      throw new Error(`Location with id ${args.id} not found`);
    }
    return location;
  },
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
    includePending: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default to 100 if no limit is provided

    if (args.includePending) {
      // Return both approved and pending locations
      return await ctx.db
        .query("locations")
        .filter((q) =>
          q.or(
            q.eq(q.field("reviewStatus"), "approved"),
            q.eq(q.field("reviewStatus"), "pending")
          )
        )
        .take(limit);
    }

    // Default: only return approved locations
    return await ctx.db
      .query("locations")
      .filter((q) => q.eq(q.field("reviewStatus"), "approved"))
      .take(limit);
  },
});

export const getPendingLocations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db
      .query("locations")
      .filter((q) => q.eq(q.field("reviewStatus"), "pending"))
      .take(limit);
  },
});

export const approveLocation = mutation({
  args: { id: v.id("locations") },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be signed in to approve a location");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();
    if (!user) {
      throw new Error("User not found");
    }
  },
});
