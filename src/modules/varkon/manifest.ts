import { lazy } from "react";
import type { ModuleManifest } from "../types";

const VarkonHome = lazy(() => import("./index"));

export const varkonModule: ModuleManifest = {
  id: "varkon",
  name: "VARKON",
  description: "VARKON workspace.",
  component: VarkonHome,
  navigation: { path: "/varkon", icon: "⚡" },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
