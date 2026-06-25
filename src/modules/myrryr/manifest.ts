import { lazy } from "react";
import type { ModuleManifest } from "../types";

const MYRRYRHome = lazy(() => import("./index"));

export const myrryrModule: ModuleManifest = {
  id: "myrryr",
  name: "MYRRYR",
  description: "Campaign and creative reflection workspace.",
  component: MYRRYRHome,
  navigation: {
    path: "/myrryr",
    icon: "🪞",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
