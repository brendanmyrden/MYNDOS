import { useState, useEffect, useContext } from "react";
import { useTheme } from "../state/ThemeContext";
import { ModuleThemeContext } from "../state/ModuleThemeContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useModuleTheme?: boolean; // If true, use module theme instead of global
}

const DEFAULT_THEME_COLOR = "#05070A";
const DEFAULT_FONT = "system-ui, -apple-system, sans-serif";
const DEFAULT_GRADIENT = `linear-gradient(135deg, ${DEFAULT_THEME_COLOR} 0%, #05070A 100%)`;

export default function SettingsModal({ isOpen, onClose, useModuleTheme: useModule = false }: SettingsModalProps) {
  const globalTheme = useTheme();
  
  // Safely get module theme context (returns undefined if not in provider)
  const moduleThemeContext = useContext(ModuleThemeContext);
  const isModuleMode = useModule && moduleThemeContext !== undefined;
  const moduleTheme = isModuleMode ? moduleThemeContext : null;
  const theme = isModuleMode ? moduleTheme : globalTheme;

  const [tempThemeColor, setTempThemeColor] = useState(
    isModuleMode ? moduleTheme!.moduleThemeColor : globalTheme.themeColor
  );
  const [tempFont, setTempFont] = useState(
    isModuleMode ? moduleTheme!.moduleFont : DEFAULT_FONT
  );
  const [tempGradient, setTempGradient] = useState(
    isModuleMode ? moduleTheme!.moduleBackgroundGradient : DEFAULT_GRADIENT
  );
  const [originalThemeColor, setOriginalThemeColor] = useState(
    isModuleMode ? moduleTheme!.moduleThemeColor : globalTheme.themeColor
  );
  const [originalFont, setOriginalFont] = useState(
    isModuleMode ? moduleTheme!.moduleFont : DEFAULT_FONT
  );
  const [originalGradient, setOriginalGradient] = useState(
    isModuleMode ? moduleTheme!.moduleBackgroundGradient : DEFAULT_GRADIENT
  );

  // Reset temp values when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentThemeColor = isModuleMode ? moduleTheme!.moduleThemeColor : globalTheme.themeColor;
      const currentFont = isModuleMode ? moduleTheme!.moduleFont : DEFAULT_FONT;
      const currentGradient = isModuleMode ? moduleTheme!.moduleBackgroundGradient : DEFAULT_GRADIENT;
      
      setTempThemeColor(currentThemeColor);
      setOriginalThemeColor(currentThemeColor);
      setTempFont(currentFont);
      setOriginalFont(currentFont);
      setTempGradient(currentGradient);
      setOriginalGradient(currentGradient);
    }
  }, [isOpen, isModuleMode, moduleTheme, globalTheme.themeColor]);

  const handlePreview = () => {
    if (isModuleMode && moduleTheme) {
      moduleTheme.setModuleThemeColor(tempThemeColor);
      moduleTheme.setModuleFont(tempFont);
      moduleTheme.setModuleBackgroundGradient(tempGradient);
      moduleTheme.setPreviewMode(true);
    } else {
      globalTheme.setThemeColor(tempThemeColor);
      document.documentElement.style.fontFamily = tempFont;
    }
  };

  const handleSave = () => {
    if (isModuleMode && moduleTheme) {
      moduleTheme.setModuleThemeColor(tempThemeColor);
      moduleTheme.setModuleFont(tempFont);
      moduleTheme.setModuleBackgroundGradient(tempGradient);
      moduleTheme.saveChanges();
    } else {
      globalTheme.setThemeColor(tempThemeColor);
      try {
        localStorage.setItem("themeFont", tempFont);
        document.documentElement.style.fontFamily = tempFont;
      } catch (error) {
        console.error("Failed to save font to localStorage:", error);
      }
    }
    onClose();
  };

  const handleReset = () => {
    if (isModuleMode && moduleTheme) {
      moduleTheme.resetToDefaults();
    } else {
      setTempThemeColor(DEFAULT_THEME_COLOR);
      setTempFont(DEFAULT_FONT);
      globalTheme.setThemeColor(DEFAULT_THEME_COLOR);
      try {
        localStorage.removeItem("themeFont");
        document.documentElement.style.fontFamily = DEFAULT_FONT;
      } catch (error) {
        console.error("Failed to reset font:", error);
      }
    }
  };

  const handleCancel = () => {
    // Restore original values
    if (isModuleMode && moduleTheme) {
      moduleTheme.cancelPreview();
    } else {
      globalTheme.setThemeColor(originalThemeColor);
      document.documentElement.style.fontFamily = originalFont;
    }
    onClose();
  };

  const handleThemeColorChange = (color: string) => {
    setTempThemeColor(color);
    if (isModuleMode) {
      setTempGradient(`linear-gradient(135deg, ${color} 0%, #05070A 100%)`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          animation: "fadeIn 0.2s ease-out",
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "400px",
          maxWidth: "90vw",
          backgroundColor: "#1a1a1a",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.3)",
          animation: "slideInRight 0.3s ease-out",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#EDEDED", margin: 0, fontSize: "20px" }}>Settings</h2>
          <button
            onClick={handleCancel}
            style={{
              background: "none",
              border: "none",
              color: "#EDEDED",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Theme Color Selector */}
          <div>
            <label
              style={{
                display: "block",
                color: "#EDEDED",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Theme Color
            </label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="color"
                value={tempThemeColor}
                onChange={(e) => handleThemeColorChange(e.target.value)}
                style={{
                  width: "60px",
                  height: "40px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor: tempThemeColor,
                }}
              />
              <input
                type="text"
                value={tempThemeColor}
                onChange={(e) => handleThemeColorChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "#EDEDED",
                  fontSize: "14px",
                }}
                placeholder="#05070A"
              />
            </div>
          </div>

          {/* Font Selector */}
          <div>
            <label
              style={{
                display: "block",
                color: "#EDEDED",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Font Family
            </label>
            <select
              value={tempFont}
              onChange={(e) => setTempFont(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#EDEDED",
                fontSize: "14px",
                cursor: "pointer",
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

          {/* Background Gradient (Module Theme Only) */}
          {isModuleMode && (
            <div>
              <label
                style={{
                  display: "block",
                  color: "#EDEDED",
                  marginBottom: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Background Gradient
              </label>
              <input
                type="text"
                value={tempGradient}
                onChange={(e) => setTempGradient(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "#EDEDED",
                  fontSize: "14px",
                }}
                placeholder="linear-gradient(135deg, #05070A 0%, #05070A 100%)"
              />
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto", paddingTop: "24px" }}>
            <button
              onClick={handlePreview}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#EDEDED",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              Preview
            </button>
            
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4A90E2",
                border: "none",
                borderRadius: "6px",
                color: "#EDEDED",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#5a9ff2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4A90E2";
              }}
            >
              Save
            </button>
            
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#EDEDED",
                fontSize: "14px",
                fontWeight: "500",
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
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

