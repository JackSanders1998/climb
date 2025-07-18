import { internal } from "../_generated/api";
import { DataModel, Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

export const create = mutation({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.users.getUser);

    // Check if there are any unfinished sessions.
    const unfinishedSessions = (
      await ctx.db
        .query("sessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect()
    ).filter((session) => session.endedAt === undefined);

    // If there are unfinished sessions, end them.
    if (unfinishedSessions.length > 0) {
      const promises = unfinishedSessions.map(async (session) => {
        await ctx.db.patch(session._id, {
          endedAt: new Date().toISOString(),
        });
      });
      await Promise.all(promises);
    }

    // Create a new session.
    const res: Id<"sessions"> = await ctx.db.insert("sessions", {
      startedAt: new Date().toISOString(),
      endedAt: undefined,
      userId: user._id,
    });

    return res;
  },
});

export const get = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.users.getUser);

    const session: DataModel["sessions"]["document"] = (
      await ctx.db
        .query("sessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect()
    ).filter((session) => typeof session.endedAt !== "string")[0];

    if (!session) {
      return undefined;
    } else {
      return session;
    }
  },
});

export const end = mutation({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.users.getUser);

    console.log("CALLING END");

    // Check if there are any unfinished sessions.
    const unfinishedSessions = (
      await ctx.db
        .query("sessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect()
    ).filter((session) => session.endedAt === undefined);

    console.log("UNFINISHED SESSIONS", unfinishedSessions);

    // If there are unfinished sessions, end them.
    if (unfinishedSessions.length > 0) {
      const promises = unfinishedSessions.map(async (session) => {
        await ctx.db.patch(session._id, {
          endedAt: new Date().toISOString(),
        });
      });
      await Promise.all(promises);
    }
  },
});
