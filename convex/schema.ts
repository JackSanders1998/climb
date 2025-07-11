import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  climbs: defineTable({
    body: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    avatarId: v.optional(v.id('_storage')),
  }),
  images: defineTable({
    author: v.optional(v.id("users")),  // TODO: make this required
    body: v.id("_storage"),
    caption: v.optional(v.string()),
    format: v.string(),
  }),
  locations: defineTable({
    // >>>>>> Custom fields (not in Apple Maps) <<<<<<<
    author: v.optional(v.id("users")),  // TODO: make this required
    description: v.string(),
    images: v.optional(v.array(v.id("images"))),
    metadata: v.optional(v.object({})),
    environment: v.string(), // e.g. "indoor", "outdoor"
    // Concatenated version of formattedAddressLines
    // Keeping this dupliate information because search indexes are only available on strings
    concatenatedAddressLines: v.string(),

    // >>>>> Apple Maps data <<<<<<
    appleMapsId: v.optional(v.string()),    // called ID when querying Apple Maps directly
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
      fullThoroughfare: v.optional(v.string()),
      locality: v.string(),
      subLocality: v.string(),
      postCode: v.optional(v.string()),
      subThoroughfare: v.optional(v.string()),
      thoroughfare: v.optional(v.string()),
    }),
    poiCategory: v.optional(v.string()),
  }).searchIndex("search_name", {
    searchField: "name",
  }).searchIndex("search_address", {
    searchField: "concatenatedAddressLines",
  }).searchIndex("search_description", {
    searchField: "description",
  })
});