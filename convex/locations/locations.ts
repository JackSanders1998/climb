import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
  appleMapsSchemaType,
  coordinateSchemaType,
  customSchemaType,
  displayMapRegionSchemaType,
  locationSchema,
} from "./models";

const geospatial = new GeospatialIndex<
  Id<"locations">,
  coordinateSchemaType &
    displayMapRegionSchemaType &
    Pick<customSchemaType, "author" | "environment" | "description"> &
    Pick<
      appleMapsSchemaType,
      "appleMapsId" | "formattedAddressLines" | "name" | "poiCategory"
    >
>(components.geospatial);

export const insert = mutation({
  args: {
    ...locationSchema,
  },
  handler: async (ctx, args) => {
    // Check if a record with the same appleMapsId already exists
    if (args.appleMapsId) {
      const existingRecord = await ctx.db
        .query("locations")
        .filter((q) => q.eq(q.field("appleMapsId"), args.appleMapsId))
        .first();
      if (existingRecord) {
        throw new Error(
          `A location with the appleMapsId "${args.appleMapsId}" already exists.`
        );
      }
    }

    const locationBody = {
      author: args.author,
      description: args.description,
      images: args.images,
      metadata: args.metadata,
      environment: args.environment,
      concatenatedAddressLines: args.formattedAddressLines.join(" "),
      appleMapsId: args.appleMapsId,
      country: args.country,
      countryCode: args.countryCode,
      formattedAddressLines: args.formattedAddressLines,
      name: args.name,
      poiCategory: args.poiCategory,
    };

    const coordinate = {
      latitude: args.coordinate.latitude,
      longitude: args.coordinate.longitude,
    };

    const displayMapRegion = {
      eastLongitude: args.displayMapRegion.eastLongitude,
      northLatitude: args.displayMapRegion.northLatitude,
      southLatitude: args.displayMapRegion.southLatitude,
      westLongitude: args.displayMapRegion.westLongitude,
    };

    const structuredAddress = {
      administrativeArea: args.structuredAddress.administrativeArea,
      administrativeAreaCode: args.structuredAddress.administrativeAreaCode,
      dependentLocalities: args.structuredAddress.dependentLocalities,
      locality: args.structuredAddress.locality,
      subLocality: args.structuredAddress.subLocality,
      postCode: args.structuredAddress.postCode,
      subThoroughfare: args.structuredAddress.subThoroughfare,
      thoroughfare: args.structuredAddress.thoroughfare,
      fullThoroughfare: args.structuredAddress.fullThoroughfare,
    };

    const locationId = await ctx.db.insert("locations", {
      ...locationBody,
      displayMapRegion,
      coordinate,
      author: args.author,
      environment: args.environment,
      description: args.description,
      searchIdentifiers: "",
      structuredAddress: args.structuredAddress
    });

    // This whole geospatial index may not be necessary --> TODO: figure out of it is needed
    await geospatial.insert(
      ctx, // The Convex mutation context
      locationId, // The unique string key to associate with the coordinate -- pk on locations table
      {
        // The geographic coordinate `{ latitude, longitude }` to associate with the key
        ...coordinate
      },
      {
        ...locationBody,
        ...displayMapRegion,
        ...structuredAddress,
        ...coordinate
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
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("locations")
      .withSearchIndex("location_search", (q) =>
        q.search("searchIdentifiers", args.searchTerm)
      )
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
