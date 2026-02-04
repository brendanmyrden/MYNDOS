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

    let isOverCube = false;
    let isOverPanel = false;
    let closeTimer: number | null = null;

    const setOpen = (open: boolean) => {
      stack.dataset.panelProximity = open ? "true" : "false";
    };

    const clearCloseTimer = () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const scheduleClose = () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => {
        if (!isOverCube && !isOverPanel) {
          setOpen(false);
        }
      }, 80);
    };

    const handleCubeEnter = () => {
      isOverCube = true;
      clearCloseTimer();
      setOpen(true);
    };

    const handleCubeLeave = () => {
      isOverCube = false;
      scheduleClose();
    };

    const handlePanelEnter = () => {
      isOverPanel = true;
      clearCloseTimer();
      setOpen(true);
    };

    const handlePanelLeave = () => {
      isOverPanel = false;
      scheduleClose();
    };

    plusCube.addEventListener("pointerenter", handleCubeEnter);
    plusCube.addEventListener("pointerleave", handleCubeLeave);
    panel.addEventListener("pointerenter", handlePanelEnter);
    panel.addEventListener("pointerleave", handlePanelLeave);
    return () => {
      plusCube.removeEventListener("pointerenter", handleCubeEnter);
      plusCube.removeEventListener("pointerleave", handleCubeLeave);
      panel.removeEventListener("pointerenter", handlePanelEnter);
      panel.removeEventListener("pointerleave", handlePanelLeave);
      clearCloseTimer();
      delete stack.dataset.panelProximity;
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
