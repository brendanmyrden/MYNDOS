import { lazy } from "react";
import type { ModuleManifest } from "../types";

const SYYRHome = lazy(() => import("./index"));

export const syyrModule: ModuleManifest = {
  id: "syyr",
  name: "SYYR",
  description: "Sequence, step, rule, and output workspace.",
  component: SYYRHome,
  navigation: {
    path: "/syyr",
    icon: "🔮",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
