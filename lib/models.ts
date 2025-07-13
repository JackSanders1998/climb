import { v } from "convex/values";

export const locationSchema = {
  // >>>>> Custom fields (not in Apple Maps) <<<<<<<
  author: v.id("users"),
  description: v.string(),
  images: v.optional(v.array(v.id("images"))),
  metadata: v.optional(v.object({})),
  environment: v.string(), // e.g. "indoor", "outdoor"
  // Concatenated version of formattedAddressLines
  // Keeping this duplicate information because search indexes are only available on strings
  concatenatedAddressLines: v.string(),

  // >>>>> Apple Maps data <<<<<<
  appleMapsId: v.optional(v.string()), // called ID when querying Apple Maps directly
  country: v.string(),
  countryCode: v.string(),
  formattedAddressLines: v.array(v.string()),
  name: v.string(),
  poiCategory: v.optional(v.string()),
  coordinate: v.object({
    latitude: v.number(),
    longitude: v.number(),
  }),
  displayMapRegion: v.object({
    eastLongitude: v.number(),
    northLatitude: v.number(),
    southLatitude: v.number(),
    westLongitude: v.number(),
  }),
  structuredAddress: v.object({
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
  }),
}