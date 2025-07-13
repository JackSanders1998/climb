import { Infer, v } from "convex/values";

/**
 * Schema for location table columns not from Apple Maps.
 * (Think of a better variable name...)
 */
const customSchema = {
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
};
const customSchemaType = v.object({ ...customSchema });
export type customSchemaType = Infer<typeof customSchemaType>;

export const coordinateSchema = {
  latitude: v.number(),
  longitude: v.number(),
}
const coordinateSchemaType = v.object({ ...coordinateSchema });
export type coordinateSchemaType = Infer<typeof coordinateSchemaType>;

export const displayMapRegionSchema = {
  eastLongitude: v.number(),
  northLatitude: v.number(),
  southLatitude: v.number(),
  westLongitude: v.number(),
};
const displayMapRegionSchemaType = v.object({ ...displayMapRegionSchema });
export type displayMapRegionSchemaType = Infer<typeof displayMapRegionSchemaType>;

export const structuredAddressSchema = {
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
};
const structuredAddressSchemaType = v.object({ ...structuredAddressSchema });
export type structuredAddressSchemaType = Infer<typeof structuredAddressSchemaType>;

/**
 * Schema for Apple Maps data.
 */
export const appleMapsSchema = {
  appleMapsId: v.optional(v.string()), // called ID when querying Apple Maps directly
  country: v.string(),
  countryCode: v.string(),
  formattedAddressLines: v.array(v.string()),
  name: v.string(),
  poiCategory: v.optional(v.string()),
  coordinate: v.object({
    ...coordinateSchema,
  }),
  displayMapRegion: v.object({
    ...displayMapRegionSchema,
  }),
  structuredAddress: v.object({
    ...structuredAddressSchema,
  }),
};
const appleMapsSchemaType = v.object({ ...appleMapsSchema });
export type appleMapsSchemaType = Infer<typeof appleMapsSchemaType>;

export const locationSchema = {
  ...customSchema,
  ...appleMapsSchema,
};
const locationSchemaType = v.object({...locationSchema});
export type locationSchemaType = Infer<typeof locationSchemaType>;

