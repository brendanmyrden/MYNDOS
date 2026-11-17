import { lazy } from "react";
import type { ModuleManifest } from "../types";

const OtakumaxxerHome = lazy(() => import("./index"));

export const otakumaxxerModule: ModuleManifest = {
  id: "otakumaxxer",
  name: "OTAKUMAXXER",
  description: "OTAKUMAXXER workspace.",
  component: OtakumaxxerHome,
  navigation: {
    path: "/otakumaxxer",
    icon: "🎮",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
