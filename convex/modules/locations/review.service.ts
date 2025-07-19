import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

// Helper function to authenticate and get user
const authenticateUser = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Must be signed in to perform this action");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Helper function to update location review status
const updateReviewStatus = async (
  ctx: any,
  locationId: Id<"locations">,
  status: "approved" | "rejected",
) => {
  const user = await authenticateUser(ctx);

  await ctx.db.patch(locationId, {
    reviewStatus: status,
    reviewedBy: user._id,
    reviewedAt: Date.now(),
  });
};

export const approveLocation = async (
  ctx: MutationCtx,
  id: Id<"locations">,
) => {
  await updateReviewStatus(ctx, id, "approved");
};

export const rejectLocation = async (ctx: MutationCtx, id: Id<"locations">) => {
  await updateReviewStatus(ctx, id, "rejected");
};
