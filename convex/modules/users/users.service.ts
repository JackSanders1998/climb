import { DataModel } from "../../_generated/dataModel";

/**
 * Create a new user.
 * @param ctx The mutation context.
 * @throws {Error} If the user is not authenticated.
 * @returns {<Id<"users">>} The ID of the created user.
 */
export const createUser = async (ctx: any) => {
  // Check if we've already stored this identity before.
  const user = ctx.user;
  const identity = ctx.identity;

  if (user !== null) {
    // If we've seen this identity before but the name has changed, patch the value.
    if (user.name !== identity.name) {
      await ctx.db.patch(user._id, { name: identity.name });
    }
    return user._id;
  }

  // If it's a new identity, create a new `User`.
  return await ctx.db.insert("users", {
    name: identity.name ?? "Anonymous",
    tokenIdentifier: identity.tokenIdentifier,
  });
};

/**
 * @param ctx The query context.
 * @throws {Error} If the user is not authenticated or not found.
 * @returns {Object} An object containing the user and their settings.
 */
export const getCurrentUserWithSettings = async (
  ctx: any,
): Promise<{
  user: DataModel["users"]["document"];
  settings: DataModel["settings"]["document"][];
}> => {
  const user = ctx.user;
  const userSettings = await ctx.db
    .query("settings")
    // @ts-ignore
    .filter((q) => q.eq("userId", user._id.toString()))
    .collect();
  return { user, settings: userSettings };
};
