import { mutation, query } from "./_generated/server";
import {
  createUser,
  getCurrentUser,
  getCurrentUserWithSettings,
} from "./modules/users/users.service";

export const create = mutation({
  handler: async (ctx) => {
    return createUser(ctx);
  },
});

export const get = query({
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

export const getWithSettings = query({
  handler: async (ctx) => {
    return getCurrentUserWithSettings(ctx);
  },
});
