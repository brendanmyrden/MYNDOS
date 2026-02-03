import type { PropsWithChildren } from "react";
import { useWidgetState } from "./useWidgetState";
import { useDeleteHotspot } from "./useDeleteHotspot";
import "./widgets.css";

interface DashboardWidgetProps {
  moduleName: string;
}

export default function DashboardWidget({ moduleName, children }: PropsWithChildren<DashboardWidgetProps>) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();

  if (!state.dashboard) return null;

  return (
    <div className="widget-shell" {...deleteHotspot}>
      <span className="widget-hotspot" aria-hidden="true" />
      <button
        type="button"
        className="widget-remove fluid-delete"
        onClick={() => updateWidget("dashboard", false)}
        aria-label="Remove dashboard"
      >
        x
      </button>
      {children}
    </div>
  );
}
