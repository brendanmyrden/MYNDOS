import { useEffect, useRef } from "react";
import MatrixTimerOption from "./MatrixTimerOption";
import MediaModalOption from "./MediaModalOption";
import TableWidgetOption from "./TableWidgetOption";
import TradeCoreOption from "./TradeCoreOption";
import LyricsOption from "./LyricsOption";
import PlusCubeAccentSwatch from "./PlusCubeAccentSwatch";

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

    const handleClick = () => {
      const shouldPin = stack.dataset.panelPinned !== "true";
      if (shouldPin) {
        stack.dataset.panelPinned = "true";
        stack.dataset.panelProximity = "true";
      } else {
        stack.dataset.panelProximity = "false";
        delete stack.dataset.panelPinned;
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (plusCube.contains(target) || panel.contains(target)) return;
      stack.dataset.panelProximity = "false";
      delete stack.dataset.panelPinned;
    };

    plusCube.addEventListener("click", handleClick);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      plusCube.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleOutsideClick);
      delete stack.dataset.panelProximity;
      delete stack.dataset.panelPinned;
    };
  }, []);

  return (
    <div className="module-hover-panel__inner" ref={panelRef}>
      <div className="module-hover-panel__header">
        <div>
          <div className="module-hover-panel__title">Widget Options</div>
          <div className="module-hover-panel__subtitle">Add widgets before they appear in your module</div>
        </div>
        <PlusCubeAccentSwatch moduleName={moduleName} />
      </div>
      <div className="module-hover-panel__widgets">
        <MatrixTimerOption moduleName={moduleName} />
        <MediaModalOption moduleName={moduleName} />
        {moduleName === "streams" ? <TradeCoreOption moduleName={moduleName} /> : null}
        {moduleName === "myrryr" ? <LyricsOption moduleName={moduleName} /> : null}
        <TableWidgetOption moduleName={moduleName} />
      </div>
    </div>
  );
}
