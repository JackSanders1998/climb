import { partial } from "convex-helpers/validators";
import { defineTable } from "convex/server";
import { Infer, v } from "convex/values";

/**
 * Schema for settings table.
 */
export const settingsSchema = partial(
  v.object({
    userId: v.id("users"),
    adminFeaturesEnabled: v.boolean(),
    summaryInterval: v.union(
      v.literal("Week"),
      v.literal("Month"),
      // v.literal("year"),
    ),
    preferredGrade: v.union(
      v.literal("YDS"),
      v.literal("Font"),
      v.literal("French"),
      v.literal("V"),
    ),
  }),
);
export type SettingsType = Omit<Infer<typeof settingsSchema>, "userId">;
export const defaultSettings: SettingsType = {
  adminFeaturesEnabled: false,
  summaryInterval: "Week",
  preferredGrade: "YDS",
};

export const settings = defineTable(settingsSchema.fields).index("userId", [
  "userId",
]);
