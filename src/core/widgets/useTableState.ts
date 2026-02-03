import { useCallback, useEffect, useState } from "react";

import { getTableState, resizeTableState, setTableState, type TableScope, type TableState } from "./tableStorage";

export const useTableState = (moduleName: string, scope: TableScope) => {
  const [state, setState] = useState<TableState>(() => getTableState(moduleName, scope));

  useEffect(() => {
    setState(getTableState(moduleName, scope));
  }, [moduleName, scope]);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent).detail as { moduleName: string; scope: TableScope };
      if (!detail) return;
      if (detail.scope === scope) {
        if (scope === "global" || detail.moduleName === moduleName) {
          setState(getTableState(moduleName, scope));
        }
      }
    };
    window.addEventListener("table-state-change", handleChange);
    return () => window.removeEventListener("table-state-change", handleChange);
  }, [moduleName, scope]);

  const updateState = useCallback(
    (next: TableState) => {
      setState(next);
      setTableState(moduleName, scope, next);
    },
    [moduleName, scope]
  );

  const updateSize = useCallback(
    (rows: number, cols: number) => {
      updateState(resizeTableState(state, rows, cols));
    },
    [state, updateState]
  );

  const updateCell = useCallback(
    (row: number, col: number, value: string) => {
      const index = row * state.cols + col;
      const nextCells = state.cells.slice();
      nextCells[index] = value;
      updateState({ ...state, cells: nextCells });
    },
    [state, updateState]
  );

  return { state, updateSize, updateCell };
};
