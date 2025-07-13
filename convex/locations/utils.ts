"use node";
import { ActionCache } from "@convex-dev/action-cache";
import jwt from "jsonwebtoken";
import { components, internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

// Is it worth caching the token?
const tokenCache = new ActionCache(components.actionCache, {
  action: internal.locations.utils.generateToken,
  name: "generateMapKitToken",
  ttl: 1000 * 60 * 60 * 24 * 5, // 5 days
});

/**
 * Generates a MapKit JS token for Apple Maps API access.
 * This token is used to authenticate requests to the Apple Maps API.
 * 
 * @returns {Promise<string>} A promise that resolves to the generated token.
 */
export const generateToken = internalAction({
  handler: async (ctx): Promise<string> => {
    const privateKey = Buffer.from(
      process.env.MAPKIT_PRIVATE_KEY!,
      "base64"
    ).toString("utf8");
    const teamId = "L8DXKT63P9";
    const keyId = "NPZQ796H9Q";

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // Set expiration to 1 hour later (3600 seconds)

    const token = jwt.sign(
      {
        iss: teamId,
        iat,
        exp,
      },
      privateKey,
      {
        algorithm: "ES256",
        header: {
          alg: "ES256",
          kid: keyId,
          typ: "JWT",
        },
      }
    );

    const appleMapKitResponse = await fetch(
      "https://maps-api.apple.com/v1/token",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { accessToken } = await appleMapKitResponse.json();
    return accessToken;
  },
});
