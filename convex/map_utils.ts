"use node";
import jwt from "jsonwebtoken";
import { internalAction } from "./_generated/server";

export const generateToken = internalAction({
  args: {},
  handler: async () => {
    const privateKey = Buffer.from(
      process.env.MAPKIT_PRIVATE_KEY!,
      "base64"
    ).toString("utf8");
    const teamId = "L8DXKT63P9";
    const keyId = "NPZQ796H9Q";

    const iat = Math.floor(Date.now() / 1000); // Current time in seconds
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
