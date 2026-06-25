import { lazy } from "react";
import type { ModuleManifest } from "../types";

const TaskPillHome = lazy(() => import("./index"));

export const taskpillModule: ModuleManifest = {
  id: "taskpill",
  name: "Task Pill",
  description: "Task-pill tracking and linked action grouping.",
  component: TaskPillHome,
  navigation: {
    path: "/taskpill",
    icon: "💊",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
