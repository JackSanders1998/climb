// convex/convex.config.ts
import cache from "@convex-dev/action-cache/convex.config";
import geospatial from "@convex-dev/geospatial/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(geospatial);
app.use(cache);

export default app;
