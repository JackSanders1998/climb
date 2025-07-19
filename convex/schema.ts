import { defineSchema } from "convex/server";
import { images } from "./modules/images/models";
import { locations } from "./modules/locations/models";
import { settings } from "./modules/settings/settings.models";
import { users } from "./modules/users/users.models";

export default defineSchema({
  users,
  locations,
  images,
  settings,
});
