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
          onClick={() => navigate("/streams/trade-core")}
          aria-label="Open Trade Core"
        >
          <span className="trade-core-widget__label">TRADE CORE</span>
        </button>
      </div>
    </div>
  );
}
