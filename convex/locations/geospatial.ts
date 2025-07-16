import { GeospatialIndex } from "@convex-dev/geospatial";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { DisplayMapRegionType } from "./models";

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
