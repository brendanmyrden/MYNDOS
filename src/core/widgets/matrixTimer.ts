import { useEffect, useMemo, useState } from "react";

export const MATRIX_TIMER_DEFAULT_COLOR = "#33ff77";

export const formatMatrixTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const useMatrixTimerColor = (moduleName: string) => {
  const colorKey = useMemo(() => `myndos.widgets.${moduleName}.matrixTimer.color`, [moduleName]);
  const [color, setColor] = useState(() => {
    if (typeof window === "undefined") return MATRIX_TIMER_DEFAULT_COLOR;
    try {
      return localStorage.getItem(colorKey) ?? MATRIX_TIMER_DEFAULT_COLOR;
    } catch {
      return MATRIX_TIMER_DEFAULT_COLOR;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(colorKey, color);
    } catch {
      // ignore storage failures
    }
  }, [color, colorKey]);

  return { color, setColor };
};
