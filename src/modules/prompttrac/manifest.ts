import { lazy } from "react";
import type { ModuleManifest } from "../types";

const PROMPTRACHome = lazy(() => import("./index"));

export const prompttracModule: ModuleManifest = {
  id: "prompttrac",
  name: "PROMPTRAC",
  description: "Prompt tracking and prompt history workspace.",
  component: PROMPTRACHome,
  navigation: {
    path: "/prompttrac",
    icon: "✍️",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: false,
};
