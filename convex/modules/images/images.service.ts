import { Id } from "../../_generated/dataModel";
import { ActionCtx, MutationCtx } from "../../_generated/server";

export const generateUploadUrl = async (ctx: ActionCtx) => {
  return await ctx.storage.generateUploadUrl();
};

export const createImage = async (
  ctx: MutationCtx,
  { storageId, author }: { storageId: Id<"_storage">; author: Id<"users"> },
) => {
  await ctx.db.insert("images", {
    body: storageId,
    format: "image",
    caption: "A sweet caption!",
    author,
  });
};
