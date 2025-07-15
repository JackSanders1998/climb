import { Infer, v } from "convex/values";

/**
 * Schema for location table columns not from Apple Maps.
 * (Think of a better variable name...)
 */
const custom = v.object({
  author: v.id("users"),
  description: v.string(),
  images: v.optional(v.array(v.id("images"))),
  metadata: v.optional(v.object({})),
  environment: v.string(), // e.g. "gym", "outdoor"
  /**
   * This is a string that contains all the information we want to search on.
   * It includes:
   * - name
   * - address
   * - country
   * - category
   * - other stuff we might want to search on in the future...metadata?
   * Keeping this duplicate information because search indexes are only available on strings
   */
  searchIdentifiers: v.string(),
});
export type CustomType = Infer<typeof custom>;

export const coordinate = v.object({
  latitude: v.number(),
  longitude: v.number(),
});
export type CoordinateType = Infer<typeof coordinate>;

export const displayMapRegion = v.object({
  eastLongitude: v.number(),
  northLatitude: v.number(),
  southLatitude: v.number(),
  westLongitude: v.number(),
});
export type DisplayMapRegionType = Infer<typeof displayMapRegion>;

export const structuredAddress = v.object({
  administrativeArea: v.optional(v.string()),
  administrativeAreaCode: v.optional(v.string()),
  dependentLocalities: v.optional(v.array(v.string())),
  fullThoroughfare: v.optional(v.string()),
  locality: v.optional(v.string()),
  subLocality: v.optional(v.string()),
  postCode: v.optional(v.string()),
  subThoroughfare: v.optional(v.string()),
  thoroughfare: v.optional(v.string()),
  areasOfInterest: v.optional(v.array(v.string())),
});
export type StructuredAddressType = Infer<typeof structuredAddress>;

export const appleMapsMetadata = v.object({
  appleMapsId: v.optional(v.string()), // called ID when querying Apple Maps directly
  country: v.string(),
  countryCode: v.string(),
  formattedAddressLines: v.array(v.string()),
  name: v.string(),
  poiCategory: v.optional(v.string()),
});
export type AppleMapsMetadataType = Infer<typeof appleMapsMetadata>;

/**
 * Schema for Apple Maps data.
 */
export const appleMaps = v.object({
  appleMapsMetadata,
  coordinate,
  displayMapRegion,
  structuredAddress,
});
export type AppleMapsType = Infer<typeof appleMaps>;

export const locationInsertPayload = v.object({
  description: v.string(),
  images: v.optional(v.array(v.id("images"))),
  metadata: v.optional(v.object({})),
  environment: v.string(), // e.g. "gym", "outdoor"
  appleMaps,
});
export type LocationInsertPayloadType = Infer<typeof locationInsertPayload>;

export const location = v.object({
  custom,
  appleMaps,
});
export type LocationType = Infer<typeof location>;

// DATABASE SCHEMA
export const locationSchema = {
  ...appleMapsMetadata.fields,
  ...coordinate.fields,
  ...displayMapRegion.fields,
  ...structuredAddress.fields,
  ...custom.fields,
};
