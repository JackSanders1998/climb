import axios from "axios";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
// import { ErrorResponse, SearchACInput, SearchInput } from "./appleMaps";

// TODO: build using https://docs.convex.dev/tutorial/actions
// https://github.com/gwabbey/trentino-trasporti/blob/27b9f97e68eaf0a97aa8978ba27105be2d0157c1/src/api/apple-maps/geolocation.ts#L29
// https://github.com/nickwelsh/next-mapkit-autocomplete/blob/3c247eb07e8b943c60e5cd0050e0ee4522d6bb83/app/utils/generate-mapkit-jwt.ts


const generateToken = async (): Promise<string> => {
  const file = fs.readFileSync(
    path.resolve("/Users/jack/Downloads/AuthKey_NPZQ796H9Q.p8"),
    "base64"
  );

  const privateKey = Buffer.from(file, "base64").toString("utf8");


  console.log("Private Key:", privateKey);


  const teamId = "L8DXKT63P9"; // Replace with your Apple Developer Team ID
  const keyId = "NPZQ796H9Q"; // Replace with the Key ID from Apple Developer account

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

  const appleMapKitResponse = await fetch("https://maps-api.apple.com/v1/token", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { accessToken } = await appleMapKitResponse.json();
  return accessToken;

}

const search = async (token: string, params: any) => {
  console.log("Search params:", params);
  // https://developer.apple.com/documentation/applemapsserverapi/-v1-search
  const { data: { results } } = await axios.get(
    `https://maps-api.apple.com/v1/search`,
    {
      params:
      {
        ...params,
        includePoiCategories: params.includePoiCategories?.join(","),
        excludePoiCategories: params.excludePoiCategories?.join(","),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return results;
}

const autocomplete = async (token: string, params: any) => {
  // https://developer.apple.com/documentation/applemapsserverapi/-v1-search
  const { data: { results } } = await axios.get(
    `https://maps-api.apple.com/v1/searchAutocomplete`,
    {
      params,
      // {
      //   ...params,
      //   includePoiCategories: params.includePoiCategories?.join(","),
      //   excludePoiCategories: params.excludePoiCategories?.join(","),
      // },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return results;
}

const main = async () => {
  let token: string;
  try {
    token = await generateToken();
  }
  catch (error) {
    console.error("Error generating token:", error);
    return;
  }

  try {
    const params: any = {
      q: "movement climbing gym",
      userLocation: "41.896964,-87.643982",
      searchRegion: "42,-87,41,-88",
      // searchLocation: "41.896964,-87.643982",
      includePoiCategories: ['Hotel'],
    };

    const results = await search(token, params);
    console.log("Search Results:", results, results.length);
  } catch (err: unknown) {
    const error = err as any; // Cast the error to ErrorResponse
    console.error("Error searching Apple Map data:", {
      statusCode: error.status,
      reason: error.code,
      message: error.response.data.error.message,
      details: error.response.data.error.details,
    });

  }
};

main().catch((error) => console.error("Error fetching Apple Map data:", error));