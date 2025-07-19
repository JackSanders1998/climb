import { action } from "./_generated/server";
import { searchAppleMaps } from "./modules/appleMaps/appleMaps.service";
import { appleMapsSearchParams } from "./modules/appleMaps/models";

/**
 * Action to search Apple Maps.
 */
export const search = action({
  args: appleMapsSearchParams,
  handler: async (ctx, args) => {
    return searchAppleMaps(ctx, args);
  },
});

/**
 * Action to get autocomplete suggestions for Apple Maps search.
 */
export const autocomplete = action({
  args: appleMapsSearchParams,
  handler: async (ctx, args) => {
    return searchAppleMaps(ctx, args, true);
  },
});
