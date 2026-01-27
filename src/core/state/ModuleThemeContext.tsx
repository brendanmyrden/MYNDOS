import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ModuleThemeState {
  moduleThemeColor: string;
  moduleFont: string;
  moduleBackgroundGradient: string;
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
  previewMode: boolean;
}

type ModuleColorOverrides = Pick<
  ModuleThemeState,
  | "moduleText"
  | "moduleMuted"
  | "moduleAccent"
  | "moduleAccent2"
  | "moduleBorder"
  | "moduleGlass"
  | "moduleButtonBg"
  | "moduleButtonText"
  | "moduleInputBg"
  | "moduleInputBorder"
>;

type SidebarButtonTheme = Pick<
  ModuleThemeState,
  "sidebarButtonStyle" | "sidebarButtonPrimary" | "sidebarButtonSecondary" | "sidebarButtonOutline"
>;

interface ModuleThemeContextType extends ModuleThemeState {
  setModuleThemeColor: (color: string) => void;
  setModuleFont: (font: string) => void;
  setModuleBackgroundGradient: (gradient: string) => void;
  setModuleColors: (colors: Partial<ModuleColorOverrides>) => void;
  setSidebarButtonTheme: (theme: Partial<SidebarButtonTheme>) => void;
  setPreviewMode: (preview: boolean) => void;
  resetToDefaults: () => void;
  saveChanges: () => void;
  cancelPreview: () => void;
}

export const ModuleThemeContext = createContext<ModuleThemeContextType | undefined>(undefined);

const DEFAULT_MODULE_THEME_COLOR = "#05070A";
const DEFAULT_MODULE_FONT = "system-ui, -apple-system, sans-serif";
const DEFAULT_MODULE_BACKGROUND_GRADIENT = `linear-gradient(135deg, ${DEFAULT_MODULE_THEME_COLOR} 0%, #05070A 100%)`;
const DEFAULT_MODULE_TEXT = "#eaf2ff";
const DEFAULT_MODULE_MUTED = "rgba(234, 242, 255, 0.7)";
const DEFAULT_MODULE_ACCENT = "#7df9ff";
const DEFAULT_MODULE_ACCENT_2 = "#ff4fd8";
const DEFAULT_MODULE_BORDER = "rgba(125, 249, 255, 0.2)";
const DEFAULT_MODULE_GLASS = "rgba(14, 18, 32, 0.68)";
const DEFAULT_MODULE_BUTTON_BG = "linear-gradient(135deg, #7df9ff 0%, #7a5cff 60%, #ff4fd8 100%)";
const DEFAULT_MODULE_BUTTON_TEXT = "#070b15";
const DEFAULT_MODULE_INPUT_BG = "rgba(6, 10, 20, 0.75)";
const DEFAULT_MODULE_INPUT_BORDER = "rgba(125, 249, 255, 0.25)";
const DEFAULT_SIDEBAR_BUTTON_STYLE = "gradient";
const DEFAULT_SIDEBAR_BUTTON_PRIMARY = "#7df9ff";
const DEFAULT_SIDEBAR_BUTTON_SECONDARY = "#ff4fd8";
const DEFAULT_SIDEBAR_BUTTON_OUTLINE = "#7df9ff";

interface ModuleThemeProviderProps {
  children: ReactNode;
  moduleName: string; // e.g., "raphi", "taskpill", "syyr"
}

export function ModuleThemeProvider({ children, moduleName }: ModuleThemeProviderProps) {
  const MODULE_THEME_KEY = `moduleTheme_${moduleName}`;

  // Load saved module theme from localStorage
  const loadModuleTheme = (): ModuleThemeState => {
    try {
      const stored = localStorage.getItem(MODULE_THEME_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          moduleThemeColor: parsed.moduleThemeColor || DEFAULT_MODULE_THEME_COLOR,
          moduleFont: parsed.moduleFont || DEFAULT_MODULE_FONT,
          moduleBackgroundGradient: parsed.moduleBackgroundGradient || DEFAULT_MODULE_BACKGROUND_GRADIENT,
          moduleText: parsed.moduleText || DEFAULT_MODULE_TEXT,
          moduleMuted: parsed.moduleMuted || DEFAULT_MODULE_MUTED,
          moduleAccent: parsed.moduleAccent || DEFAULT_MODULE_ACCENT,
          moduleAccent2: parsed.moduleAccent2 || DEFAULT_MODULE_ACCENT_2,
          moduleBorder: parsed.moduleBorder || DEFAULT_MODULE_BORDER,
          moduleGlass: parsed.moduleGlass || DEFAULT_MODULE_GLASS,
          moduleButtonBg: parsed.moduleButtonBg || DEFAULT_MODULE_BUTTON_BG,
          moduleButtonText: parsed.moduleButtonText || DEFAULT_MODULE_BUTTON_TEXT,
          moduleInputBg: parsed.moduleInputBg || DEFAULT_MODULE_INPUT_BG,
          moduleInputBorder: parsed.moduleInputBorder || DEFAULT_MODULE_INPUT_BORDER,
          sidebarButtonStyle:
            parsed.sidebarButtonStyle === "solid" || parsed.sidebarButtonStyle === "gradient"
              ? parsed.sidebarButtonStyle
              : DEFAULT_SIDEBAR_BUTTON_STYLE,
          sidebarButtonPrimary: parsed.sidebarButtonPrimary || DEFAULT_SIDEBAR_BUTTON_PRIMARY,
          sidebarButtonSecondary: parsed.sidebarButtonSecondary || DEFAULT_SIDEBAR_BUTTON_SECONDARY,
          sidebarButtonOutline: parsed.sidebarButtonOutline || DEFAULT_SIDEBAR_BUTTON_OUTLINE,
          previewMode: false,
        };
      }
    } catch {
      // Ignore errors
    }
    return {
      moduleThemeColor: DEFAULT_MODULE_THEME_COLOR,
      moduleFont: DEFAULT_MODULE_FONT,
      moduleBackgroundGradient: DEFAULT_MODULE_BACKGROUND_GRADIENT,
      moduleText: DEFAULT_MODULE_TEXT,
      moduleMuted: DEFAULT_MODULE_MUTED,
      moduleAccent: DEFAULT_MODULE_ACCENT,
      moduleAccent2: DEFAULT_MODULE_ACCENT_2,
      moduleBorder: DEFAULT_MODULE_BORDER,
      moduleGlass: DEFAULT_MODULE_GLASS,
      moduleButtonBg: DEFAULT_MODULE_BUTTON_BG,
      moduleButtonText: DEFAULT_MODULE_BUTTON_TEXT,
      moduleInputBg: DEFAULT_MODULE_INPUT_BG,
      moduleInputBorder: DEFAULT_MODULE_INPUT_BORDER,
      sidebarButtonStyle: DEFAULT_SIDEBAR_BUTTON_STYLE,
      sidebarButtonPrimary: DEFAULT_SIDEBAR_BUTTON_PRIMARY,
      sidebarButtonSecondary: DEFAULT_SIDEBAR_BUTTON_SECONDARY,
      sidebarButtonOutline: DEFAULT_SIDEBAR_BUTTON_OUTLINE,
      previewMode: false,
    };
  };

  const [state, setState] = useState<ModuleThemeState>(loadModuleTheme);
  const [savedState, setSavedState] = useState<ModuleThemeState>(loadModuleTheme);

  // Save to localStorage whenever saved state changes (not preview)
  useEffect(() => {
    if (!state.previewMode) {
      try {
        localStorage.setItem(
          MODULE_THEME_KEY,
          JSON.stringify({
            moduleThemeColor: state.moduleThemeColor,
            moduleFont: state.moduleFont,
            moduleBackgroundGradient: state.moduleBackgroundGradient,
            moduleText: state.moduleText,
            moduleMuted: state.moduleMuted,
            moduleAccent: state.moduleAccent,
            moduleAccent2: state.moduleAccent2,
            moduleBorder: state.moduleBorder,
            moduleGlass: state.moduleGlass,
          moduleButtonBg: state.moduleButtonBg,
          moduleButtonText: state.moduleButtonText,
          moduleInputBg: state.moduleInputBg,
          moduleInputBorder: state.moduleInputBorder,
          sidebarButtonStyle: state.sidebarButtonStyle,
          sidebarButtonPrimary: state.sidebarButtonPrimary,
          sidebarButtonSecondary: state.sidebarButtonSecondary,
          sidebarButtonOutline: state.sidebarButtonOutline,
        })
      );
      window.dispatchEvent(new CustomEvent("module-theme-change", { detail: { moduleName } }));
      setSavedState(state);
    } catch (error) {
      console.error(`Failed to save module theme for ${moduleName}:`, error);
    }
  }
  }, [state, moduleName, MODULE_THEME_KEY]);

  const setModuleThemeColor = (color: string) => {
    setState((prev) => ({
      ...prev,
      moduleThemeColor: color,
      moduleBackgroundGradient: `linear-gradient(135deg, ${color} 0%, #05070A 100%)`,
    }));
  };

  const setModuleFont = (font: string) => {
    setState((prev) => ({ ...prev, moduleFont: font }));
  };

  const setModuleBackgroundGradient = (gradient: string) => {
    setState((prev) => ({ ...prev, moduleBackgroundGradient: gradient }));
  };

  const setModuleColors = (colors: Partial<ModuleColorOverrides>) => {
    setState((prev) => ({ ...prev, ...colors }));
  };

  const setSidebarButtonTheme = (theme: Partial<SidebarButtonTheme>) => {
    setState((prev) => ({ ...prev, ...theme }));
  };

  const setPreviewMode = (preview: boolean) => {
    setState((prev) => ({ ...prev, previewMode: preview }));
  };

  const resetToDefaults = () => {
    const defaults = {
      moduleThemeColor: DEFAULT_MODULE_THEME_COLOR,
      moduleFont: DEFAULT_MODULE_FONT,
      moduleBackgroundGradient: DEFAULT_MODULE_BACKGROUND_GRADIENT,
      moduleText: DEFAULT_MODULE_TEXT,
      moduleMuted: DEFAULT_MODULE_MUTED,
      moduleAccent: DEFAULT_MODULE_ACCENT,
      moduleAccent2: DEFAULT_MODULE_ACCENT_2,
      moduleBorder: DEFAULT_MODULE_BORDER,
      moduleGlass: DEFAULT_MODULE_GLASS,
      moduleButtonBg: DEFAULT_MODULE_BUTTON_BG,
      moduleButtonText: DEFAULT_MODULE_BUTTON_TEXT,
      moduleInputBg: DEFAULT_MODULE_INPUT_BG,
      moduleInputBorder: DEFAULT_MODULE_INPUT_BORDER,
      sidebarButtonStyle: DEFAULT_SIDEBAR_BUTTON_STYLE,
      sidebarButtonPrimary: DEFAULT_SIDEBAR_BUTTON_PRIMARY,
      sidebarButtonSecondary: DEFAULT_SIDEBAR_BUTTON_SECONDARY,
      sidebarButtonOutline: DEFAULT_SIDEBAR_BUTTON_OUTLINE,
      previewMode: false,
    };
    setState(defaults);
    setSavedState(defaults);
  };

  const saveChanges = () => {
    setState((prev) => ({ ...prev, previewMode: false }));
    setSavedState(state);
  };

  const cancelPreview = () => {
    setState(savedState);
  };

  return (
    <ModuleThemeContext.Provider
      value={{
        ...state,
        setModuleThemeColor,
        setModuleFont,
        setModuleBackgroundGradient,
        setModuleColors,
        setSidebarButtonTheme,
        setPreviewMode,
        resetToDefaults,
        saveChanges,
        cancelPreview,
      }}
    >
      {children}
    </ModuleThemeContext.Provider>
  );
}

export function useModuleTheme() {
  const context = useContext(ModuleThemeContext);
  if (context === undefined) {
    throw new Error("useModuleTheme must be used within a ModuleThemeProvider");
  }
  return context;
}
