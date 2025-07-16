import { Infer, v } from "convex/values";

/**
 * Schema for settings table.
 */
export const settingsSchema = v.object({
  userId: v.id("users"),
  adminFeaturesEnabled: v.boolean(),
});
export type SettingsType = Omit<Infer<typeof settingsSchema>, "userId">;
