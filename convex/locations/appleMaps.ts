import { Infer, v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";

const params = v.object({
  q: v.string(),
  includePoiCategories: v.optional(v.array(v.string())),
  excludePoiCategories: v.optional(v.array(v.string())),
  searchLocation: v.optional(v.string()),
  searchRegion: v.optional(v.string()),
  userLocation: v.optional(v.string()),
});

export type SearchParams = Infer<typeof params>;

export const search = action({
  args: { params },
  // returns: v.array(v.any()) || v.null(), // Adjust the return type as needed
  handler: async (ctx, args) => {
    const token = await ctx.runAction(internal.locations.utils.generateToken);
    const params = new URLSearchParams({
      q: args.params.q,
      includePoiCategories: args.params.includePoiCategories?.join(",") || "",
      excludePoiCategories: args.params.excludePoiCategories?.join(",") || "",
      searchLocation: args.params.searchLocation || "",
      searchRegion: args.params.searchRegion || "",
      userLocation: args.params.userLocation || "",
    });

    const response = await fetch(
      `https://maps-api.apple.com/v1/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data: { results: any[] } = await response.json();
    return data.results;
  },
});

export const autocomplete = action({
  args: { params },
  returns: v.array(v.any()), // Adjust the return type as needed
  handler: async (ctx, args) => {
    const token = await ctx.runAction(internal.locations.utils.generateToken);
    const params = new URLSearchParams({
      q: args.params.q,
      includePoiCategories: args.params.includePoiCategories?.join(",") || "",
      excludePoiCategories: args.params.excludePoiCategories?.join(",") || "",
      searchLocation: args.params.searchLocation || "",
      searchRegion: args.params.searchRegion || "",
      userLocation: args.params.userLocation || "",
    });

    const response = await fetch(
      `https://maps-api.apple.com/v1/searchAutoComplete?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data: { results: any[] } = await response.json();
    return data.results;
  },
});
