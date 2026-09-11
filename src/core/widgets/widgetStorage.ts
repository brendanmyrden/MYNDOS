export type WidgetState = {
  dashboard: boolean;
  matrixTimer: boolean;
  mediaBoard: boolean;
  tableLocal: boolean;
  tableGlobal: boolean;
  tradeCore: boolean;
  lyrics: boolean;
};

type StoredWidgetState = Partial<WidgetState> & {
  mediaModal?: boolean;
};

const DEFAULT_WIDGET_STATE: WidgetState = {
  dashboard: true,
  matrixTimer: false,
  mediaBoard: false,
  tableLocal: false,
  tableGlobal: false,
  tradeCore: false,
  lyrics: false,
};

const widgetKey = (moduleName: string) => `myndos.widgets.${moduleName}.v1`;

export const getWidgetState = (moduleName: string): WidgetState => {
  try {
    const stored = localStorage.getItem(widgetKey(moduleName));
    if (!stored) return DEFAULT_WIDGET_STATE;
    const parsed = JSON.parse(stored) as StoredWidgetState;
    return {
      dashboard: typeof parsed.dashboard === "boolean" ? parsed.dashboard : DEFAULT_WIDGET_STATE.dashboard,
      matrixTimer: typeof parsed.matrixTimer === "boolean" ? parsed.matrixTimer : DEFAULT_WIDGET_STATE.matrixTimer,
      mediaBoard:
        typeof parsed.mediaBoard === "boolean"
          ? parsed.mediaBoard
          : typeof parsed.mediaModal === "boolean"
            ? parsed.mediaModal
            : DEFAULT_WIDGET_STATE.mediaBoard,
      tableLocal: typeof parsed.tableLocal === "boolean" ? parsed.tableLocal : DEFAULT_WIDGET_STATE.tableLocal,
      tableGlobal: typeof parsed.tableGlobal === "boolean" ? parsed.tableGlobal : DEFAULT_WIDGET_STATE.tableGlobal,
      tradeCore: typeof parsed.tradeCore === "boolean" ? parsed.tradeCore : DEFAULT_WIDGET_STATE.tradeCore,
      lyrics: typeof parsed.lyrics === "boolean" ? parsed.lyrics : DEFAULT_WIDGET_STATE.lyrics,
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
