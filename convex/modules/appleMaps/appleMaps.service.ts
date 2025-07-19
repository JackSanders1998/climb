import { internal } from "../../_generated/api";
import { ActionCtx } from "../../_generated/server";
import { AppleMapsSearchParams } from "./models";

export const searchAppleMaps = async (
  ctx: ActionCtx,
  args: AppleMapsSearchParams,
  useAutoComplete: boolean = false,
) => {
  const token = await ctx.runAction(internal.utils.mapKitToken.generateToken);
  const params = new URLSearchParams({
    q: args.q,
    includePoiCategories: args.includePoiCategories?.join(",") || "",
    excludePoiCategories: args.excludePoiCategories?.join(",") || "",
    searchLocation: args.searchLocation || "",
    searchRegion: args.searchRegion || "",
    userLocation: args.userLocation || "",
  });

  const response = await fetch(
    `https://maps-api.apple.com/v1/search${useAutoComplete ? "AutoComplete" : ""}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data: { results: any[] } = await response.json();
  return data.results;
};
