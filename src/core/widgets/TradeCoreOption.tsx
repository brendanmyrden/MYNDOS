import { useWidgetState } from "./useWidgetState";

type TradeCoreOptionProps = {
  moduleName: string;
};

export default function TradeCoreOption({ moduleName }: TradeCoreOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const isAdded = state.tradeCore;

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Trade Core</div>
          <div className="module-widget-card__subtitle">Dark matte cube with glow edges</div>
        </div>
        {isAdded ? (
          <div className="module-widget-card__added">Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("tradeCore", true)}
          >
            Add
          </button>
        )}
      </div>
      <div className="module-widget-card__preview trade-core-option__preview">
        <div className="trade-core-option__cube">
          <div className="trade-core-option__label">TRADE CORE</div>
        </div>
      </div>
    </div>
  );
}
