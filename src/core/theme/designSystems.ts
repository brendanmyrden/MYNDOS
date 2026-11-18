import type { AppTheme } from "./themeEngine";
import type { ModuleThemeValues } from "./modulePalettes";

export type DesignSystem = {
  id: string;
  name: string;
  description: string;
  typography: { fontFamily: string };
  spacing: { page: string; cardGap: string };
  surfaces: { cardRadius: string; buttonRadius: string };
  layout: { sidebarWidth: string };
  motion: { interactionDuration: string };
  colors: {
    appTheme: "saved" | AppTheme;
    modulePalettes: "saved" | Record<string, Partial<ModuleThemeValues>>;
  };
};

const STORAGE_KEY = "myndos.designSystem.activeId.v1";

// A design system owns all visual token categories. The current system resolves
// its colours from the user's existing app theme and page palettes, so choosing
// it never replaces personal edits or module data.
export const designSystems: readonly DesignSystem[] = [
  {
    id: "myndos-current",
    name: "Current MYND OS",
    description: "The look you have now, including your saved page colours and sidebar styling.",
    typography: { fontFamily: '"Rajdhani", "Orbitron", system-ui, sans-serif' },
    spacing: { page: "32px", cardGap: "14px" },
    surfaces: { cardRadius: "20px", buttonRadius: "10px" },
    layout: { sidebarWidth: "250px" },
    motion: { interactionDuration: "200ms" },
    colors: { appTheme: "saved", modulePalettes: "saved" },
  },
];

export const getActiveDesignSystem = (): DesignSystem => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return designSystems.find((system) => system.id === id) ?? designSystems[0];
  } catch {
    return designSystems[0];
  }
};

export const applyDesignSystem = (system: DesignSystem): void => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--design-page-padding", system.spacing.page);
  root.style.setProperty("--design-card-gap", system.spacing.cardGap);
  root.style.setProperty("--design-card-radius", system.surfaces.cardRadius);
  root.style.setProperty("--design-button-radius", system.surfaces.buttonRadius);
  root.style.setProperty("--design-sidebar-width", system.layout.sidebarWidth);
  root.style.setProperty("--design-interaction-duration", system.motion.interactionDuration);
  // The active app theme and module providers resolve the saved colour and font
  // choices after this base layer is applied.
};

export const setDesignSystem = (id: string): DesignSystem => {
  const system = designSystems.find((entry) => entry.id === id) ?? designSystems[0];
  try {
    localStorage.setItem(STORAGE_KEY, system.id);
  } catch (error) {
    console.error("Failed to save design system selection:", error);
  }
  applyDesignSystem(system);
  return system;
};
