export type WidgetState = {
  dashboard: boolean;
  matrixTimer: boolean;
  mediaModal: boolean;
  tableLocal: boolean;
  tableGlobal: boolean;
  tradeCore: boolean;
};

const DEFAULT_WIDGET_STATE: WidgetState = {
  dashboard: true,
  matrixTimer: false,
  mediaModal: false,
  tableLocal: false,
  tableGlobal: false,
  tradeCore: false,
};

const widgetKey = (moduleName: string) => `myndos.widgets.${moduleName}.v1`;

export const getWidgetState = (moduleName: string): WidgetState => {
  try {
    const stored = localStorage.getItem(widgetKey(moduleName));
    if (!stored) return DEFAULT_WIDGET_STATE;
    const parsed = JSON.parse(stored) as Partial<WidgetState>;
    return {
      dashboard: typeof parsed.dashboard === "boolean" ? parsed.dashboard : DEFAULT_WIDGET_STATE.dashboard,
      matrixTimer: typeof parsed.matrixTimer === "boolean" ? parsed.matrixTimer : DEFAULT_WIDGET_STATE.matrixTimer,
      mediaModal: typeof parsed.mediaModal === "boolean" ? parsed.mediaModal : DEFAULT_WIDGET_STATE.mediaModal,
      tableLocal: typeof parsed.tableLocal === "boolean" ? parsed.tableLocal : DEFAULT_WIDGET_STATE.tableLocal,
      tableGlobal: typeof parsed.tableGlobal === "boolean" ? parsed.tableGlobal : DEFAULT_WIDGET_STATE.tableGlobal,
      tradeCore: typeof parsed.tradeCore === "boolean" ? parsed.tradeCore : DEFAULT_WIDGET_STATE.tradeCore,
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
