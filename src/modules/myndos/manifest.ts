import { lazy } from "react";
import type { ModuleManifest } from "../types";

const MYNDOS = lazy(() => import("./index"));

export const myndosModule: ModuleManifest = {
  id: "myndos",
  name: "MYND OS",
  description: "Core knowledge, task, and connection workspace.",
  component: MYNDOS,
  navigation: {
    path: "/myndos",
    icon: "🧠",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
