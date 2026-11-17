import { lazy } from "react";
import type { ModuleManifest } from "../types";

const LuminoiseHome = lazy(() => import("./index"));

export const luminoiseModule: ModuleManifest = {
  id: "luminoise",
  name: "LUMINOISE",
  description: "LUMINOISE workspace.",
  component: LuminoiseHome,
  navigation: { path: "/luminoise", icon: "💠" },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
