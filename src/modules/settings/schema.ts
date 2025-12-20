// Entities for SETTINGS

// Represents the user's customizable preferences across the application
export interface UserPreferences {
  [key: string]: unknown; // A flexible key-value map for storing any preference
  // Example keys: "fontSize", "showTips", "sidebarCollapsed"
}

// Represents theme configuration and available theme options
export interface ThemeConfig {
  current: string; // The currently active theme (e.g., "light")
  options: string[]; // Allowed theme options in the system
  // Example: ["light", "dark", "amoled"]
}

export const settingsSchema: {
  preferences: UserPreferences;
  theme: ThemeConfig;
} = {
  preferences: {}, // Starts empty, filled as user customizes settings
  theme: {
    current: "light", // Default theme
    options: ["light", "dark"], // Expand in future
  },
};
