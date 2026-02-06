import { useEffect, useRef } from "react";
import MatrixTimerOption from "./MatrixTimerOption";
import MediaModalOption from "./MediaModalOption";
import TableWidgetOption from "./TableWidgetOption";
import TradeCoreOption from "./TradeCoreOption";

type ModuleHoverPanelProps = {
  moduleName: string;
};

export default function ModuleHoverPanel({ moduleName }: ModuleHoverPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const stack = panel.closest(".raphi-header-stack, .module-header-stack") as HTMLElement | null;
    if (!stack) return;
    const plusCube = stack.querySelector("[data-plus-cube]") as HTMLElement | null;
    if (!plusCube) return;

    const handleEnter = () => {
      stack.dataset.panelProximity = "true";
    };

    const handleLeave = () => {
      stack.dataset.panelProximity = "false";
    };

    const handleClick = () => {
      const shouldPin = stack.dataset.panelPinned !== "true";
      if (shouldPin) {
        stack.dataset.panelPinned = "true";
        stack.dataset.panelProximity = "true";
      } else {
        delete stack.dataset.panelPinned;
      }
    };

    plusCube.addEventListener("pointerenter", handleEnter);
    plusCube.addEventListener("pointerleave", handleLeave);
    plusCube.addEventListener("click", handleClick);
    return () => {
      plusCube.removeEventListener("pointerenter", handleEnter);
      plusCube.removeEventListener("pointerleave", handleLeave);
      plusCube.removeEventListener("click", handleClick);
      delete stack.dataset.panelProximity;
      delete stack.dataset.panelPinned;
    };
  }, []);

  return (
    <div className="module-hover-panel__inner" ref={panelRef}>
      <div className="module-hover-panel__header">
        <div className="module-hover-panel__title">Widget Options</div>
        <div className="module-hover-panel__subtitle">Add widgets before they appear in your module</div>
      </div>
      <div className="module-hover-panel__widgets">
        <MatrixTimerOption moduleName={moduleName} />
        <MediaModalOption moduleName={moduleName} />
        {moduleName === "streams" ? <TradeCoreOption moduleName={moduleName} /> : null}
        <TableWidgetOption moduleName={moduleName} />
      </div>
    </div>
  );
}
