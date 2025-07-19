import { getOneFrom } from "convex-helpers/server/relationships";
import { defaultSettings, SettingsType } from "./settings.models";

import { WithoutSystemFields } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export const getSettings = async (
  ctx: any,
): Promise<WithoutSystemFields<DataModel["settings"]["document"]>> => {
  // @ts-ignore
  const settings = await getOneFrom(ctx.db, "settings", "userId", ctx.user._id);

  if (!settings) {
    return defaultSettings;
  }

  return settings;
};

export const updateSettings = async (ctx: any, args: Partial<SettingsType>) => {
  const user = ctx.user;

  // @ts-ignore
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
};
