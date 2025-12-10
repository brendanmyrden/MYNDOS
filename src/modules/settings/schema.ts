// Entities for SETTINGS
export interface Preferences {
  [key: string]: unknown; // flexible key-value store
}

export interface Theme {
  current: string;
  options: string[];
}

export const settingsSchema: {
  preferences: Preferences;
  theme: Theme;
} = {
  preferences: {},
  theme: { current: "light", options: ["light", "dark"] },
};
