import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
  CoordinateType,
  CustomType,
  DisplayMapRegionType,
  locationInsertPayload,
} from "./models";

const geospatial = new GeospatialIndex<
  Id<"locations">,
  CoordinateType &
    DisplayMapRegionType &
    Pick<CustomType, "author" | "environment" | "description">
>(components.geospatial);

export const insert = mutation({
  args: locationInsertPayload,
  handler: async (ctx, args) => {
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
      countryCode: args.appleMaps.appleMapsMetadata.countryCode ?? "",
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

    // This whole geospatial index may not be necessary --> TODO: figure out of it is needed
    await geospatial.insert(
      ctx, // The Convex mutation context
      locationId, // The unique string key to associate with the coordinate -- pk on locations table
      {
        latitude: args.appleMaps.coordinate.latitude,
        longitude: args.appleMaps.coordinate.longitude,
      },
      {
        eastLongitude: args.appleMaps.displayMapRegion.eastLongitude,
        northLatitude: args.appleMaps.displayMapRegion.northLatitude,
        southLatitude: args.appleMaps.displayMapRegion.southLatitude,
        westLongitude: args.appleMaps.displayMapRegion.westLongitude,
        latitude: args.appleMaps.coordinate.latitude,
        longitude: args.appleMaps.coordinate.longitude,
        author: user._id,
        description: args.description,
        environment: args.environment,
      },
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
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm) {
      return ctx.db
        .query("locations")
        .filter((q) => q.eq(q.field("reviewStatus"), "approved"))
        .take(10);
    }
    return ctx.db
      .query("locations")
      .withSearchIndex("location_search", (q) =>
        q.search("searchIdentifiers", args.searchTerm),
      )
      .filter((q) => q.eq(q.field("reviewStatus"), "approved"))
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
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 100; // Default to 100 if no limit is provided
    return await ctx.db.query("locations").take(limit);
  },
});
