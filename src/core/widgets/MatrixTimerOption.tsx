import { useEffect, useState } from "react";

import { useWidgetState } from "./useWidgetState";
import { formatMatrixTime, useMatrixTimerColor } from "./matrixTimer";

type MatrixTimerOptionProps = {
  moduleName: string;
};

export default function MatrixTimerOption({ moduleName }: MatrixTimerOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { color, setColor } = useMatrixTimerColor(moduleName);
  useEffect(() => {
    const tick = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  const isAdded = state.matrixTimer;

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Matrix Timer</div>
          <div className="module-widget-card__subtitle">Matrix-style digits with glow</div>
        </div>
        {isAdded ? (
          <div className="module-widget-card__added">Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("matrixTimer", true)}
          >
            Add
          </button>
        )}
      </div>
      <div className="module-widget-card__preview matrix-timer" style={{ ["--matrix-color" as string]: color }}>
        <div className="matrix-timer__digits">{formatMatrixTime(elapsedSeconds)}</div>
      </div>
      <div className="module-widget-card__controls">
        <div className="module-widget-card__label">Color</div>
        <label className="module-widget-card__color">
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            aria-label="Matrix timer color"
          />
          <span className="module-widget-card__color-value">{color.toUpperCase()}</span>
        </label>
      </div>
    </div>
  );
}
