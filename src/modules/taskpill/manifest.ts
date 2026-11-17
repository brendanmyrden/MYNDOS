import { lazy } from "react";
import type { ModuleManifest } from "../types";

const TaskPillHome = lazy(() => import("./index"));

export const taskpillModule: ModuleManifest = {
  id: "taskpill",
  name: "TRAC",
  description: "Editable tables and tracking workspace.",
  component: TaskPillHome,
  navigation: {
    path: "/taskpill",
    icon: "💊",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
