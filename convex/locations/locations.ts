// convex/index.ts
import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

const geospatial = new GeospatialIndex<
  Id<"locations">,
  {
    author?: string;  // TODO: make this required
    description: string;
    images?: string[];
    environment: string; // e.g. "indoor", "outdoor"
    appleMapsId?: string;
    country: string;
    countryCode: string;
    formattedAddressLines: string[];
    name: string;
    administrativeArea: string;
    administrativeAreaCode: string;
    dependentLocalities: string[];
    fullThoroughfare?: string;
    locality: string;
    subLocality: string;
    postCode?: string;
    subThoroughfare?: string;
    thoroughfare?: string;
    poiCategory?: string;
    eastLongitude?: number;
    northLatitude?: number;
    southLatitude?: number;
    westLongitude?: number;
  }
>(components.geospatial);

export const insert = mutation({
  args: {
    // >>> Custom fields (not in Apple Maps) <<<<<<<
    author: v.optional(v.id("users")),  // TODO: make this required
    description: v.string(),
    images: v.optional(v.array(v.id("images"))),
    metadata: v.optional(v.object({})),
    environment: v.string(), // e.g. "indoor", "outdoor"
    // >>> Apple Maps data <<<<<<
    appleMapsId: v.optional(v.string()),
    coordinate: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    country: v.string(),
    countryCode: v.string(),
    displayMapRegion: v.object({
      eastLongitude: v.number(),
      northLatitude: v.number(),
      southLatitude: v.number(),
      westLongitude: v.number(),
    }),
    formattedAddressLines: v.array(v.string()),
    name: v.string(),
    structuredAddress: v.object({
      administrativeArea: v.string(),
      administrativeAreaCode: v.string(),
      dependentLocalities: v.array(v.string()),
      locality: v.string(),
      subLocality: v.string(),
      postCode: v.optional(v.string()),
      subThoroughfare: v.optional(v.string()),
      thoroughfare: v.optional(v.string()),
      fullThoroughfare: v.optional(v.string()),
    }),
    poiCategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if a record with the same appleMapsId already exists
    if (args.appleMapsId) {
      const existingRecord = await ctx.db
        .query("locations")
        .filter(q => q.eq(q.field("appleMapsId"), args.appleMapsId))
        .first();
      if (existingRecord) {
        throw new Error(`A location with the appleMapsId "${args.appleMapsId}" already exists.`);
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
    }

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

    const locationId = await ctx.db.insert("locations", { ...locationBody, coordinate, displayMapRegion, structuredAddress });

    // This whole geospatial index may not be necessary --> TODO: figure out of it is needed
    await geospatial.insert(
      ctx,          // The Convex mutation context
      locationId,   // The unique string key to associate with the coordinate -- pk on locations table
      { // The geographic coordinate `{ latitude, longitude }` to associate with the key
        latitude: args.coordinate.latitude,
        longitude: args.coordinate.longitude,
      },
      { ...locationBody, ...displayMapRegion, ...structuredAddress } // The data to associate with the key,
    );

    const result = await geospatial.get(ctx, locationId);
    console.log({
      locationId,
      result,
      args,
    });
    return result;
    // await geospatial.remove(ctx, cityId);
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
    const nameResults = await ctx.db
      .query("locations")
      .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm))
      .take(10);

    const addressResults = await ctx.db
      .query("locations")
      .withSearchIndex("search_address", (q) =>
        q.search("concatenatedAddressLines", args.searchTerm)
      )
      .take(10);

    const descriptionResults = await ctx.db
      .query("locations")
      .withSearchIndex("search_description", (q) =>
        q.search("description", args.searchTerm)
      )
      .take(10);

    // Combine results and remove duplicates based on _id
    const allResults = [...nameResults, ...addressResults, ...descriptionResults];
    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [item._id, item])).values()
    );

    return uniqueResults;
  },
});