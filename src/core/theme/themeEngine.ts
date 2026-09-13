export type AppTheme = {
  id: string;
  name: string;
  bg: string;
  bgRaised: string;
  bgSidebar: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  secondary: string;
  outline: string;
  gradientPage: string;
  gradientHeader: string;
  gradientSidebarButton: string;
  fontFamily: string;
};

export const defaultTheme: AppTheme = {
  id: "default",
  name: "MYND OS",
  bg: "#05070A",
  bgRaised: "#0B0F1A",
  bgSidebar: "#05070A",
  text: "#EAF2FF",
  textMuted: "rgba(234, 242, 255, 0.7)",
  border: "rgba(125, 249, 255, 0.18)",
  primary: "#7df9ff",
  secondary: "#ff4fd8",
  outline: "rgba(125, 249, 255, 0.3)",
  gradientPage: "linear-gradient(135deg, #0b1020 0%, #151b2f 50%, #1d0f2c 100%)",
  gradientHeader:
    "linear-gradient(90deg, rgba(125, 249, 255, 0.1), rgba(255, 79, 216, 0.08))",
  gradientSidebarButton: "linear-gradient(120deg, #7df9ff 0%, #ff4fd8 100%)",
  fontFamily: '"Rajdhani", "Orbitron", system-ui, sans-serif',
};

const THEMES_STORAGE_KEY = "myndos.themes";
const ACTIVE_THEME_STORAGE_KEY = "myndos.theme.activeId";
const MODULE_THEME_STORAGE_PREFIX = "moduleTheme_";
const KNOWN_MODULE_IDS = [
  "myndos",
  "raphi",
  "sanctuary",
  "myrryr",
  "syyr",
  "taskpill",
  "numbers-stars-signs",
  "streams",
  "settings",
  "prompttrac",
] as const;

const THEME_STRING_KEYS: ReadonlyArray<keyof AppTheme> = [
  "id",
  "name",
  "bg",
  "bgRaised",
  "bgSidebar",
  "text",
  "textMuted",
  "border",
  "primary",
  "secondary",
  "outline",
  "gradientPage",
  "gradientHeader",
  "gradientSidebarButton",
  "fontFamily",
];

const cloneTheme = (theme: AppTheme): AppTheme => ({ ...theme });

const isAppTheme = (value: unknown): value is AppTheme => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return THEME_STRING_KEYS.every(
    (key) => typeof candidate[key] === "string" && candidate[key].trim().length > 0
  );
};

const readStoredThemes = (): AppTheme[] => {
  try {
    const rawThemes = localStorage.getItem(THEMES_STORAGE_KEY);
    if (!rawThemes) return [];

    const parsedThemes: unknown = JSON.parse(rawThemes);
    if (!Array.isArray(parsedThemes)) return [];

    return parsedThemes.filter(isAppTheme).map(cloneTheme);
  } catch {
    return [];
  }
};

const writeThemes = (themes: AppTheme[]) => {
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
  } catch (error) {
    console.error("Failed to save app themes:", error);
  }
};

const writeActiveThemeId = (id: string) => {
  try {
    localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, id);
  } catch (error) {
    console.error("Failed to save the active app theme:", error);
  }
};

const withAlpha = (color: string, alpha: number): string => {
  const value = color.trim();
  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hexMatch) {
    const hex = hexMatch[1].length === 3
      ? hexMatch[1]
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : hexMatch[1];
    const numericColor = Number.parseInt(hex, 16);
    const red = (numericColor >> 16) & 255;
    const green = (numericColor >> 8) & 255;
    const blue = numericColor & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const rgbMatch = value.match(
    /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/i
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }

  return value;
};

const getModuleThemeStorageKeys = (): string[] => {
  const keys = new Set(
    KNOWN_MODULE_IDS.map((moduleId) => `${MODULE_THEME_STORAGE_PREFIX}${moduleId}`)
  );

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(MODULE_THEME_STORAGE_PREFIX)) {
        keys.add(key);
      }
    }
  } catch (error) {
    console.error("Failed to discover module theme storage:", error);
  }

  return [...keys];
};

const readStoredModuleTheme = (key: string): Record<string, unknown> => {
  try {
    const storedTheme = localStorage.getItem(key);
    if (!storedTheme) return {};

    const parsedTheme: unknown = JSON.parse(storedTheme);
    if (!parsedTheme || typeof parsedTheme !== "object" || Array.isArray(parsedTheme)) return {};
    return parsedTheme as Record<string, unknown>;
  } catch {
    return {};
  }
};

const syncModuleThemes = (theme: AppTheme): void => {
  const moduleThemeValues = {
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
    moduleGlass: withAlpha(theme.bgRaised, 0.68),
    moduleButtonBg: theme.gradientSidebarButton,
    moduleButtonText: theme.bg,
    moduleInputBg: theme.bgRaised,
    moduleInputBorder: theme.border,
    sidebarButtonStyle: theme.gradientSidebarButton.toLowerCase().includes("gradient")
      ? "gradient"
      : "solid",
    sidebarButtonPrimary: theme.primary,
    sidebarButtonSecondary: theme.secondary,
    sidebarButtonOutline: theme.outline,
  };

  getModuleThemeStorageKeys().forEach((key) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          ...readStoredModuleTheme(key),
          ...moduleThemeValues,
        })
      );
    } catch (error) {
      console.error(`Failed to sync app theme to ${key}:`, error);
    }
  });

  if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
    window.dispatchEvent(new CustomEvent("module-theme-change", { detail: { source: "global" } }));
  }
};

export function applyTheme(theme: AppTheme): void {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--bg-raised", theme.bgRaised);
    root.style.setProperty("--bg-sidebar", theme.bgSidebar);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-muted", theme.textMuted);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--outline", theme.outline);
    root.style.setProperty("--gradient-page", theme.gradientPage);
    root.style.setProperty("--gradient-header", theme.gradientHeader);
    root.style.setProperty("--gradient-sidebar-button", theme.gradientSidebarButton);
    root.style.setProperty("--font-family", theme.fontFamily);
  }

  syncModuleThemes(theme);
}

export function getThemes(): AppTheme[] {
  const themes = readStoredThemes();
  if (themes.length > 0) return themes;

  const seededThemes = [cloneTheme(defaultTheme)];
  writeThemes(seededThemes);
  return seededThemes;
}

export function getActiveTheme(): AppTheme {
  const themes = getThemes();
  let activeId: string | null = null;

  try {
    activeId = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY);
  } catch {
    // The first available theme is still a safe local-first fallback.
  }

  const activeTheme = themes.find((theme) => theme.id === activeId) ?? themes[0];
  writeActiveThemeId(activeTheme.id);
  return cloneTheme(activeTheme);
}

export function setTheme(theme: AppTheme): void {
  writeActiveThemeId(theme.id);
  applyTheme(theme);
}

export function saveTheme(theme: AppTheme): void {
  const themes = getThemes();
  const existingIndex = themes.findIndex((savedTheme) => savedTheme.id === theme.id);
  const nextThemes = themes.map(cloneTheme);

  if (existingIndex === -1) {
    nextThemes.push(cloneTheme(theme));
  } else {
    nextThemes[existingIndex] = cloneTheme(theme);
  }

  writeThemes(nextThemes);
}

export function deleteTheme(id: string): void {
  const themes = getThemes();
  const activeTheme = getActiveTheme();
  let nextThemes = themes.filter((theme) => theme.id !== id);

  if (nextThemes.length === 0) {
    nextThemes = [cloneTheme(defaultTheme)];
  }

  writeThemes(nextThemes);

  if (activeTheme.id === id) {
    setTheme(nextThemes[0]);
  }
}

export function initializeTheme(): AppTheme {
  const activeTheme = getActiveTheme();
  applyTheme(activeTheme);
  return activeTheme;
}
