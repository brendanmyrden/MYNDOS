import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ModuleThemeState {
  moduleThemeColor: string;
  moduleFont: string;
  moduleBackgroundGradient: string;
  previewMode: boolean;
}

interface ModuleThemeContextType extends ModuleThemeState {
  setModuleThemeColor: (color: string) => void;
  setModuleFont: (font: string) => void;
  setModuleBackgroundGradient: (gradient: string) => void;
  setPreviewMode: (preview: boolean) => void;
  resetToDefaults: () => void;
  saveChanges: () => void;
  cancelPreview: () => void;
}

export const ModuleThemeContext = createContext<ModuleThemeContextType | undefined>(undefined);

const DEFAULT_MODULE_THEME_COLOR = "#05070A";
const DEFAULT_MODULE_FONT = "system-ui, -apple-system, sans-serif";
const DEFAULT_MODULE_BACKGROUND_GRADIENT = `linear-gradient(135deg, ${DEFAULT_MODULE_THEME_COLOR} 0%, #05070A 100%)`;

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
          })
        );
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

  const setPreviewMode = (preview: boolean) => {
    setState((prev) => ({ ...prev, previewMode: preview }));
  };

  const resetToDefaults = () => {
    const defaults = {
      moduleThemeColor: DEFAULT_MODULE_THEME_COLOR,
      moduleFont: DEFAULT_MODULE_FONT,
      moduleBackgroundGradient: DEFAULT_MODULE_BACKGROUND_GRADIENT,
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

