import { lazy } from "react";
import type { ModuleManifest } from "../types";

const TorbinHome = lazy(() => import("./index"));

export const torbinModule: ModuleManifest = {
  id: "torbin",
  name: "TORBIN",
  description: "TORBIN workspace.",
  component: TorbinHome,
  navigation: { path: "/torbin", icon: "🌳" },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
