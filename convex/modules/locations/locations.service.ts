import { Id } from "../../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../../_generated/server";
import { insertGeospatialData } from "./geospatial";
import { LocationInsertPayloadType } from "./models";

/**
 * Creates a new location.
 * @param ctx - The mutation context.
 * @param args - The location data.
 * @returns The ID of the created location.
 */
export const createLocation = async (
  ctx: MutationCtx,
  args: LocationInsertPayloadType,
) => {
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
    // @ts-ignore
    author: ctx.user._id,
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

  // insert geospatial data
  await insertGeospatialData(ctx, {
    locationId,
    latitude: args.appleMaps.coordinate.latitude,
    longitude: args.appleMaps.coordinate.longitude,
    eastLongitude: args.appleMaps.displayMapRegion.eastLongitude,
    northLatitude: args.appleMaps.displayMapRegion.northLatitude,
    southLatitude: args.appleMaps.displayMapRegion.southLatitude,
    westLongitude: args.appleMaps.displayMapRegion.westLongitude,
  });

  return locationId;
};

/**
 * Searches for locations based on a search term and optional filters.
 * @param ctx - The query context.
 * @param args - The search parameters.
 * @returns A list of matching locations.
 */
export const searchLocations = async (
  ctx: QueryCtx,
  {
    searchTerm,
    showPending = false,
    showRejected = false,
  }: {
    searchTerm?: string;
    showPending?: boolean;
    showRejected?: boolean;
  },
) => {
  const statusFilter = (q: any) =>
    buildStatusFilter(q, showPending, showRejected);

  if (!searchTerm) {
    return ctx.db.query("locations").filter(statusFilter).take(10);
  }

  return ctx.db
    .query("locations")
    .withSearchIndex("location_search", (q) =>
      q.search("searchIdentifiers", searchTerm),
    )
    .filter(statusFilter)
    .take(10);
};

/**
 * Retrieves a location by its ID.
 * @param ctx - The query context.
 * @param id - The ID of the location to retrieve.
 * @returns The location object if found, or an error if not found.
 */
export const getLocationById = async (ctx: QueryCtx, id: Id<"locations">) => {
  const location = await ctx.db.get(id);
  if (!location) {
    throw new Error(`Location with id ${id} not found`);
  }
  return location;
};

export const listLocations = async (
  ctx: QueryCtx,
  {
    limit = 100,
    includePending = false,
    showRejected = false,
  }: {
    limit?: number;
    includePending?: boolean;
    showRejected?: boolean;
  },
) => {
  const statusFilter = (q: any) =>
    buildStatusFilter(q, includePending, showRejected);

  return await ctx.db.query("locations").filter(statusFilter).take(limit);
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
