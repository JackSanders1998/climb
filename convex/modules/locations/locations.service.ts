import { v } from "convex/values";
import { MutationCtx, query } from "../../_generated/server";
import { LocationInsertPayloadType } from "./models";

export const create = async (
  ctx: MutationCtx,
  args: LocationInsertPayloadType,
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Must be signed in to create a location");
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

  // Check if a record with the same appleMapsId already exists
  const appleMapsId = args.appleMaps.appleMapsMetadata.appleMapsId;
  if (appleMapsId) {
    const existingRecord = await ctx.db
      .query("locations")
      .filter((q) => q.eq(q.field("appleMapsId"), appleMapsId))
      .first();
    if (existingRecord) {
      throw new Error(
        `A location with the appleMapsId "${appleMapsId}" already exists.`,
      );
    }
  }

  const generateSearchIdentifiers = () => {
    const identifiers = [
      args.appleMaps.appleMapsMetadata.name.toLowerCase(),
      args.description.toLowerCase(),
      args.appleMaps.appleMapsMetadata.formattedAddressLines
        .join(" ")
        .toLowerCase(),
      args.appleMaps.appleMapsMetadata.poiCategory?.toLowerCase() || "",
    ];
    return identifiers.join(" ");
  };

  const locationId = await ctx.db.insert("locations", {
    author: user._id,
    description: args.description,
    images: args.images,
    metadata: args.metadata,
    environment: args.environment,
    searchIdentifiers: generateSearchIdentifiers(),
    appleMapsId: args.appleMaps.appleMapsMetadata.appleMapsId,
    country: args.appleMaps.appleMapsMetadata.country,
    countryCode: args.appleMaps.appleMapsMetadata.countryCode,
    formattedAddressLines:
      args.appleMaps.appleMapsMetadata.formattedAddressLines,
    name: args.appleMaps.appleMapsMetadata.name,
    poiCategory: args.appleMaps.appleMapsMetadata.poiCategory,
    latitude: args.appleMaps.coordinate.latitude,
    longitude: args.appleMaps.coordinate.longitude,
    eastLongitude: args.appleMaps.displayMapRegion.eastLongitude,
    northLatitude: args.appleMaps.displayMapRegion.northLatitude,
    southLatitude: args.appleMaps.displayMapRegion.southLatitude,
    westLongitude: args.appleMaps.displayMapRegion.westLongitude,
    administrativeArea: args.appleMaps.structuredAddress.administrativeArea,
    administrativeAreaCode:
      args.appleMaps.structuredAddress.administrativeAreaCode,
    dependentLocalities: args.appleMaps.structuredAddress.dependentLocalities,
    locality: args.appleMaps.structuredAddress.locality,
    subLocality: args.appleMaps.structuredAddress.subLocality,
    postCode: args.appleMaps.structuredAddress.postCode,
    subThoroughfare: args.appleMaps.structuredAddress.subThoroughfare,
    thoroughfare: args.appleMaps.structuredAddress.thoroughfare,
    fullThoroughfare: args.appleMaps.structuredAddress.fullThoroughfare,
    reviewStatus: args.reviewStatus, // Default to pending if not provided
  });

  return locationId;
};

// Helper function to build status filter based on optional parameters
const buildStatusFilter = (
  q: any,
  showPending?: boolean,
  showRejected?: boolean,
) => {
  // Priority order: pending > rejected > approved (default)
  if (showPending) {
    return q.eq(q.field("reviewStatus"), "pending");
  }

  if (showRejected) {
    return q.eq(q.field("reviewStatus"), "rejected");
  }

  // Default: show only approved
  return q.eq(q.field("reviewStatus"), "approved");
};

// https://github.com/get-convex/convex-demos/tree/main/search
export const search = query({
  args: {
    searchTerm: v.string(),
    showPending: v.optional(v.boolean()),
    showRejected: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const statusFilter = (q: any) =>
      buildStatusFilter(q, args.showPending, args.showRejected);

    if (!args.searchTerm) {
      return ctx.db.query("locations").filter(statusFilter).take(10);
    }

    return ctx.db
      .query("locations")
      .withSearchIndex("location_search", (q) =>
        q.search("searchIdentifiers", args.searchTerm),
      )
      .filter(statusFilter)
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
    showRejected: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default to 100 if no limit is provided
    const statusFilter = (q: any) =>
      buildStatusFilter(q, args.includePending, args.showRejected);

    return await ctx.db.query("locations").filter(statusFilter).take(limit);
  },
});
