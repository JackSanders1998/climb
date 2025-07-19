import { getOneFrom } from "convex-helpers/server/relationships";
import { MutationCtx, QueryCtx } from "../../_generated/server";
import { defaultSettings, SettingsType } from "./settings.models";

import { WithoutSystemFields } from "convex/server";
import { DataModel } from "../../_generated/dataModel";
import { getCurrentUser } from "../users/users.service";

export const getSettings = async (
  ctx: QueryCtx,
): Promise<WithoutSystemFields<DataModel["settings"]["document"]>> => {
  const user = await getCurrentUser(ctx);
  const settings = await getOneFrom(ctx.db, "settings", "userId", user._id);

  if (!settings) {
    return defaultSettings;
  }

  return settings;
};

export const updateSettings = async (
  ctx: MutationCtx,
  args: Partial<SettingsType>,
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called updateSettings without authentication present");
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
};
