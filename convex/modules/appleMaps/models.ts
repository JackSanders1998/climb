"use node";
import { Infer, v } from "convex/values";

export const appleMapsSearchParams = v.object({
  q: v.string(),
  includePoiCategories: v.optional(v.array(v.string())),
  excludePoiCategories: v.optional(v.array(v.string())),
  searchLocation: v.optional(v.string()),
  searchRegion: v.optional(v.string()),
  userLocation: v.optional(v.string()),
});

export type AppleMapsSearchParams = Infer<typeof appleMapsSearchParams>;
