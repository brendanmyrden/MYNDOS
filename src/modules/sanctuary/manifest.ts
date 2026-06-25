import { lazy } from "react";
import type { ModuleManifest } from "../types";

const SanctuaryHome = lazy(() => import("./index"));

export const sanctuaryModule: ModuleManifest = {
  id: "sanctuary",
  name: "Sanctuary",
  description: "Environment, mood, and regulation workspace.",
  component: SanctuaryHome,
  navigation: {
    path: "/sanctuary",
    icon: "🕊️",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
