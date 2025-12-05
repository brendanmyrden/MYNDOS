import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COLOR_KEY = "themeColor";
const DEFAULT_THEME_COLOR = "#05070A";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize themeColor from localStorage or use default
  const [themeColor, setThemeColorState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(THEME_COLOR_KEY);
      return stored || DEFAULT_THEME_COLOR;
    } catch {
      return DEFAULT_THEME_COLOR;
    }
  });

  // Save to localStorage whenever themeColor changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_COLOR_KEY, themeColor);
    } catch (error) {
      console.error("Failed to save theme color to localStorage:", error);
    }
  }, [themeColor]);

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

