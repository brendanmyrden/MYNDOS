import { useEffect, useMemo, useState } from "react";

import { useWidgetState } from "./useWidgetState";
import { useTableState } from "./useTableState";
import { useDeleteHotspot } from "./useDeleteHotspot";
import type { TableScope } from "./tableStorage";
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
        −
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
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const scopeLabel = activeScope === "global" ? "MYND TRAC" : `${moduleName.toUpperCase()} TRAC`;

  useEffect(() => {
    if (activeScope === "local" && !hasLocal && hasGlobal) setActiveScope("global");
    if (activeScope === "global" && !hasGlobal && hasLocal) setActiveScope("local");
  }, [activeScope, hasLocal, hasGlobal]);

  useEffect(() => {
    setEditingCell(null);
  }, [activeScope]);

  const localTable = useTableState(moduleName, "local");
  const globalTable = useTableState(moduleName, "global");
  const currentTable = activeScope === "local" ? localTable : globalTable;

  const gridTemplateColumns = useMemo(
    () => `repeat(${currentTable.state.cols}, minmax(90px, 1fr))`,
    [currentTable.state.cols]
  );

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
            <div className="table-widget__title-block">
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
            <div className="table-widget__grid" style={{ gridTemplateColumns }}>
              {Array.from({ length: currentTable.state.rows }).map((_, rowIndex) =>
                Array.from({ length: currentTable.state.cols }).map((__, colIndex) => {
                  const cellIndex = rowIndex * currentTable.state.cols + colIndex;
                  return (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      className="table-widget__cell"
                      value={currentTable.state.cells[cellIndex] ?? ""}
                      readOnly={
                        !editingCell ||
                        editingCell.row !== rowIndex ||
                        editingCell.col !== colIndex
                      }
                      onChange={(event) =>
                        currentTable.updateCell(rowIndex, colIndex, event.target.value)
                      }
                      onClick={(event) => {
                        setEditingCell({ row: rowIndex, col: colIndex });
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
