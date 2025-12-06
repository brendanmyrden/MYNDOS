/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { ReactNode } from "react";

// --------------------------------------
// 1. TYPES
// --------------------------------------

export interface ModuleTheme {
  color?: string;
  font?: string;
  gradient?: string;
}

export interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;

  moduleThemes: Record<string, ModuleTheme>;
  setModuleTheme: (moduleName: string, theme: ModuleTheme) => void;
}

// --------------------------------------
// 2. CONSTANTS
// --------------------------------------

const THEME_COLOR_KEY = "themeColor";
const MODULE_THEME_KEY = "moduleThemes";
const DEFAULT_THEME_COLOR = "#05070A";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// --------------------------------------
// 3. PROVIDER
// --------------------------------------

export function ThemeProvider({ children }: ThemeProviderProps) {
  // ---- GLOBAL THEME ----
  const [themeColor, setThemeColorState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(THEME_COLOR_KEY);
      return stored || DEFAULT_THEME_COLOR;
    } catch {
      return DEFAULT_THEME_COLOR;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_COLOR_KEY, themeColor);
    } catch (error) {
      console.error("Failed to save theme color:", error);
    }
  }, [themeColor]);

  // ---- MODULE THEMES ----
  const [moduleThemes, setModuleThemes] = useState<Record<string, ModuleTheme>>(
    () => {
      try {
        const stored = localStorage.getItem(MODULE_THEME_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(MODULE_THEME_KEY, JSON.stringify(moduleThemes));
    } catch (error) {
      console.error("Failed to save module themes:", error);
    }
  }, [moduleThemes]);

  // ---- METHODS ----
  const setThemeColor = (color: string) => {
    setThemeColorState(color);
  };

  const setModuleTheme = (moduleName: string, theme: ModuleTheme) => {
    setModuleThemes((prev) => ({
      ...prev,
      [moduleName]: theme,
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        setThemeColor,
        moduleThemes,
        setModuleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// --------------------------------------
// 4. HOOK
// --------------------------------------

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
