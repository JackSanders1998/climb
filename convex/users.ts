import { mutation, query } from "./_generated/server";
import {
  createUser,
  getCurrentUser,
  getCurrentUserWithSettings,
} from "./modules/users/users.service";

/**
 * POST /users
 * Creates a new user document in the database.
 * @returns {WithoutSystemFields<DataModel["users"]["document"]>} - The created user document.
 */
export const create = mutation({
  handler: async (ctx) => {
    return createUser(ctx);
  },
});

/**
 * GET /users
 * Retrieves the current user document.
 * @returns {User} - The current user document.
 */
export const get = query({
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

/**
 * GET /users/settings
 * Retrieves the current user document along with settings.
 * @returns {UserWithSettings} - The current user document with settings.
 */
export const getWithSettings = query({
  handler: async (ctx) => {
    return getCurrentUserWithSettings(ctx);
  },
});
