export type TableScope = "local" | "global";

export type TableState = {
  rows: number;
  cols: number;
  cells: string[];
};

const DEFAULT_TABLE_STATE: TableState = {
  rows: 3,
  cols: 3,
  cells: Array.from({ length: 9 }, () => ""),
};

const tableKey = (moduleName: string, scope: TableScope) => {
  if (scope === "global") return "myndos.table.global.v1";
  return `myndos.table.${moduleName}.v1`;
};

export const getTableState = (moduleName: string, scope: TableScope): TableState => {
  try {
    const stored = localStorage.getItem(tableKey(moduleName, scope));
    if (!stored) return DEFAULT_TABLE_STATE;
    const parsed = JSON.parse(stored) as Partial<TableState>;
    const rows = typeof parsed.rows === "number" && parsed.rows > 0 ? parsed.rows : DEFAULT_TABLE_STATE.rows;
    const cols = typeof parsed.cols === "number" && parsed.cols > 0 ? parsed.cols : DEFAULT_TABLE_STATE.cols;
    const cellCount = rows * cols;
    const storedCells = Array.isArray(parsed.cells) ? parsed.cells.map(String) : [];
    const cells = Array.from({ length: cellCount }, (_, index) => storedCells[index] ?? "");
    return { rows, cols, cells };
  } catch {
    return DEFAULT_TABLE_STATE;
  }
};

export const setTableState = (moduleName: string, scope: TableScope, next: TableState) => {
  try {
    localStorage.setItem(tableKey(moduleName, scope), JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(new CustomEvent("table-state-change", { detail: { moduleName, scope } }));
};

export const resizeTableState = (state: TableState, rows: number, cols: number): TableState => {
  const nextRows = Math.max(1, Math.floor(rows));
  const nextCols = Math.max(1, Math.floor(cols));
  const nextCells = Array.from({ length: nextRows * nextCols }, () => "");
  const minRows = Math.min(state.rows, nextRows);
  const minCols = Math.min(state.cols, nextCols);
  for (let r = 0; r < minRows; r += 1) {
    for (let c = 0; c < minCols; c += 1) {
      const prevIndex = r * state.cols + c;
      const nextIndex = r * nextCols + c;
      nextCells[nextIndex] = state.cells[prevIndex] ?? "";
    }
  }
  return {
    rows: nextRows,
    cols: nextCols,
    cells: nextCells,
  };
};
