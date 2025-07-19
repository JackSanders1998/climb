import { GeospatialIndex } from "@convex-dev/geospatial";
import { components } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { DisplayMapRegionType } from "./models";

const geospatial = new GeospatialIndex<Id<"locations">, DisplayMapRegionType>(
  components.geospatial,
);

export const insertGeospatialData = async (
  ctx: MutationCtx,
  {
    locationId,
    latitude,
    longitude,
    eastLongitude,
    northLatitude,
    southLatitude,
    westLongitude,
  }: {
    locationId: Id<"locations">; // Unique string key to associate with the coordinate -- pk on locations table
    latitude: number;
    longitude: number;
    eastLongitude: number;
    northLatitude: number;
    southLatitude: number;
    westLongitude: number;
  },
): Promise<void> => {
  await geospatial.insert(
    ctx,
    locationId,
    {
      latitude,
      longitude,
    },
    {
      eastLongitude,
      northLatitude,
      southLatitude,
      westLongitude: westLongitude,
    },
  );
};
