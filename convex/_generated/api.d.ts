/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appleMaps from "../appleMaps.js";
import type * as geospatial from "../geospatial.js";
import type * as images from "../images.js";
import type * as locations from "../locations.js";
import type * as modules_appleMaps_models from "../modules/appleMaps/models.js";
import type * as modules_images_models from "../modules/images/models.js";
import type * as modules_locations_geospatial from "../modules/locations/geospatial.js";
import type * as modules_locations_models from "../modules/locations/models.js";
import type * as modules_locations_review from "../modules/locations/review.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as utils_mapKitToken from "../utils/mapKitToken.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  appleMaps: typeof appleMaps;
  geospatial: typeof geospatial;
  images: typeof images;
  locations: typeof locations;
  "modules/appleMaps/models": typeof modules_appleMaps_models;
  "modules/images/models": typeof modules_images_models;
  "modules/locations/geospatial": typeof modules_locations_geospatial;
  "modules/locations/models": typeof modules_locations_models;
  "modules/locations/review": typeof modules_locations_review;
  settings: typeof settings;
  users: typeof users;
  "utils/mapKitToken": typeof utils_mapKitToken;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  geospatial: {
    document: {
      get: FunctionReference<
        "query",
        "internal",
        { key: string },
        {
          coordinates: { latitude: number; longitude: number };
          filterKeys: Record<
            string,
            | string
            | number
            | boolean
            | null
            | bigint
            | Array<string | number | boolean | null | bigint>
          >;
          key: string;
          sortKey: number;
        } | null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        {
          document: {
            coordinates: { latitude: number; longitude: number };
            filterKeys: Record<
              string,
              | string
              | number
              | boolean
              | null
              | bigint
              | Array<string | number | boolean | null | bigint>
            >;
            key: string;
            sortKey: number;
          };
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
        },
        null
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        {
          key: string;
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
        },
        boolean
      >;
    };
    query: {
      debugCells: FunctionReference<
        "query",
        "internal",
        {
          levelMod: number;
          maxCells: number;
          maxLevel: number;
          minLevel: number;
          rectangle: {
            east: number;
            north: number;
            south: number;
            west: number;
          };
        },
        Array<{
          token: string;
          vertices: Array<{ latitude: number; longitude: number }>;
        }>
      >;
      execute: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          levelMod: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          maxCells: number;
          maxLevel: number;
          minLevel: number;
          query: {
            filtering: Array<{
              filterKey: string;
              filterValue: string | number | boolean | null | bigint;
              occur: "should" | "must";
            }>;
            maxResults: number;
            rectangle: {
              east: number;
              north: number;
              south: number;
              west: number;
            };
            sorting: {
              interval: { endExclusive?: number; startInclusive?: number };
            };
          };
        },
        {
          nextCursor?: string;
          results: Array<{
            coordinates: { latitude: number; longitude: number };
            key: string;
          }>;
        }
      >;
      nearestPoints: FunctionReference<
        "query",
        "internal",
        {
          levelMod: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          maxDistance?: number;
          maxLevel: number;
          maxResults: number;
          minLevel: number;
          nextCursor?: string;
          point: { latitude: number; longitude: number };
        },
        Array<{
          coordinates: { latitude: number; longitude: number };
          distance: number;
          key: string;
        }>
      >;
    };
  };
  actionCache: {
    crons: {
      purge: FunctionReference<
        "mutation",
        "internal",
        { expiresAt?: number },
        null
      >;
    };
    lib: {
      get: FunctionReference<
        "query",
        "internal",
        { args: any; name: string; ttl: number | null },
        { kind: "hit"; value: any } | { expiredEntry?: string; kind: "miss" }
      >;
      put: FunctionReference<
        "mutation",
        "internal",
        {
          args: any;
          expiredEntry?: string;
          name: string;
          ttl: number | null;
          value: any;
        },
        { cacheHit: boolean; deletedExpiredEntry: boolean }
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string },
        null
      >;
      removeAll: FunctionReference<
        "mutation",
        "internal",
        { batchSize?: number; before?: number; name?: string },
        null
      >;
    };
  };
};
