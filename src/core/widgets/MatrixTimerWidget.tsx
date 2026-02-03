import { useEffect, useState } from "react";

import { formatMatrixTime, useMatrixTimerColor } from "./matrixTimer";
import { useDeleteHotspot } from "./useDeleteHotspot";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

type MatrixTimerWidgetProps = {
  moduleName: string;
};

export default function MatrixTimerWidget({ moduleName }: MatrixTimerWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const { color, setColor } = useMatrixTimerColor(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const tick = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(tick);
  }, [isRunning]);

  if (!state.matrixTimer) return null;

  return (
    <div className="matrix-timer-widget widget-shell" {...deleteHotspot}>
      <span className="widget-hotspot" aria-hidden="true" />
      <div className="matrix-timer-widget__frame" style={{ ["--matrix-color" as string]: color }}>
        <div className="matrix-timer-widget__header">
          <div className="matrix-timer-widget__header-left">
            <button
              type="button"
              className="widget-remove fluid-delete"
              onClick={() => updateWidget("matrixTimer", false)}
              aria-label="Remove matrix timer"
            >
              x
            </button>
            <div>
              <div className="matrix-timer-widget__title">Matrix Timer</div>
              <div className="matrix-timer-widget__subtitle">
                {isRunning ? "Running" : "Paused"}
              </div>
            </div>
          </div>
          <div className="matrix-timer-widget__actions">
            <button
              type="button"
              className="module-btn module-btn-ghost module-btn-sm"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              className="module-btn module-btn-ghost module-btn-sm"
              onClick={() => setElapsedSeconds(0)}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="matrix-timer matrix-timer--large" style={{ ["--matrix-color" as string]: color }}>
          <div className="matrix-timer__digits">{formatMatrixTime(elapsedSeconds)}</div>
        </div>
        <div className="matrix-timer-widget__footer">
          <div className="matrix-timer-widget__label">Color</div>
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
    </div>
  );
}
