import { useCallback, useReducer } from "react";

/**
 * Stable identifiers for rows and groups.
 */
export type RowId = string;
export type GroupId = string;

/**
 * Represents a logical group of task rows.
 */
export interface Group {
  id: GroupId;
  name: string;
  collapsed: boolean;
}

/**
 * Represents a task row in TRAC.
 *
 * NOTE: Extend your existing Row shape here (id/title/status/etc.).
 * The only new field required for grouping is `groupId`.
 */
export interface Row {
  id: RowId;
  title: string;
  status: string;
  // ...any other existing properties on your TRAC row
  /**
   * Optional back-reference to the group this row belongs to.
   * `null` or `undefined` means "ungrouped".
   */
  groupId?: GroupId | null;
}

/**
 * Internal reducer state for grouping:
 * - `groups`: all group headers (order controls render order)
 * - `selectedRowIds`: currently selected rows
 * - `lastSelectedRowId`: anchor row for shift-click range selection
 */
export interface GroupState {
  groups: Group[];
  selectedRowIds: RowId[];
  lastSelectedRowId: RowId | null;
}

/**
 * Actions supported by the grouping reducer.
 * UI will dispatch these via the `useGroupState` hook.
 */
export type GroupAction =
  // Selection
  | { type: "toggleRowSelection"; rowId: RowId; additive: boolean }
  | {
      type: "setSelectionRange";
      fromRowId: RowId;
      toRowId: RowId;
      orderedRowIds: RowId[]; // visible row order for range selection
    }
  | { type: "clearSelection" }

  // Group lifecycle
  | { type: "createGroup"; group: Group }
  | { type: "toggleGroupCollapsed"; groupId: GroupId }
  | { type: "renameGroup"; groupId: GroupId; name: string };

/**
 * Pure reducer that manages grouping + selection state.
 * It does NOT mutate row data; callers update rows separately using groupId.
 */
export function groupReducer(state: GroupState, action: GroupAction): GroupState {
  switch (action.type) {
    case "toggleRowSelection": {
      const { rowId, additive } = action;

      // If not additive (no meta/ctrl), replace selection with just this row.
      if (!additive) {
        return {
          ...state,
          selectedRowIds: [rowId],
          lastSelectedRowId: rowId,
        };
      }

      // Additive toggle: add/remove from existing selection.
      const alreadySelected = state.selectedRowIds.includes(rowId);
      const nextSelected = alreadySelected
        ? state.selectedRowIds.filter((id) => id !== rowId)
        : [...state.selectedRowIds, rowId];

      return {
        ...state,
        selectedRowIds: nextSelected,
        lastSelectedRowId: rowId,
      };
    }

    case "setSelectionRange": {
      const { fromRowId, toRowId, orderedRowIds } = action;

      // Compute contiguous range between from/to in the current visible order.
      const startIndex = orderedRowIds.indexOf(fromRowId);
      const endIndex = orderedRowIds.indexOf(toRowId);
      if (startIndex === -1 || endIndex === -1) return state;

      const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const rangeIds = orderedRowIds.slice(from, to + 1);

      return {
        ...state,
        selectedRowIds: rangeIds,
        lastSelectedRowId: toRowId,
      };
    }

    case "clearSelection": {
      return {
        ...state,
        selectedRowIds: [],
        lastSelectedRowId: null,
      };
    }

    case "createGroup": {
      // Caller is responsible for assigning this group's id to matching rows.
      return {
        ...state,
        groups: [...state.groups, action.group],
      };
    }

    case "toggleGroupCollapsed": {
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id === action.groupId ? { ...group, collapsed: !group.collapsed } : group
        ),
      };
    }

    case "renameGroup": {
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id === action.groupId ? { ...group, name: action.name } : group
        ),
      };
    }

    default:
      return state;
  }
}

/**
 * Hook that owns grouping + selection state for TRAC rows.
 *
 * This is intentionally UI-agnostic:
 * - It tracks which rows are selected and which groups exist.
 * - It exposes helpers you can wire to click/shift-click/cmd-click handlers.
 * - It does NOT know how rows are rendered or filtered.
 */
export function useGroupState(initialGroups: Group[] = []) {
  const [state, dispatch] = useReducer(
    groupReducer,
    {
      groups: initialGroups,
      selectedRowIds: [],
      lastSelectedRowId: null,
    } as GroupState,
    // initializer to ensure we don't accidentally share array references
    (base: GroupState) => ({
      groups: [...base.groups],
      selectedRowIds: [],
      lastSelectedRowId: null,
    })
  );

  /**
   * Basic row selection handler you can call from onClick:
   * - `additive` should be true when meta/ctrl is held (multi-toggle).
   */
  const toggleRowSelection = useCallback((rowId: RowId, additive: boolean) => {
    dispatch({ type: "toggleRowSelection", rowId, additive });
  }, []);

  /**
   * Shift-click range selection:
   * - Pass the previously selected "anchor" and the clicked row,
   *   plus the current visible row ordering.
   */
  const setSelectionRange = useCallback((fromRowId: RowId, toRowId: RowId, orderedRowIds: RowId[]) => {
    dispatch({ type: "setSelectionRange", fromRowId, toRowId, orderedRowIds });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: "clearSelection" });
  }, []);

  /**
   * Create a new group in state. Caller is responsible for:
   * - generating a unique `groupId`
   * - applying that `groupId` to currently selected rows
   */
  const createGroup = useCallback((group: Group) => {
    dispatch({ type: "createGroup", group });
  }, []);

  const toggleGroupCollapsed = useCallback((groupId: GroupId) => {
    dispatch({ type: "toggleGroupCollapsed", groupId });
  }, []);

  const renameGroup = useCallback((groupId: GroupId, name: string) => {
    dispatch({ type: "renameGroup", groupId, name });
  }, []);

  return {
    groups: state.groups,
    selectedRowIds: state.selectedRowIds,
    lastSelectedRowId: state.lastSelectedRowId,

    // dispatch helpers
    toggleRowSelection,
    setSelectionRange,
    clearSelection,
    createGroup,
    toggleGroupCollapsed,
    renameGroup,
  };
}
