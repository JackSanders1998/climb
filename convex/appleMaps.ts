import { searchAppleMaps } from "./modules/appleMaps/appleMaps.service";
import { appleMapsSearchParams } from "./modules/appleMaps/models";
import { actionWithRLS } from "./utils/rowLevelSecurity";

/**
 * Action to search Apple Maps.
 */
export const search = actionWithRLS({
  args: appleMapsSearchParams,
  handler: async (ctx, args) => {
    return searchAppleMaps(ctx, args);
  },
});

/**
 * Action to get autocomplete suggestions for Apple Maps search.
 */
export const autocomplete = actionWithRLS({
  args: appleMapsSearchParams,
  handler: async (ctx, args) => {
    return searchAppleMaps(ctx, args, true);
  },
});
