import { lazy } from "react";
import type { ModuleManifest } from "../types";

const NumbersStarsSignsHome = lazy(() => import("./index"));

export const numbersStarsSignsModule: ModuleManifest = {
  id: "numbers-stars-signs",
  name: "Numbers / Stars / Signs",
  description: "Numerology, astrology, and sign-pattern workspace.",
  component: NumbersStarsSignsHome,
  navigation: {
    path: "/numbers-stars-signs",
    icon: "🔢",
  },
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
