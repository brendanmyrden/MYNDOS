import { getActiveTheme } from "./themeEngine";
import type { AppTheme } from "./themeEngine";
import { defaultModuleThemeOverrides } from "./defaultAppearance";

export const MODULE_PALETTE_VERSION = 4;

export type ModuleThemeValues = {
  moduleThemeColor: string;
  moduleFont: string;
  moduleBackgroundGradient: string;
  modulePlusMatchBackground: boolean;
  modulePlusColor: string;
  moduleText: string;
  moduleMuted: string;
  moduleAccent: string;
  moduleAccent2: string;
  moduleBorder: string;
  moduleGlass: string;
  moduleButtonBg: string;
  moduleButtonText: string;
  moduleInputBg: string;
  moduleInputBorder: string;
  sidebarButtonStyle: "solid" | "gradient";
  sidebarButtonPrimary: string;
  sidebarButtonSecondary: string;
  sidebarButtonOutline: string;
};

type Palette = {
  background: string;
  middle: string;
  end: string;
  accent: string;
  accent2: string;
};

const palettes: Record<string, Palette> = {
  myndos: { background: "#07111e", middle: "#123149", end: "#291942", accent: "#39f7ff", accent2: "#df4dff" },
  sanctuary: { background: "#04180d", middle: "#114a23", end: "#173e14", accent: "#55ee8d", accent2: "#d4ff38" },
  taskpill: { background: "#051923", middle: "#0c3850", end: "#102f54", accent: "#31efff", accent2: "#258dff" },
  raphi: { background: "#20071c", middle: "#50113e", end: "#391035", accent: "#ff35cf", accent2: "#ff8ef1" },
  myrryr: { background: "#1c0f04", middle: "#51300b", end: "#382108", accent: "#ffb31a", accent2: "#ff6d00" },
  syyr: { background: "#061923", middle: "#17465e", end: "#123854", accent: "#e7f5ff", accent2: "#18bfff" },
  "numbers-stars-signs": { background: "#1c1105", middle: "#4a2b0e", end: "#3e1b10", accent: "#ffe05a", accent2: "#ff8c7b" },
  streams: { background: "#041a0a", middle: "#145023", end: "#133b0a", accent: "#30ff42", accent2: "#b6ff00" },
  otakumaxxer: { background: "#23080f", middle: "#4d1824", end: "#41121e", accent: "#ff3860", accent2: "#ff7650" },
  luminoise: { background: "#031a21", middle: "#064456", end: "#0c354a", accent: "#00f0ff", accent2: "#8affff" },
  varkon: { background: "#140822", middle: "#35135c", end: "#261046", accent: "#9e42ff", accent2: "#d177ff" },
  torbin: { background: "#1a1209", middle: "#1a3d22", end: "#3b2810", accent: "#78ff56", accent2: "#ffd259" },
  settings: { background: "#0b1720", middle: "#203b4d", end: "#172d40", accent: "#72d9ff", accent2: "#d7efff" },
  themes: { background: "#100c20", middle: "#29204c", end: "#12314a", accent: "#af70ff", accent2: "#25d8ff" },
  prompttrac: { background: "#100720", middle: "#2b1256", end: "#351146", accent: "#ad56ff", accent2: "#f14cff" },
};

// Apply the requested personal colours once to palettes saved before this version.
// Later edits are kept because version 4 values are read as saved.
const personalPaletteModules = new Set([
  "raphi",
  "taskpill",
  "myrryr",
  "syyr",
  "numbers-stars-signs",
  "streams",
  "otakumaxxer",
]);

const personalColorKeys = new Set<keyof ModuleThemeValues>([
  "moduleThemeColor",
  "moduleBackgroundGradient",
  "modulePlusColor",
  "moduleAccent",
  "moduleAccent2",
  "moduleBorder",
  "moduleGlass",
  "moduleButtonBg",
  "moduleButtonText",
  "moduleInputBg",
  "moduleInputBorder",
  "sidebarButtonPrimary",
  "sidebarButtonSecondary",
  "sidebarButtonOutline",
]);

// Version 2 defaults provide the baseline for moving generated colours to neon.
const previousPalettesV2: Record<string, Palette> = {
  myndos: { background: "#07111e", middle: "#102638", end: "#1c1838", accent: "#64eaff", accent2: "#e76bff" },
  sanctuary: { background: "#071913", middle: "#123527", end: "#1d3220", accent: "#6be5a2", accent2: "#d0e77e" },
  taskpill: { background: "#07191d", middle: "#123440", end: "#162c43", accent: "#6ce2d5", accent2: "#72b7ff" },
  raphi: { background: "#20071c", middle: "#451138", end: "#30112e", accent: "#ff43c8", accent2: "#ff8be5" },
  myrryr: { background: "#1b1006", middle: "#3a240a", end: "#30200b", accent: "#ffad28", accent2: "#ff6c1f" },
  syyr: { background: "#061823", middle: "#123b51", end: "#0c2b42", accent: "#cbd9e4", accent2: "#24cfff" },
  "numbers-stars-signs": { background: "#1b1209", middle: "#3b2512", end: "#382016", accent: "#ffc36b", accent2: "#ff8166" },
  streams: { background: "#05190e", middle: "#0d3920", end: "#123016", accent: "#34ff77", accent2: "#b7ff36" },
  otakumaxxer: { background: "#1c0b12", middle: "#41202b", end: "#3d1c20", accent: "#ff7385", accent2: "#ffad70" },
  settings: { background: "#101720", middle: "#273744", end: "#1d2c39", accent: "#9bc6de", accent2: "#d5e4ed" },
  prompttrac: { background: "#130e29", middle: "#292055", end: "#2e1947", accent: "#aaa0ff", accent2: "#f58aff" },
};

// Version 1 defaults are used to update generated colours without replacing personal edits.
const previousPalettes: Record<string, Palette> = {
  taskpill: { background: "#1b1209", middle: "#3b2512", end: "#382016", accent: "#ffc36b", accent2: "#ff8166" },
  raphi: { background: "#07191d", middle: "#123440", end: "#162c43", accent: "#6ce2d5", accent2: "#72b7ff" },
  myrryr: { background: "#180b21", middle: "#352045", end: "#3a1936", accent: "#d699ff", accent2: "#ff7dbd" },
  syyr: { background: "#081326", middle: "#193254", end: "#142b4b", accent: "#80b5ff", accent2: "#77e4ff" },
  "numbers-stars-signs": { background: "#151025", middle: "#302049", end: "#302a3c", accent: "#c5a0ff", accent2: "#ffd579" },
  streams: { background: "#1c0b12", middle: "#41202b", end: "#3d1c20", accent: "#ff7385", accent2: "#ffad70" },
};

const rgba = (color: string, opacity: number): string => {
  const raw = color.trim();
  const hex = raw.startsWith("#") ? raw.slice(1) : "";
  const value = /^[0-9a-f]{3}$/i.test(hex)
    ? hex.split("").map((digit) => `${digit}${digit}`).join("")
    : hex;
  if (!/^[0-9a-f]{6}$/i.test(value)) {
    const rgb = raw.match(/^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/i);
    return rgb ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${opacity})` : color;
  }
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

const createModuleThemeValues = (palette: Palette): ModuleThemeValues => ({
    moduleThemeColor: palette.background,
    moduleFont: '"Rajdhani", "Orbitron", system-ui, sans-serif',
    moduleBackgroundGradient: `linear-gradient(135deg, ${palette.background} 0%, ${palette.middle} 55%, ${palette.end} 100%)`,
    modulePlusMatchBackground: true,
    modulePlusColor: palette.accent,
    moduleText: "#f0f6ff",
    moduleMuted: "rgba(240, 246, 255, 0.72)",
    moduleAccent: palette.accent,
    moduleAccent2: palette.accent2,
    moduleBorder: rgba(palette.accent, 0.56),
    moduleGlass: rgba(palette.background, 0.72),
    moduleButtonBg: `linear-gradient(125deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
    moduleButtonText: palette.background,
    moduleInputBg: rgba(palette.background, 0.82),
    moduleInputBorder: rgba(palette.accent, 0.54),
    sidebarButtonStyle: "gradient",
    sidebarButtonPrimary: palette.accent,
    sidebarButtonSecondary: palette.accent2,
    sidebarButtonOutline: palette.accent,
});

export const getModuleThemeDefaults = (moduleName: string): ModuleThemeValues => ({
  ...createModuleThemeValues(palettes[moduleName] ?? palettes.myndos),
  ...defaultModuleThemeOverrides[moduleName],
});

// The two legacy baselines let existing module edits survive the move to page palettes.
export const legacyModuleDefaults: ModuleThemeValues = {
  moduleThemeColor: "#05070A",
  moduleFont: "system-ui, -apple-system, sans-serif",
  moduleBackgroundGradient: "linear-gradient(135deg, #05070A 0%, #05070A 100%)",
  modulePlusMatchBackground: true,
  modulePlusColor: "#7df9ff",
  moduleText: "#eaf2ff",
  moduleMuted: "rgba(234, 242, 255, 0.7)",
  moduleAccent: "#7df9ff",
  moduleAccent2: "#ff4fd8",
  moduleBorder: "rgba(125, 249, 255, 0.2)",
  moduleGlass: "rgba(14, 18, 32, 0.68)",
  moduleButtonBg: "linear-gradient(135deg, #7df9ff 0%, #7a5cff 60%, #ff4fd8 100%)",
  moduleButtonText: "#070b15",
  moduleInputBg: "rgba(6, 10, 20, 0.75)",
  moduleInputBorder: "rgba(125, 249, 255, 0.25)",
  sidebarButtonStyle: "gradient",
  sidebarButtonPrimary: "#7df9ff",
  sidebarButtonSecondary: "#ff4fd8",
  sidebarButtonOutline: "#7df9ff",
};

export const getLegacySyncedModuleTheme = (theme: AppTheme): ModuleThemeValues => ({
  moduleThemeColor: theme.bg,
  moduleFont: theme.fontFamily,
  moduleBackgroundGradient: theme.gradientPage,
  modulePlusMatchBackground: true,
  modulePlusColor: theme.primary,
  moduleText: theme.text,
  moduleMuted: theme.textMuted,
  moduleAccent: theme.primary,
  moduleAccent2: theme.secondary,
  moduleBorder: theme.border,
  moduleGlass: rgba(theme.bgRaised, 0.68),
  moduleButtonBg: theme.gradientSidebarButton,
  moduleButtonText: theme.bg,
  moduleInputBg: theme.bgRaised,
  moduleInputBorder: theme.border,
  sidebarButtonStyle: theme.gradientSidebarButton.toLowerCase().includes("gradient") ? "gradient" : "solid",
  sidebarButtonPrimary: theme.primary,
  sidebarButtonSecondary: theme.secondary,
  sidebarButtonOutline: theme.outline,
});

export const loadModuleThemeValues = (moduleName: string): ModuleThemeValues => {
  const defaults = getModuleThemeDefaults(moduleName);
  try {
    const raw = localStorage.getItem(`moduleTheme_${moduleName}`);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaults;

    const stored = parsed as Record<string, unknown>;
    const synced = getLegacySyncedModuleTheme(getActiveTheme());
    const previousPalette = stored.modulePaletteVersion === 1
      ? previousPalettes[moduleName] ?? previousPalettesV2[moduleName]
      : previousPalettesV2[moduleName];
    const previousDefaults = previousPalette ? createModuleThemeValues(previousPalette) : null;
    return Object.fromEntries(
      (Object.keys(defaults) as Array<keyof ModuleThemeValues>).map((key) => {
        const value = stored[key];
        if (
          stored.modulePaletteVersion !== MODULE_PALETTE_VERSION &&
          personalPaletteModules.has(moduleName) &&
          personalColorKeys.has(key)
        ) {
          return [key, defaults[key]];
        }
        if (stored.modulePaletteVersion === MODULE_PALETTE_VERSION || stored.modulePaletteVersion === 3) {
          return [key, typeof value === typeof defaults[key] ? value : defaults[key]];
        }
        if (stored.modulePaletteVersion === 1 || stored.modulePaletteVersion === 2) {
          const generatedValue = previousDefaults?.[key] ?? defaults[key];
          const previousBorder = key === "moduleBorder" && previousPalette ? rgba(previousPalette.accent, 0.25) : null;
          const previousInputBorder = key === "moduleInputBorder" && previousPalette ? rgba(previousPalette.accent, 0.35) : null;
          const isGenerated = value === generatedValue || value === previousBorder || value === previousInputBorder;
          return [key, value == null || isGenerated ? defaults[key] : value];
        }
        const isLegacyValue = value === legacyModuleDefaults[key] || value === synced[key];
        return [key, value == null || isLegacyValue ? defaults[key] : value];
      })
    ) as ModuleThemeValues;
  } catch {
    return defaults;
  }
};
