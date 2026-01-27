import { useState, useEffect, useContext } from "react";
import type { PointerEvent } from "react";
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
const DEFAULT_TEXT = "#eaf2ff";
const DEFAULT_MUTED = "rgba(234, 242, 255, 0.7)";
const DEFAULT_ACCENT = "#7df9ff";
const DEFAULT_ACCENT_2 = "#ff4fd8";
const DEFAULT_BORDER = "rgba(125, 249, 255, 0.2)";
const DEFAULT_GLASS = "rgba(14, 18, 32, 0.68)";
const DEFAULT_BUTTON_BG = "linear-gradient(135deg, #7df9ff 0%, #7a5cff 60%, #ff4fd8 100%)";
const DEFAULT_BUTTON_TEXT = "#070b15";
const DEFAULT_INPUT_BG = "rgba(6, 10, 20, 0.75)";
const DEFAULT_INPUT_BORDER = "rgba(125, 249, 255, 0.25)";
const DEFAULT_SIDEBAR_BUTTON_STYLE = "gradient";
const DEFAULT_SIDEBAR_BUTTON_PRIMARY = "#7df9ff";
const DEFAULT_SIDEBAR_BUTTON_SECONDARY = "#ff4fd8";
const DEFAULT_SIDEBAR_BUTTON_OUTLINE = "#7df9ff";

type SidebarButtonStyle = "solid" | "gradient";

function toHexColor(input: string) {
  if (input.startsWith("#")) {
    if (input.length === 4) {
      return `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`;
    }
    return input;
  }
  const match = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return "#ffffff";
  const r = Math.min(255, Math.max(0, Number(match[1])));
  const g = Math.min(255, Math.max(0, Number(match[2])));
  const b = Math.min(255, Math.max(0, Number(match[3])));
  return `#${[r, g, b].map((val) => val.toString(16).padStart(2, "0")).join("")}`;
}

export default function SettingsModal({ isOpen, onClose, useModuleTheme: useModule = false }: SettingsModalProps) {
  const globalTheme = useTheme();
  
  // Safely get module theme context (returns undefined if not in provider)
  const moduleThemeContext = useContext(ModuleThemeContext);
  const isModuleMode = useModule && moduleThemeContext !== undefined;
  const moduleTheme = isModuleMode ? moduleThemeContext : null;

  const [tempThemeColor, setTempThemeColor] = useState(
    isModuleMode ? moduleTheme!.moduleThemeColor : globalTheme.themeColor
  );
  const [tempFont, setTempFont] = useState(
    isModuleMode ? moduleTheme!.moduleFont : DEFAULT_FONT
  );
  const [tempGradient, setTempGradient] = useState(
    isModuleMode ? moduleTheme!.moduleBackgroundGradient : DEFAULT_GRADIENT
  );
  const [tempText, setTempText] = useState(
    isModuleMode ? moduleTheme!.moduleText : DEFAULT_TEXT
  );
  const [tempMuted, setTempMuted] = useState(
    isModuleMode ? moduleTheme!.moduleMuted : DEFAULT_MUTED
  );
  const [tempAccent, setTempAccent] = useState(
    isModuleMode ? moduleTheme!.moduleAccent : DEFAULT_ACCENT
  );
  const [tempAccent2, setTempAccent2] = useState(
    isModuleMode ? moduleTheme!.moduleAccent2 : DEFAULT_ACCENT_2
  );
  const [tempBorder, setTempBorder] = useState(
    isModuleMode ? moduleTheme!.moduleBorder : DEFAULT_BORDER
  );
  const [tempGlass, setTempGlass] = useState(
    isModuleMode ? moduleTheme!.moduleGlass : DEFAULT_GLASS
  );
  const [tempButtonBg, setTempButtonBg] = useState(
    isModuleMode ? moduleTheme!.moduleButtonBg : DEFAULT_BUTTON_BG
  );
  const [tempButtonText, setTempButtonText] = useState(
    isModuleMode ? moduleTheme!.moduleButtonText : DEFAULT_BUTTON_TEXT
  );
  const [tempInputBg, setTempInputBg] = useState(
    isModuleMode ? moduleTheme!.moduleInputBg : DEFAULT_INPUT_BG
  );
  const [tempInputBorder, setTempInputBorder] = useState(
    isModuleMode ? moduleTheme!.moduleInputBorder : DEFAULT_INPUT_BORDER
  );
  const [tempSidebarButtonStyle, setTempSidebarButtonStyle] = useState<SidebarButtonStyle>(
    isModuleMode ? moduleTheme!.sidebarButtonStyle : DEFAULT_SIDEBAR_BUTTON_STYLE
  );
  const [tempSidebarButtonPrimary, setTempSidebarButtonPrimary] = useState(
    isModuleMode ? moduleTheme!.sidebarButtonPrimary : DEFAULT_SIDEBAR_BUTTON_PRIMARY
  );
  const [tempSidebarButtonSecondary, setTempSidebarButtonSecondary] = useState(
    isModuleMode ? moduleTheme!.sidebarButtonSecondary : DEFAULT_SIDEBAR_BUTTON_SECONDARY
  );
  const [tempSidebarButtonOutline, setTempSidebarButtonOutline] = useState(
    isModuleMode ? moduleTheme!.sidebarButtonOutline : DEFAULT_SIDEBAR_BUTTON_OUTLINE
  );
  const [originalThemeColor, setOriginalThemeColor] = useState(
    isModuleMode ? moduleTheme!.moduleThemeColor : globalTheme.themeColor
  );
  const [originalFont, setOriginalFont] = useState(
    isModuleMode ? moduleTheme!.moduleFont : DEFAULT_FONT
  );
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);
  const [dockPosition, setDockPosition] = useState<"right" | "bottom">("right");
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
      setShowAdvancedColors(false);
      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
      if (isModuleMode) {
        setTempText(moduleTheme!.moduleText);
        setTempMuted(moduleTheme!.moduleMuted);
        setTempAccent(moduleTheme!.moduleAccent);
        setTempAccent2(moduleTheme!.moduleAccent2);
        setTempBorder(moduleTheme!.moduleBorder);
        setTempGlass(moduleTheme!.moduleGlass);
        setTempButtonBg(moduleTheme!.moduleButtonBg);
        setTempButtonText(moduleTheme!.moduleButtonText);
        setTempInputBg(moduleTheme!.moduleInputBg);
        setTempInputBorder(moduleTheme!.moduleInputBorder);
        setTempSidebarButtonStyle(moduleTheme!.sidebarButtonStyle);
        setTempSidebarButtonPrimary(moduleTheme!.sidebarButtonPrimary);
        setTempSidebarButtonSecondary(moduleTheme!.sidebarButtonSecondary);
        setTempSidebarButtonOutline(moduleTheme!.sidebarButtonOutline);
      }
    }
  }, [isOpen, isModuleMode, moduleTheme, globalTheme.themeColor]);

  const handlePreview = () => {
    if (isModuleMode && moduleTheme) {
      moduleTheme.setModuleThemeColor(tempThemeColor);
      moduleTheme.setModuleFont(tempFont);
      moduleTheme.setModuleBackgroundGradient(tempGradient);
      moduleTheme.setModuleColors({
        moduleText: tempText,
        moduleMuted: tempMuted,
        moduleAccent: tempAccent,
        moduleAccent2: tempAccent2,
        moduleBorder: tempBorder,
        moduleGlass: tempGlass,
        moduleButtonBg: tempButtonBg,
        moduleButtonText: tempButtonText,
        moduleInputBg: tempInputBg,
        moduleInputBorder: tempInputBorder,
      });
      moduleTheme.setSidebarButtonTheme({
        sidebarButtonStyle: tempSidebarButtonStyle,
        sidebarButtonPrimary: tempSidebarButtonPrimary,
        sidebarButtonSecondary: tempSidebarButtonSecondary,
        sidebarButtonOutline: tempSidebarButtonOutline,
      });
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
      moduleTheme.setModuleColors({
        moduleText: tempText,
        moduleMuted: tempMuted,
        moduleAccent: tempAccent,
        moduleAccent2: tempAccent2,
        moduleBorder: tempBorder,
        moduleGlass: tempGlass,
        moduleButtonBg: tempButtonBg,
        moduleButtonText: tempButtonText,
        moduleInputBg: tempInputBg,
        moduleInputBorder: tempInputBorder,
      });
      moduleTheme.setSidebarButtonTheme({
        sidebarButtonStyle: tempSidebarButtonStyle,
        sidebarButtonPrimary: tempSidebarButtonPrimary,
        sidebarButtonSecondary: tempSidebarButtonSecondary,
        sidebarButtonOutline: tempSidebarButtonOutline,
      });
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
      setTempThemeColor(DEFAULT_THEME_COLOR);
      setTempFont(DEFAULT_FONT);
      setTempGradient(DEFAULT_GRADIENT);
      setTempText(DEFAULT_TEXT);
      setTempMuted(DEFAULT_MUTED);
      setTempAccent(DEFAULT_ACCENT);
      setTempAccent2(DEFAULT_ACCENT_2);
      setTempBorder(DEFAULT_BORDER);
      setTempGlass(DEFAULT_GLASS);
      setTempButtonBg(DEFAULT_BUTTON_BG);
      setTempButtonText(DEFAULT_BUTTON_TEXT);
      setTempInputBg(DEFAULT_INPUT_BG);
      setTempInputBorder(DEFAULT_INPUT_BORDER);
      setTempSidebarButtonStyle(DEFAULT_SIDEBAR_BUTTON_STYLE);
      setTempSidebarButtonPrimary(DEFAULT_SIDEBAR_BUTTON_PRIMARY);
      setTempSidebarButtonSecondary(DEFAULT_SIDEBAR_BUTTON_SECONDARY);
      setTempSidebarButtonOutline(DEFAULT_SIDEBAR_BUTTON_OUTLINE);
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


  const colorFields = isModuleMode
    ? [
        { label: "Text", value: tempText, setValue: setTempText, placeholder: DEFAULT_TEXT },
        { label: "Muted Text", value: tempMuted, setValue: setTempMuted, placeholder: DEFAULT_MUTED },
        { label: "Accent", value: tempAccent, setValue: setTempAccent, placeholder: DEFAULT_ACCENT },
        { label: "Accent 2", value: tempAccent2, setValue: setTempAccent2, placeholder: DEFAULT_ACCENT_2 },
        { label: "Border", value: tempBorder, setValue: setTempBorder, placeholder: DEFAULT_BORDER },
        { label: "Glass", value: tempGlass, setValue: setTempGlass, placeholder: DEFAULT_GLASS },
        { label: "Button Background", value: tempButtonBg, setValue: setTempButtonBg, placeholder: DEFAULT_BUTTON_BG },
        { label: "Button Text", value: tempButtonText, setValue: setTempButtonText, placeholder: DEFAULT_BUTTON_TEXT },
        { label: "Input Background", value: tempInputBg, setValue: setTempInputBg, placeholder: DEFAULT_INPUT_BG },
        { label: "Input Border", value: tempInputBorder, setValue: setTempInputBorder, placeholder: DEFAULT_INPUT_BORDER },
      ]
    : [];

  if (!isOpen) return null;

  const isDragging = dragStart !== null;
  const panelStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1a1a1a",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
    transition: isDragging ? "none" : "transform 0.2s ease, width 0.2s ease, height 0.2s ease",
    transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : "none",
  };

  if (dockPosition === "right") {
    panelStyle.top = 0;
    panelStyle.right = 0;
    panelStyle.bottom = 0;
    panelStyle.width = "400px";
    panelStyle.maxWidth = "90vw";
    panelStyle.borderLeft = "1px solid rgba(255, 255, 255, 0.1)";
    panelStyle.boxShadow = "-4px 0 24px rgba(0, 0, 0, 0.3)";
    panelStyle.animation = "slideInRight 0.3s ease-out";
  } else {
    panelStyle.left = 0;
    panelStyle.right = 0;
    panelStyle.bottom = 0;
    panelStyle.height = "45vh";
    panelStyle.minHeight = "320px";
    panelStyle.maxHeight = "70vh";
    panelStyle.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
    panelStyle.boxShadow = "0 -6px 24px rgba(0, 0, 0, 0.35)";
    panelStyle.animation = "slideInUp 0.3s ease-out";
  }

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ x: event.clientX, y: event.clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setDragOffset({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const shouldDockBottom = event.clientY > window.innerHeight * 0.55;
    setDockPosition(shouldDockBottom ? "bottom" : "right");
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  };

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
      <div style={panelStyle}>
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
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
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          {/* Base Theme */}
          <div>
            <div
              style={{
                color: "#EDEDED",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Base Theme
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
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
                    minWidth: 0,
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

              <div>
                <label
                  style={{
                    display: "block",
                    color: "#EDEDED",
                    marginBottom: "10px",
                    fontSize: "13px",
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
            </div>
          </div>

          {/* Background Gradient (Module Theme Only) */}
          {isModuleMode && (
            <div>
              <label
                style={{
                  display: "block",
                  color: "#EDEDED",
                  marginBottom: "10px",
                  fontSize: "13px",
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
                  minWidth: 0,
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

          {/* Sidebar Button Theme (Module Theme Only) */}
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
                Sidebar Button Theme
              </label>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  {(["solid", "gradient"] as SidebarButtonStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTempSidebarButtonStyle(style)}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border:
                          tempSidebarButtonStyle === style
                            ? "1px solid rgba(125, 249, 255, 0.8)"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                        background:
                          tempSidebarButtonStyle === style
                            ? "linear-gradient(135deg, rgba(125, 249, 255, 0.9), rgba(255, 79, 216, 0.8))"
                            : "rgba(255, 255, 255, 0.05)",
                        color: tempSidebarButtonStyle === style ? "#070b15" : "#EDEDED",
                        cursor: "pointer",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      display: "grid",
                      gap: "8px",
                      color: "#EDEDED",
                      fontSize: "12px",
                    }}
                  >
                    Primary
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={toHexColor(tempSidebarButtonPrimary)}
                        onChange={(e) => setTempSidebarButtonPrimary(e.target.value)}
                        style={{
                          width: "60px",
                          height: "36px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: toHexColor(tempSidebarButtonPrimary),
                        }}
                      />
                      <input
                        type="text"
                        value={tempSidebarButtonPrimary}
                        onChange={(e) => setTempSidebarButtonPrimary(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: "8px 10px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          color: "#EDEDED",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                  </label>

                  {tempSidebarButtonStyle === "gradient" ? (
                    <label
                      style={{
                        display: "grid",
                        gap: "8px",
                        color: "#EDEDED",
                        fontSize: "12px",
                      }}
                    >
                      Secondary
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="color"
                          value={toHexColor(tempSidebarButtonSecondary)}
                          onChange={(e) => setTempSidebarButtonSecondary(e.target.value)}
                          style={{
                            width: "60px",
                            height: "36px",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor: toHexColor(tempSidebarButtonSecondary),
                          }}
                        />
                        <input
                          type="text"
                          value={tempSidebarButtonSecondary}
                          onChange={(e) => setTempSidebarButtonSecondary(e.target.value)}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "8px 10px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "6px",
                            color: "#EDEDED",
                            fontSize: "13px",
                          }}
                        />
                      </div>
                    </label>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(234, 242, 255, 0.6)",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Solid mode uses only the primary color.
                    </div>
                  )}
                </div>

                <label
                  style={{
                    display: "grid",
                    gap: "8px",
                    color: "#EDEDED",
                    fontSize: "12px",
                  }}
                >
                  Outline / Glow
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={toHexColor(tempSidebarButtonOutline)}
                      onChange={(e) => setTempSidebarButtonOutline(e.target.value)}
                      style={{
                        width: "60px",
                        height: "36px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: toHexColor(tempSidebarButtonOutline),
                      }}
                    />
                    <input
                      type="text"
                      value={tempSidebarButtonOutline}
                      onChange={(e) => setTempSidebarButtonOutline(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        padding: "8px 10px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        color: "#EDEDED",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Color Overrides (Module Theme Only) */}
          {isModuleMode && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#EDEDED", fontSize: "14px", fontWeight: "500" }}>
                  Advanced Color Overrides
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdvancedColors((prev) => !prev)}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#EDEDED",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                  }}
                >
                  {showAdvancedColors ? "Hide" : "Show"}
                </button>
              </div>
              {showAdvancedColors && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {colorFields.map((field) => (
                    <div
                      key={field.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(100px, 120px) 60px minmax(0, 1fr)",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#EDEDED", fontSize: "12px" }}>{field.label}</span>
                      <input
                        type="color"
                        value={toHexColor(field.value)}
                        onChange={(e) => field.setValue(e.target.value)}
                        style={{
                          width: "60px",
                          height: "36px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: toHexColor(field.value),
                        }}
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        style={{
                          padding: "8px 10px",
                          minWidth: 0,
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          color: "#EDEDED",
                          fontSize: "13px",
                        }}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              )}
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

        @keyframes slideInUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
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
