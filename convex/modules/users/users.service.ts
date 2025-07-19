import { MutationCtx, QueryCtx } from "../../_generated/server";

/**
 * Create a new user.
 * @param ctx The mutation context.
 * @throws {Error} If the user is not authenticated.
 * @returns {<Id<"users">>} The ID of the created user.
 */
export const createUser = async (ctx: MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called createUser without authentication present");
  }

  // Check if we've already stored this identity before.
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

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
 * Get the current user based on the authentication token.
 * @param ctx The query context.
 * @throws {Error} If the user is not authenticated or not found.
 * @returns {Object} The user object associated with the current authentication token.
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called getCurrentUser without authentication present");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * 1. Get the current user from `getCurrentUser`
 * 2. Query the `settings` table to find settings associated with the user's ID.
 * @param ctx The query context.
 * @throws {Error} If the user is not authenticated or not found.
 * @returns {Object} An object containing the user and their settings.
 */
export const getCurrentUserWithSettings = async (ctx: QueryCtx) => {
  const user = await getCurrentUser(ctx);

  const userSettings = await ctx.db
    .query("settings")
    .filter((q) => q.eq("userId", user._id.toString()))
    .collect();
  return { user, settings: userSettings };
};
