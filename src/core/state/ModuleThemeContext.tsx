import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getModuleThemeDefaults,
  loadModuleThemeValues,
  MODULE_PALETTE_VERSION,
} from "../theme/modulePalettes";
import type { ModuleThemeValues } from "../theme/modulePalettes";

interface ModuleThemeState extends ModuleThemeValues {
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
  moduleName: string;
  setModuleThemeColor: (color: string) => void;
  setModuleFont: (font: string) => void;
  setModuleBackgroundGradient: (gradient: string) => void;
  setModulePlusTheme: (theme: { matchBackground?: boolean; color?: string }) => void;
  setModuleColors: (colors: Partial<ModuleColorOverrides>) => void;
  setSidebarButtonTheme: (theme: Partial<SidebarButtonTheme>) => void;
  setPreviewMode: (preview: boolean) => void;
  resetToDefaults: () => void;
  saveChanges: () => void;
  cancelPreview: () => void;
}

export const ModuleThemeContext = createContext<ModuleThemeContextType | undefined>(undefined);

const loadModuleTheme = (moduleName: string): ModuleThemeState => ({
  ...loadModuleThemeValues(moduleName),
  previewMode: false,
});

interface ModuleThemeProviderProps {
  children: ReactNode;
  moduleName: string; // e.g., "raphi", "taskpill", "syyr"
}

export function ModuleThemeProvider({ children, moduleName }: ModuleThemeProviderProps) {
  const MODULE_THEME_KEY = `moduleTheme_${moduleName}`;
  const [state, setState] = useState<ModuleThemeState>(() => loadModuleTheme(moduleName));
  const [savedState, setSavedState] = useState<ModuleThemeState>(() => loadModuleTheme(moduleName));

  // Save to localStorage whenever theme changes (preview writes too, savedState only updates when not previewing)
  useEffect(() => {
    try {
      localStorage.setItem(
        MODULE_THEME_KEY,
        JSON.stringify({
          modulePaletteVersion: MODULE_PALETTE_VERSION,
          moduleThemeColor: state.moduleThemeColor,
          moduleFont: state.moduleFont,
          moduleBackgroundGradient: state.moduleBackgroundGradient,
          modulePlusMatchBackground: state.modulePlusMatchBackground,
          modulePlusColor: state.modulePlusColor,
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
      if (!state.previewMode) {
        setSavedState(state);
      }
    } catch (error) {
      console.error(`Failed to save module theme for ${moduleName}:`, error);
    }
  }, [state, moduleName, MODULE_THEME_KEY]);

  const setModuleThemeColor = (color: string) => {
    setState((prev) => ({
      ...prev,
      moduleThemeColor: color,
      moduleBackgroundGradient: `linear-gradient(135deg, ${color} 0%, ${getModuleThemeDefaults(moduleName).moduleThemeColor} 100%)`,
    }));
  };

  const setModuleFont = (font: string) => {
    setState((prev) => ({ ...prev, moduleFont: font }));
  };

  const setModuleBackgroundGradient = (gradient: string) => {
    setState((prev) => ({ ...prev, moduleBackgroundGradient: gradient }));
  };

  const setModulePlusTheme = (theme: { matchBackground?: boolean; color?: string }) => {
    setState((prev) => ({
      ...prev,
      modulePlusMatchBackground:
        typeof theme.matchBackground === "boolean" ? theme.matchBackground : prev.modulePlusMatchBackground,
      modulePlusColor: theme.color ?? prev.modulePlusColor,
    }));
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
    const defaults = { ...getModuleThemeDefaults(moduleName), previewMode: false };
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
        moduleName,
        setModuleThemeColor,
        setModuleFont,
        setModuleBackgroundGradient,
        setModulePlusTheme,
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
