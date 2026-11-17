import { moduleLinks } from "../navigation/moduleLinks";
import { loadSidebarButtonContent } from "../navigation/sidebarButtonContent";

export const MODULE_CUBE_EMOJI_CHANGE_EVENT = "module-cube-emoji-change";

export const moduleCubeStorageKey = (moduleName: string) => `module-cube-config:${moduleName}`;

export const getSavedSidebarEmoji = (moduleName: string): string | undefined => {
  const path = moduleLinks.find((link) => link.moduleName === moduleName)?.path;
  return path ? loadSidebarButtonContent()[path]?.icon : undefined;
};

export const setModuleCubeEmoji = (moduleName: string, emoji: string): void => {
  const key = moduleCubeStorageKey(moduleName);
  let saved: Record<string, unknown> = {};
  try {
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      saved = parsed as Record<string, unknown>;
    }
  } catch {
    // A damaged saved config should not prevent the new emoji from being saved.
  }
  localStorage.setItem(key, JSON.stringify({ ...saved, emoji, sidebarIconSynced: emoji }));
  window.dispatchEvent(new CustomEvent(MODULE_CUBE_EMOJI_CHANGE_EVENT, { detail: { moduleName, emoji } }));
};
