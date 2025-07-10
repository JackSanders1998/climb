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
      fullThoroughfare: v.optional(v.string()),
      locality: v.string(),
      subLocality: v.string(),
      postCode: v.optional(v.string()),
      subThoroughfare: v.optional(v.string()),
      thoroughfare: v.optional(v.string()),
    }),
    poiCategory: v.optional(v.string()),
    images: v.optional(v.array(v.id("images"))),
  })
});


/**
[
  {
    coordinate: {
      latitude: 41.9079051,
      longitude: -87.6496381,
    },
    country: "United States",
    countryCode: "US",
    displayMapRegion: {
      eastLongitude: -87.643596,
      northLatitude: 41.9124017,
      southLatitude: 41.9034084,
      westLongitude: -87.6556801,
    },
    formattedAddressLines: [
      "1460 N Dayton St",
      "Chicago, IL  60642",
      "United States",
    ],
    id: "I155267A846494FFA",
    name: "Movement",
    poiCategory: "RockClimbing",
    structuredAddress: {
      administrativeArea: "Illinois",
      administrativeAreaCode: "IL",
      dependentLocalities: ["Old Town"],
      fullThoroughfare: "1460 N Dayton St",
      locality: "Chicago",
      postCode: "60642",
      subLocality: "Old Town",
      subThoroughfare: "1460",
      thoroughfare: "N Dayton St",
    },
  },
]
*/