export type SidebarButtonContent = { name?: string; icon?: string };

export const SIDEBAR_CONTENT_STORAGE_KEY = "myndos.sidebar.buttonContent.v1";

export const loadSidebarButtonContent = (): Record<string, SidebarButtonContent> => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SIDEBAR_CONTENT_STORAGE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).map(([path, value]) => {
      const saved = value as SidebarButtonContent | null;
      return [path, {
        name: typeof saved?.name === "string" && saved.name.trim() ? saved.name.trim() : undefined,
        icon: typeof saved?.icon === "string" && saved.icon.trim() ? saved.icon.trim() : undefined,
      }];
    }));
  } catch {
    return {};
  }
};
