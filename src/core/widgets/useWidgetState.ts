import { useEffect, useState } from "react";
import type { WidgetState } from "./widgetStorage";
import { getWidgetState, setWidgetState } from "./widgetStorage";

export const useWidgetState = (moduleName: string) => {
  const [state, setState] = useState<WidgetState>(() => getWidgetState(moduleName));

  useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent).detail as { moduleName?: string } | undefined;
      if (!detail?.moduleName || detail.moduleName === moduleName) {
        setState(getWidgetState(moduleName));
      }
    };
    window.addEventListener("widget-state-change", handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("widget-state-change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [moduleName]);

  const updateWidget = (key: keyof WidgetState, value: boolean) => {
    const next = { ...state, [key]: value } as WidgetState;
    setState(next);
    setWidgetState(moduleName, next);
  };

  return { state, updateWidget };
};
