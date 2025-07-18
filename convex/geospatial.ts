import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { DisplayMapRegionType } from "./locations/models";

const geospatial = new GeospatialIndex<Id<"locations">, DisplayMapRegionType>(
  components.geospatial,
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
  handler: async (ctx, args): Promise<void> => {
    await geospatial.insert(
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
      },
    );
  },
});

// convex/index.ts
// export const example = query({
//   handler: async (ctx) => {
//     const maxResults = 16;
//     const maxDistance = 10000;
//     const result = await geospatial.queryNearest(
//       ctx,
//       { latitude: 45.52, longitude: -122.681944 },
//       maxResults,
//       maxDistance,
//     );
//     // get location using result.key
//     // and return the distance and coordinates
//     // Note: The result will be an array of objects with keys: key, distance,
//     // coordinates, and region.
//     // You can map it to your desired format.
//     // For example:
//     const location = await getById(ctx, result[0].key);

//     return location;
//   },
// });
