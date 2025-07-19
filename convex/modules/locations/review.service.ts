import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

// Helper function to update location review status
const updateReviewStatus = async (
  ctx: any,
  locationId: Id<"locations">,
  status: "approved" | "rejected",
) => {
  const user = ctx.user;

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
