import { useSyncExternalStore } from "react";
import { defaultSidebarLayout } from "../theme/defaultAppearance";

export type SidebarButtonLayout = "compact" | "list";

const STORAGE_KEY = "myndos.sidebar.buttonLayout.v1";
const CHANGE_EVENT = "sidebar-button-layout-change";
let inMemoryLayout: SidebarButtonLayout = defaultSidebarLayout;

export const getSidebarButtonLayout = (): SidebarButtonLayout => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "list" || stored === "compact" ? stored : defaultSidebarLayout;
  } catch {
    return inMemoryLayout;
  }
};

export const setSidebarButtonLayout = (layout: SidebarButtonLayout): void => {
  inMemoryLayout = layout;
  try {
    localStorage.setItem(STORAGE_KEY, layout);
  } catch {
    // The current session can still update when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export const useSidebarButtonLayout = (): SidebarButtonLayout =>
  useSyncExternalStore(subscribe, getSidebarButtonLayout, () => defaultSidebarLayout);
