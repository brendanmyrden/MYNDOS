export type WidgetState = {
  dashboard: boolean;
};

const DEFAULT_WIDGET_STATE: WidgetState = {
  dashboard: true,
};

const widgetKey = (moduleName: string) => `myndos.widgets.${moduleName}.v1`;

export const getWidgetState = (moduleName: string): WidgetState => {
  try {
    const stored = localStorage.getItem(widgetKey(moduleName));
    if (!stored) return DEFAULT_WIDGET_STATE;
    const parsed = JSON.parse(stored) as Partial<WidgetState>;
    return {
      dashboard: typeof parsed.dashboard === "boolean" ? parsed.dashboard : DEFAULT_WIDGET_STATE.dashboard,
    };
  } catch {
    return DEFAULT_WIDGET_STATE;
  }
};

export const setWidgetState = (moduleName: string, next: WidgetState) => {
  try {
    localStorage.setItem(widgetKey(moduleName), JSON.stringify(next));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("widget-state-change", { detail: { moduleName } }));
};
