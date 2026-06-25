import { lazy } from "react";
import type { ModuleManifest } from "../types";

const StreamsHome = lazy(() => import("./index"));
const TradeCorePage = lazy(() => import("./TradeCore"));
const TradeInterfaceRoot = lazy(() => import("./TradeInterfaceRoot"));

export const streamsModule: ModuleManifest = {
  id: "streams",
  name: "$.0.$. - $treams 0f $trategy",
  description: "Strategy streams, trade core, and trade interface workspace.",
  component: StreamsHome,
  navigation: {
    path: "/streams",
    icon: "🛰️",
  },
  routes: [
    {
      path: "/streams-of-strategy",
      redirectTo: "/streams",
      label: "Legacy Streams Redirect",
    },
    {
      path: "/streams/trade-core",
      component: TradeCorePage,
      label: "Trade Core",
    },
    {
      path: "/streams/trade-interface",
      component: TradeInterfaceRoot,
      label: "Trade Interface",
    },
  ],
  permissions: [],
  requirements: [],
  enabledByDefault: true,
};
