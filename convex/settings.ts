import { partial } from "convex-helpers/validators";

import { WithoutSystemFields } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { settingsSchema } from "./modules/settings/settings.models";
import {
  getSettings,
  updateSettings,
} from "./modules/settings/settings.service";
import { mutationWithRLS, queryWithRLS } from "./utils/rowLevelSecurity";

/**
 * GET /settings
 * Retrieves the current settings document.
 */
export const get = queryWithRLS({
  handler: async (
    ctx,
  ): Promise<WithoutSystemFields<DataModel["settings"]["document"]>> => {
    return getSettings(ctx);
  },
});

/**
 * PATCH /settings
 * Updates the settings document with the provided fields.
 * @param args - Partial settings fields to update.
 * @returns {WithoutSystemFields<DataModel["settings"]["document"]>} - The updated settings document.
 */
export const update = mutationWithRLS({
  args: partial(settingsSchema),
  handler: async (ctx, args) => {
    return updateSettings(ctx, args);
  },
});
