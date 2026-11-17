import type { ModuleThemeValues } from "./modulePalettes";

// The appearance captured from the Cursor preview. Stored user choices still
// override these values; this preset is used only when a choice is missing.
export const defaultSidebarOrder = [
  "/myndos",
  "/syyr",
  "/taskpill",
  "/raphi",
  "/myrryr",
  "/luminoise",
  "/streams",
  "/otakumaxxer",
  "/numbers-stars-signs",
  "/varkon",
  "/torbin",
  "/themes",
  "/sanctuary",
  "/settings",
] as const;

export const defaultSidebarLayout = "list" as const;

export const defaultSidebarSkin = {
  mode: "gradient",
  primary: "#060910",
  secondary: "#0d121c",
  titleColor: "#d9edf5",
} as const;

// Only values that differ from the generated module palettes are listed here.
// This preserves the exact saved page and sidebar styling without duplicating
// all of the derived text, border, and input colours for every module.
export const defaultModuleThemeOverrides: Record<string, Partial<ModuleThemeValues>> = {
  myndos: {
    moduleThemeColor: "#00ff4c",
    moduleBackgroundGradient: "linear-gradient(135deg, #00ff4c 0%, #07111e 100%)",
    moduleAccent: "#00ff33",
    moduleAccent2: "#00ff04",
    moduleBorder: "#37ff00",
    sidebarButtonPrimary: "#37ff00",
    sidebarButtonSecondary: "#04ff00",
  },
  syyr: {
    moduleThemeColor: "#000000",
    moduleBackgroundGradient: "linear-gradient(135deg, #000000 0%, #061923 100%)",
    moduleText: "#00ff88",
    moduleMuted: "#00ff6e",
    moduleAccent: "#00ff91",
    moduleBorder: "#00ff7b",
    sidebarButtonPrimary: "#1affba",
    sidebarButtonSecondary: "#00ffcc",
  },
  raphi: { sidebarButtonSecondary: "#800071" },
  myrryr: { sidebarButtonPrimary: "#ff7300" },
  streams: { sidebarButtonPrimary: "#a6ff00", sidebarButtonSecondary: "#a6ff00" },
  otakumaxxer: { sidebarButtonPrimary: "#bd0026", sidebarButtonSecondary: "#44251d" },
  "numbers-stars-signs": { sidebarButtonPrimary: "#ff006f", sidebarButtonSecondary: "#820d40" },
  varkon: { sidebarButtonSecondary: "#2c1538" },
  torbin: { sidebarButtonSecondary: "#ffbb00" },
  themes: {
    moduleThemeColor: "#12006b",
    moduleBackgroundGradient: "linear-gradient(135deg, #12006b 0%, #100c20 100%)",
    sidebarButtonPrimary: "#6f00ff",
    sidebarButtonSecondary: "#2000c2",
  },
  sanctuary: { sidebarButtonPrimary: "#ff0000", sidebarButtonSecondary: "#ff0000" },
  settings: { sidebarButtonPrimary: "#00bbff", sidebarButtonSecondary: "#2eabff" },
};

// Keep legacy cube colours available if a user switches from Match Page to a
// custom style. ModuleCube applies the page match and both glow reductions.
export const defaultModuleCubeOverrides: Record<string, {
  emoji?: string;
  gradientFrom?: string;
  gradientTo?: string;
  paletteLinked?: boolean;
  glowStrength?: number;
  glowColor?: string | null;
}> = {
  myndos: {
    gradientFrom: "#000000",
    gradientTo: "#00ff04",
    paletteLinked: false,
    glowStrength: 61,
    glowColor: "#009903",
  },
  syyr: { emoji: "🔥" },
  taskpill: { gradientFrom: "#ffffff", gradientTo: "#0079fa", paletteLinked: false },
  streams: { gradientFrom: "#000000", gradientTo: "#b6ff00", paletteLinked: false },
};
