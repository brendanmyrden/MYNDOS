import type { PropsWithChildren } from "react";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

interface DashboardWidgetProps {
  moduleName: string;
}

export default function DashboardWidget({ moduleName, children }: PropsWithChildren<DashboardWidgetProps>) {
  const { state, updateWidget } = useWidgetState(moduleName);

  if (!state.dashboard) return null;

  return (
    <div className="widget-shell">
      <span className="widget-hotspot" aria-hidden="true" />
      <button
        type="button"
        className="widget-remove"
        onClick={() => updateWidget("dashboard", false)}
        aria-label="Remove dashboard"
      >
        x
      </button>
      {children}
    </div>
  );
}
