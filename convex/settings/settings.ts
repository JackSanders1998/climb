import { getOneFrom } from "convex-helpers/server/relationships";
import { partial } from "convex-helpers/validators";
import { internal } from "../_generated/api";
import { internalQuery, mutation, query } from "../_generated/server";
import { settingsSchema, SettingsType } from "./models";

import { WithoutSystemFields } from "convex/server";
import { DataModel } from "../_generated/dataModel";

const defaultSettings: SettingsType = {
  adminFeaturesEnabled: false,
  summaryInterval: "Week",
  preferredGrade: "YDS",
};

export const getSettings = internalQuery({
  handler: async (ctx): Promise<DataModel["settings"]["document"] | null> => {
    const user = await ctx.runQuery(internal.users.users.getUser);

    const settings = await getOneFrom(ctx.db, "settings", "userId", user._id);

    return settings;
  },
});

export const get = query({
  // args: partial(settingsSchema),
  handler: async (
    ctx,
  ): Promise<WithoutSystemFields<DataModel["settings"]["document"]>> => {
    const settings: DataModel["settings"]["document"] | null =
      await ctx.runQuery(internal.settings.settings.getSettings);

    if (!settings) {
      return defaultSettings;
    }

    return settings;
  },
});

export const patch = mutation({
  args: partial(settingsSchema),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called patchSettings without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    const settings = await getOneFrom(ctx.db, "settings", "userId", user._id);

    if (!settings) {
      const res = await ctx.db.insert("settings", {
        userId: user._id,
        ...defaultSettings,
        ...args,
      });

      return res;
    } else {
      await ctx.db.patch(settings._id, args);
    }
  },
});
