import { internal } from "./_generated/api";
import { action } from "./_generated/server";

export const search = action({
  args: {},
  handler: async (ctx) => {
    const token = await ctx.runAction(internal.map_utils.generateToken);
    const params = new URLSearchParams({
      q: "1600 Pennsylvania Avenue NW, Washington, D.C., 20500",
    });

    const response = await fetch(`https://maps-api.apple.com/v1/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: { results: any[] } = await response.json();
    return data.results;
  },
});
