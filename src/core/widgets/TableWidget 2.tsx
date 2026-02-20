import { useEffect, useMemo, useState } from "react";

import { useDeleteHotspot } from "./useDeleteHotspot";
import { useTableState } from "./useTableState";
import type { TableScope } from "./tableStorage";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

const clampSize = (value: number) => Math.min(12, Math.max(1, value));

type TableWidgetProps = {
  moduleName: string;
  renderMode?: "grid" | "timeline";
};

type SizeControlProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
};

type CellCoord = { row: number; col: number };
type CellGroup = { id: number; cells: string[] };

const cellKey = ({ row, col }: CellCoord) => `${row}:${col}`;

const clampCoord = (coord: CellCoord, rows: number, cols: number): CellCoord => ({
  row: Math.max(0, Math.min(rows - 1, coord.row)),
  col: Math.max(0, Math.min(cols - 1, coord.col)),
});

const rectKeys = (a: CellCoord, b: CellCoord) => {
  const minRow = Math.min(a.row, b.row);
  const maxRow = Math.max(a.row, b.row);
  const minCol = Math.min(a.col, b.col);
  const maxCol = Math.max(a.col, b.col);
  const keys: string[] = [];
  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      keys.push(cellKey({ row, col }));
    }
  }
  return keys;
};

const SizeControl = ({ label, value, onChange }: SizeControlProps) => (
  <div className="table-widget__size-control">
    <div className="table-widget__size-label">{label}</div>
    <div className="table-widget__stepper" role="group" aria-label={`${label} controls`}>
      <button
        type="button"
        className="table-widget__size-btn"
        onClick={() => onChange(clampSize(value - 1))}
        aria-label={`Decrease ${label}`}
      >
        -
      </button>
      <span className="table-widget__size-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="table-widget__size-btn"
        onClick={() => onChange(clampSize(value + 1))}
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  </div>
);

export default function TableWidget({ moduleName, renderMode = "grid" }: TableWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();
  const hasLocal = state.tableLocal;
  const hasGlobal = state.tableGlobal;
  const [activeScope, setActiveScope] = useState<TableScope>(() => (hasLocal ? "local" : "global"));
  const [editingCell, setEditingCell] = useState<CellCoord | null>(null);
  const [anchor, setAnchor] = useState<CellCoord | null>(null);
  const [focus, setFocus] = useState<CellCoord | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [groups, setGroups] = useState<CellGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [nextGroupId, setNextGroupId] = useState(1);
  const scopeLabel = activeScope === "global" ? "MYND TRAC" : `${moduleName.toUpperCase()} TRAC`;

  const localTable = useTableState(moduleName, "local");
  const globalTable = useTableState(moduleName, "global");
  const currentTable = activeScope === "local" ? localTable : globalTable;

  const gridTemplateColumns = useMemo(
    () => `repeat(${currentTable.state.cols}, minmax(90px, 1fr))`,
    [currentTable.state.cols]
  );

  useEffect(() => {
    if (activeScope === "local" && !hasLocal && hasGlobal) setActiveScope("global");
    if (activeScope === "global" && !hasGlobal && hasLocal) setActiveScope("local");
  }, [activeScope, hasLocal, hasGlobal]);

  useEffect(() => {
    setEditingCell(null);
    setAnchor(null);
    setFocus(null);
    setSelection([]);
    setGroups([]);
    setActiveGroupId(null);
    setNextGroupId(1);
  }, [activeScope]);

  useEffect(() => {
    const rows = currentTable.state.rows;
    const cols = currentTable.state.cols;
    const inBounds = ({ row, col }: CellCoord) => row >= 0 && row < rows && col >= 0 && col < cols;

    setEditingCell((prev) => (prev && inBounds(prev) ? prev : null));
    setAnchor((prev) => (prev && inBounds(prev) ? prev : null));
    setFocus((prev) => (prev && inBounds(prev) ? prev : null));

    const valid = new Set<string>();
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) valid.add(cellKey({ row, col }));
    }
    setSelection((prev) => prev.filter((key) => valid.has(key)));
    setGroups((prev) =>
      prev
        .map((group) => ({ ...group, cells: group.cells.filter((key) => valid.has(key)) }))
        .filter((group) => group.cells.length > 1)
    );
  }, [currentTable.state.rows, currentTable.state.cols]);

  const groupForCell = useMemo(() => {
    const map = new Map<string, number>();
    for (const group of groups) {
      for (const key of group.cells) map.set(key, group.id);
    }
    return map;
  }, [groups]);

  const selectedSet = useMemo(() => new Set(selection), [selection]);

  if (!hasLocal && !hasGlobal) return null;

  return (
    <div className="table-widget widget-shell">
      <div className="table-widget__frame" {...deleteHotspot}>
        <div className="table-widget__header">
          <div className="table-widget__header-left">
            <button
              type="button"
              className="table-widget__remove fluid-delete"
              onClick={() =>
                updateWidget(activeScope === "local" ? "tableLocal" : "tableGlobal", false)
              }
              aria-label={`Remove ${scopeLabel}`}
            >
              x
            </button>
            <div>
              <div className="table-widget__title">Trac</div>
              <div className="table-widget__subtitle">{scopeLabel}</div>
            </div>
          </div>
          <div className="table-widget__tabs">
            {hasLocal && (
              <button
                type="button"
                className={`table-widget__tab ${activeScope === "local" ? "is-active" : ""}`}
                onClick={() => setActiveScope("local")}
              >
                Local
              </button>
            )}
            {hasGlobal && (
              <button
                type="button"
                className={`table-widget__tab ${activeScope === "global" ? "is-active" : ""}`}
                onClick={() => setActiveScope("global")}
              >
                Global
              </button>
            )}
          </div>
        </div>
        <div className="table-widget__body">
          {renderMode === "grid" ? (
            <div
              className="table-widget__grid"
              style={{ gridTemplateColumns }}
              onKeyDown={(event) => {
                const current = focus ?? editingCell;
                if (!current) return;

                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "g") {
                  event.preventDefault();
                  if (selection.length > 1) {
                    const selected = new Set(selection);
                    setGroups((prev) => {
                      const pruned = prev
                        .map((group) => ({
                          ...group,
                          cells: group.cells.filter((key) => !selected.has(key)),
                        }))
                        .filter((group) => group.cells.length > 1);
                      return [...pruned, { id: nextGroupId, cells: [...selection] }];
                    });
                    setActiveGroupId(nextGroupId);
                    setNextGroupId((prev) => prev + 1);
                  }
                  return;
                }

                if (
                  event.shiftKey &&
                  ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
                ) {
                  event.preventDefault();
                  const base = anchor ?? current;
                  const next = clampCoord(
                    {
                      row: current.row + (event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0),
                      col:
                        current.col + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0),
                    },
                    currentTable.state.rows,
                    currentTable.state.cols
                  );
                  setAnchor(base);
                  setFocus(next);
                  setSelection(rectKeys(base, next));
                  setEditingCell(next);

                  const selector = `[data-row="${next.row}"][data-col="${next.col}"]`;
                  const nextInput = event.currentTarget.querySelector<HTMLInputElement>(selector);
                  nextInput?.focus();
                  nextInput?.select();
                }
              }}
            >
              {Array.from({ length: currentTable.state.rows }).map((_, rowIndex) =>
                Array.from({ length: currentTable.state.cols }).map((__, colIndex) => {
                  const index = rowIndex * currentTable.state.cols + colIndex;
                  const coord = { row: rowIndex, col: colIndex };
                  const key = cellKey(coord);
                  const groupId = groupForCell.get(key) ?? null;
                  const isSelected = selectedSet.has(key);
                  const isGroupHighlighted = activeGroupId !== null && groupId === activeGroupId;

                  return (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      className={`table-widget__cell ${isSelected ? "is-selected" : ""} ${isGroupHighlighted ? "is-group-highlighted" : ""}`}
                      value={currentTable.state.cells[index] ?? ""}
                      data-row={rowIndex}
                      data-col={colIndex}
                      readOnly={
                        !editingCell || editingCell.row !== rowIndex || editingCell.col !== colIndex
                      }
                      onChange={(event) =>
                        currentTable.updateCell(rowIndex, colIndex, event.target.value)
                      }
                      onClick={(event) => {
                        const nextAnchor = event.shiftKey ? anchor ?? coord : coord;
                        const nextSelection = event.shiftKey ? rectKeys(nextAnchor, coord) : [key];
                        setAnchor(nextAnchor);
                        setFocus(coord);
                        setSelection(nextSelection);
                        setEditingCell(coord);
                        setActiveGroupId(groupForCell.get(key) ?? null);
                        event.currentTarget.focus();
                        event.currentTarget.select();
                      }}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === "Escape") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  );
                })
              )}
            </div>
          ) : (
            <div className="table-widget__timeline">
              {Array.from({ length: currentTable.state.rows }).map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="table-widget__timeline-row">
                  {Array.from({ length: currentTable.state.cols }).map((__, colIndex) => {
                    const cellIndex = rowIndex * currentTable.state.cols + colIndex;
                    const isEditing =
                      editingCell?.row === rowIndex && editingCell?.col === colIndex;
                    const value = currentTable.state.cells[cellIndex] ?? "";
                    return isEditing ? (
                      <input
                        key={`${rowIndex}-${colIndex}`}
                        className="table-widget__cell table-widget__timeline-input"
                        value={value}
                        autoFocus
                        onChange={(event) =>
                          currentTable.updateCell(rowIndex, colIndex, event.target.value)
                        }
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === "Escape") {
                            event.currentTarget.blur();
                          }
                        }}
                      />
                    ) : (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        className="table-widget__timeline-cell"
                        onClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                        aria-label={`Row ${rowIndex + 1} column ${colIndex + 1}`}
                      >
                        {value || "—"}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          <div className="table-widget__controls">
            <SizeControl
              label="Rows"
              value={currentTable.state.rows}
              onChange={(next) => currentTable.updateSize(next, currentTable.state.cols)}
            />
            <SizeControl
              label="Cols"
              value={currentTable.state.cols}
              onChange={(next) => currentTable.updateSize(currentTable.state.rows, next)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
