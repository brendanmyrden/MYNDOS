import { useState, useEffect, useRef } from "react";
import { useTheme } from "../state/ThemeContext";

const DEFAULT_THEME_COLOR = "#05070A";
const DEFAULT_FONT = "system-ui, -apple-system, sans-serif";

function lighten(color: string, percent: number) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

const MODULE_NAMES = [
  { key: "raphi", name: "R-A-P-H [ i ]" },
  { key: "sanctuary", name: "Sanctuary" },
  { key: "taskpill", name: "Task Pill" },
  { key: "myrryr", name: "MYRRYR" },
  { key: "syyr", name: "SYYR" },
  { key: "myndos", name: "MYND OS" },
  { key: "prompttrac", name: "PROMPTRAC" },
];

export default function SettingsPage() {
  const { themeColor, setThemeColor } = useTheme();
  const [globalFont, setGlobalFont] = useState(DEFAULT_FONT);
  const [moduleOverrides, setModuleOverrides] = useState<
    Array<{ key: string; name: string; hasOverride: boolean }>
  >([]);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Load global font from localStorage
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("themeFont");
      if (savedFont) {
        setGlobalFont(savedFont);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Check which modules have overrides
  useEffect(() => {
    const overrides = MODULE_NAMES.map((module) => {
      try {
        const stored = localStorage.getItem(`moduleTheme_${module.key}`);
        return {
          key: module.key,
          name: module.name,
          hasOverride: stored !== null,
        };
      } catch {
        return {
          key: module.key,
          name: module.name,
          hasOverride: false,
        };
      }
    });
    setModuleOverrides(overrides);
  }, []);

  const handleFontChange = (font: string) => {
    setGlobalFont(font);
    try {
      localStorage.setItem("themeFont", font);
      document.documentElement.style.fontFamily = font;
    } catch (error) {
      console.error("Failed to save font:", error);
    }
  };

  const handleResetModule = (moduleKey: string) => {
    try {
      localStorage.removeItem(`moduleTheme_${moduleKey}`);
      // Update the overrides list
      setModuleOverrides((prev) =>
        prev.map((m) =>
          m.key === moduleKey ? { ...m, hasOverride: false } : m
        )
      );
    } catch (error) {
      console.error(`Failed to reset module ${moduleKey}:`, error);
    }
  };

  const handleResetAllModules = () => {
    MODULE_NAMES.forEach((module) => {
      try {
        localStorage.removeItem(`moduleTheme_${module.key}`);
      } catch {
        // Ignore
      }
    });
    setModuleOverrides((prev) =>
      prev.map((m) => ({ ...m, hasOverride: false }))
    );
  };

  const handleResetGlobalTheme = () => {
    setThemeColor(DEFAULT_THEME_COLOR);
    setGlobalFont(DEFAULT_FONT);
    try {
      localStorage.removeItem("themeFont");
      document.documentElement.style.fontFamily = DEFAULT_FONT;
    } catch (error) {
      console.error("Failed to reset global theme:", error);
    }
  };

  const colorPreviewStyle: React.CSSProperties = {
    width: "48px",
    height: "32px",
    borderRadius: "8px",
    background: `linear-gradient(145deg, ${themeColor} 0%, ${lighten(themeColor, 0.15)} 100%)`,
    boxShadow: `
      inset 2px 2px 4px rgba(0,0,0,0.35),
      inset -2px -2px 4px rgba(255,255,255,0.15),
      0 0 6px rgba(255, 100, 150, 0.4),
      0 0 12px rgba(255, 100, 150, 0.2)
    `,
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "0.15s ease-in-out",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <h1 style={{ color: "#EDEDED", marginBottom: "32px" }}>Global Settings</h1>

      {/* Global Theme Color */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#EDEDED", fontSize: "18px", marginBottom: "16px" }}>
          Global Theme Color
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <input
              ref={colorInputRef}
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              style={{
                position: "absolute",
                opacity: 0,
                width: 0,
                height: 0,
                pointerEvents: "none",
              }}
            />
            <div
              onClick={() => colorInputRef.current?.click()}
              style={colorPreviewStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `
                  inset 2px 2px 4px rgba(0,0,0,0.35),
                  inset -2px -2px 4px rgba(255,255,255,0.15),
                  0 0 8px rgba(255, 100, 150, 0.6),
                  0 0 16px rgba(255, 100, 150, 0.3)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `
                  inset 2px 2px 4px rgba(0,0,0,0.35),
                  inset -2px -2px 4px rgba(255,255,255,0.15),
                  0 0 6px rgba(255, 100, 150, 0.4),
                  0 0 12px rgba(255, 100, 150, 0.2)
                `;
              }}
            />
          </div>
          <input
            type="text"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "#EDEDED",
              fontSize: "14px",
              maxWidth: "200px",
            }}
            placeholder="#05070A"
          />
          <button
            onClick={handleResetGlobalTheme}
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "#EDEDED",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Reset
          </button>
        </div>
      </section>

      {/* Global Font */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#EDEDED", fontSize: "18px", marginBottom: "16px" }}>
          Global Font Family
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select
            value={globalFont}
            onChange={(e) => handleFontChange(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "#EDEDED",
              fontSize: "14px",
              cursor: "pointer",
              maxWidth: "300px",
            }}
          >
            <option value="system-ui, -apple-system, sans-serif">System Default</option>
            <option value="Inter, system-ui, sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Lato', sans-serif">Lato</option>
          </select>
        </div>
      </section>

      {/* Module Overrides */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ color: "#EDEDED", fontSize: "18px", margin: 0 }}>
            Module Theme Overrides
          </h2>
          {moduleOverrides.some((m) => m.hasOverride) && (
            <button
              onClick={handleResetAllModules}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#EDEDED",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Reset All Modules
            </button>
          )}
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          {moduleOverrides.length === 0 ? (
            <p style={{ color: "#EDEDED", opacity: 0.7, margin: 0 }}>
              Checking module overrides...
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {moduleOverrides.map((module) => (
                <div
                  key={module.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: module.hasOverride
                      ? "rgba(74, 144, 226, 0.1)"
                      : "transparent",
                    borderRadius: "6px",
                    border: module.hasOverride
                      ? "1px solid rgba(74, 144, 226, 0.3)"
                      : "1px solid transparent",
                  }}
                >
                  <div>
                    <div style={{ color: "#EDEDED", fontWeight: "500" }}>
                      {module.name}
                    </div>
                    <div
                      style={{
                        color: "#EDEDED",
                        opacity: 0.6,
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {module.hasOverride
                        ? "Custom theme active"
                        : "Using global defaults"}
                    </div>
                  </div>
                  {module.hasOverride && (
                    <button
                      onClick={() => handleResetModule(module.key)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "4px",
                        color: "#EDEDED",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Reset to Global
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

