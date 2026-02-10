import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteHotspot } from "./useDeleteHotspot";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

type TradeCoreWidgetProps = {
  moduleName: string;
};

export default function TradeCoreWidget({ moduleName }: TradeCoreWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();
  const navigate = useNavigate();

  if (!state.tradeCore) return null;

  const handleOpenTradeInterface = (event: MouseEvent<HTMLButtonElement>) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      navigate("/streams/trade-interface");
      return;
    }

    if (document.body.classList.contains("trade-interface-transitioning")) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if (!rect.width || !rect.height || !viewportWidth || !viewportHeight) {
      navigate("/streams/trade-interface");
      return;
    }

    const transitionDurationMs = 620;
    const navigationDelayMs = 220;

    const overlay = document.createElement("div");
    overlay.className = "trade-interface-transition";
    overlay.style.setProperty("--trade-interface-x", `${rect.left}px`);
    overlay.style.setProperty("--trade-interface-y", `${rect.top}px`);
    overlay.style.setProperty("--trade-interface-scale-x", `${rect.width / viewportWidth}`);
    overlay.style.setProperty("--trade-interface-scale-y", `${rect.height / viewportHeight}`);
    overlay.style.setProperty("--trade-interface-transition-duration", `${transitionDurationMs}ms`);

    const computed = window.getComputedStyle(target);
    const accent = computed.getPropertyValue("--raphi-accent").trim();
    if (accent) overlay.style.setProperty("--raphi-accent", accent);

    const label = document.createElement("span");
    label.className = "trade-interface-transition__label";
    label.textContent = "TRADE CORE";
    overlay.appendChild(label);

    document.body.classList.add("trade-interface-transitioning");
    document.body.appendChild(overlay);

    overlay.getBoundingClientRect();
    requestAnimationFrame(() => {
      overlay.classList.add("is-active");
    });

    window.setTimeout(() => {
      navigate("/streams/trade-interface");
    }, navigationDelayMs);

    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("trade-interface-transitioning");
    }, transitionDurationMs + 140);
  };

  return (
    <div className="trade-core-widget widget-shell" {...deleteHotspot}>
      <div className="trade-core-widget__frame">
        <div className="trade-core-widget__header">
          <div className="trade-core-widget__header-left">
            <button
              type="button"
              className="widget-remove fluid-delete"
              onClick={() => updateWidget("tradeCore", false)}
              aria-label="Remove trade core"
            >
              x
            </button>
            <div>
              <div className="trade-core-widget__title">Trade Core</div>
              <div className="trade-core-widget__subtitle">Full-page trade interface gateway</div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="trade-core-widget__cube"
          onClick={handleOpenTradeInterface}
          aria-label="Open Trade Interface"
        >
          <span className="trade-core-widget__label">TRADE CORE</span>
        </button>
      </div>
    </div>
  );
}
