import { v } from "convex/values";
import {
  createLocation,
  getLocationById,
  listLocations,
  searchLocations,
} from "./modules/locations/locations.service";
import { locationInsertPayload } from "./modules/locations/models";
import {
  approveLocation,
  rejectLocation,
} from "./modules/locations/review.service";
import { mutationWithRLS, queryWithRLS } from "./utils/rowLevelSecurity";

/**
 * POST /locations
 * Create a new location.
 * @param args - The location data to insert.
 * @returns The ID of the created location.
 */
export const create = mutationWithRLS({
  args: locationInsertPayload,
  handler: async (ctx, args) => {
    return createLocation(ctx, args);
  },
});

/**
 * GET /locations/search
 * Search for locations based on a search term and filters.
 * @param searchTerm - The term to search for.
 * @param showPending - Whether to include pending locations.
 * @param showRejected - Whether to include rejected locations.
 * @returns A list of locations matching the search criteria.
 */
export const search = queryWithRLS({
  args: {
    searchTerm: v.string(),
    showPending: v.optional(v.boolean()),
    showRejected: v.optional(v.boolean()),
  },
  handler: async (ctx, { searchTerm, showPending, showRejected }) => {
    return searchLocations(ctx, {
      searchTerm,
      showPending,
      showRejected,
    });
  },
});

/**
 * GET /locations/:id
 * Retrieve a location by its ID.
 * @param id - The ID of the location to retrieve.
 * @returns The location object if found, or an error if not found.
 */
export const getById = queryWithRLS({
  args: { id: v.id("locations") },
  handler: async (ctx, { id }) => {
    return getLocationById(ctx, id);
  },
});

/**
 * GET /locations/list
 * List locations with optional filters.
 * @param limit - The maximum number of locations to return.
 * @param includePending - Whether to include pending locations.
 * @param showRejected - Whether to include rejected locations.
 * @returns A list of locations.
 */
export const list = queryWithRLS({
  args: {
    limit: v.optional(v.number()),
    includePending: v.optional(v.boolean()),
    showRejected: v.optional(v.boolean()),
  },
  handler: async (ctx, { limit, includePending, showRejected }) => {
    return listLocations(ctx, {
      limit,
      includePending,
      showRejected,
    });
  },
});

export const approve = mutationWithRLS({
  args: { id: v.id("locations") },
  handler: async (ctx, { id }) => {
    return approveLocation(ctx, id);
  },
});

export const reject = mutationWithRLS({
  args: { id: v.id("locations") },
  handler: async (ctx, { id }) => {
    return rejectLocation(ctx, id);
  },
});
