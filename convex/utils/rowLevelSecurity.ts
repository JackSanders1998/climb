import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  Rules,
  wrapDatabaseReader,
  wrapDatabaseWriter,
} from "convex-helpers/server/rowLevelSecurity";
import { DataModel } from "../_generated/dataModel";
import {
  action,
  ActionCtx,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";

const getUserIdentity = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Must be logged-in!");
  }
  return identity;
};

const getUserAndIdentityFromDb = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Must be logged-in!");
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

  return { identity, user };
};

async function rlsRules(ctx: QueryCtx) {
  const { identity, user } = await getUserAndIdentityFromDb(ctx);

  return {
    users: {
      read: async () => {
        return false;
      },
      insert: async () => {
        return true;
      },
      modify: async (_, user) => {
        return user.tokenIdentifier === identity.tokenIdentifier;
      },
    },
    locations: {
      read: async () => {
        return true;
      },
      insert: async () => {
        return true;
      },
      modify: async (_, location) => {
        return location.author === user._id;
      },
    },
  } satisfies Rules<QueryCtx, DataModel>;
}

export const queryWithRLS = customQuery(
  query,
  customCtx(async (ctx) => {
    const { identity, user } = await getUserAndIdentityFromDb(ctx);
    return {
      identity,
      user,
      db: wrapDatabaseReader(ctx, ctx.db, await rlsRules(ctx)),
    };
  }),
);

export const mutationWithRLS = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const { identity, user } = await getUserAndIdentityFromDb(ctx);

    return {
      identity,
      user,
      db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx)),
    };
  }),
);

export const actionWithRLS = customAction(
  action,
  customCtx(async (ctx) => {
    const { identity, user } = await getUserIdentity(ctx);
    return {
      identity,
      user,
    };
  }),
);
