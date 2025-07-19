import { partial } from "convex-helpers/validators";
import { mutation, query } from "./_generated/server";

import { WithoutSystemFields } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { settingsSchema } from "./modules/settings/settings.models";
import {
  getSettings,
  updateSettings,
} from "./modules/settings/settings.service";

export const get = query({
  handler: async (
    ctx,
  ): Promise<WithoutSystemFields<DataModel["settings"]["document"]>> => {
    return getSettings(ctx);
  },
});

export const update = mutation({
  args: partial(settingsSchema),
  handler: async (ctx, args) => {
    return updateSettings(ctx, args);
  },
});
