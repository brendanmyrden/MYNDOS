import { lazy } from "react";
import type { ModuleManifest } from "../types";

const RAPHiDashboard = lazy(() => import("./index"));

export const raphiModule: ModuleManifest = {
  id: "raphi",
  name: "R-A-P-H [ i ]",
  description: "Health intelligence dashboard and intake tracking.",
  component: RAPHiDashboard,
  navigation: {
    path: "/raphi",
    icon: "🧬",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
  defaultRoute: true,
};
