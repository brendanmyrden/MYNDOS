import { lazy } from "react";
import type { ModuleManifest } from "../types";

const SettingsPage = lazy(() => import("./index"));

export const settingsModule: ModuleManifest = {
  id: "settings",
  name: "Settings",
  description: "Application preferences and theme configuration.",
  component: SettingsPage,
  navigation: {
    path: "/settings",
    icon: "⚙️",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
