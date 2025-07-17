import { getOneFrom } from "convex-helpers/server/relationships";
import { partial } from "convex-helpers/validators";
import { mutation, query } from "../_generated/server";
import { settingsSchema, SettingsType } from "./models";

const defaultSettings: SettingsType = {
  adminFeaturesEnabled: false,
  summaryInterval: "Week",
  preferredGrade: "YDS",
};

// const insertDefault = internalMutation({
//   args: v.id("user"),
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Called getSettings without authentication present");
//     }

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//     if (!user) {
//       throw new Error("Unauthenticated call to mutation");
//     }

//     await ctx.db.insert("settings", {
//       userId: user._id,
//       ...defaultSettings,
//     });
//   },
// });

export const get = query({
  // args: partial(settingsSchema),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getSettings without authentication present");
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
      // await ctx.db.insert("settings", {
      //   userId: user._id,
      //   ...defaultSettings,
      // });

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
