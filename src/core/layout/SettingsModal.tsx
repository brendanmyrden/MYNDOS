import { useState, useEffect } from "react";
import { useTheme } from "../state/ThemeContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_THEME_COLOR = "#05070A";
const DEFAULT_FONT = "system-ui, -apple-system, sans-serif";

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { themeColor, setThemeColor } = useTheme();
  const [tempThemeColor, setTempThemeColor] = useState(themeColor);
  const [tempFont, setTempFont] = useState(DEFAULT_FONT);
  const [originalThemeColor, setOriginalThemeColor] = useState(themeColor);
  const [originalFont, setOriginalFont] = useState(DEFAULT_FONT);

  // Load saved font from localStorage
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("themeFont");
      if (savedFont) {
        setTempFont(savedFont);
        setOriginalFont(savedFont);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Reset temp values when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempThemeColor(themeColor);
      setOriginalThemeColor(themeColor);
      try {
        const savedFont = localStorage.getItem("themeFont") || DEFAULT_FONT;
        setTempFont(savedFont);
        setOriginalFont(savedFont);
      } catch {
        setTempFont(DEFAULT_FONT);
        setOriginalFont(DEFAULT_FONT);
      }
    }
  }, [isOpen, themeColor]);

  const handlePreview = () => {
    setThemeColor(tempThemeColor);
    document.documentElement.style.fontFamily = tempFont;
  };

  const handleSave = () => {
    setThemeColor(tempThemeColor);
    try {
      localStorage.setItem("themeFont", tempFont);
      document.documentElement.style.fontFamily = tempFont;
    } catch (error) {
      console.error("Failed to save font to localStorage:", error);
    }
    onClose();
  };

  const handleReset = () => {
    setTempThemeColor(DEFAULT_THEME_COLOR);
    setTempFont(DEFAULT_FONT);
    setThemeColor(DEFAULT_THEME_COLOR);
    try {
      localStorage.removeItem("themeFont");
      document.documentElement.style.fontFamily = DEFAULT_FONT;
    } catch (error) {
      console.error("Failed to reset font:", error);
    }
  };

  const handleCancel = () => {
    // Restore original values
    setThemeColor(originalThemeColor);
    document.documentElement.style.fontFamily = originalFont;
    onClose();
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
                onChange={(e) => setTempThemeColor(e.target.value)}
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
                onChange={(e) => setTempThemeColor(e.target.value)}
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

