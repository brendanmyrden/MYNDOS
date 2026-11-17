import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import ModuleHoverPanel from "../../core/widgets/ModuleHoverPanel";
import MatrixTimerWidget from "../../core/widgets/MatrixTimerWidget";
import MediaBoardWidget from "../../core/widgets/MediaBoardWidget";
import TableWidget from "../../core/widgets/TableWidget";
import PlusCube from "../../core/widgets/PlusCube";
import ModuleCube from "../../core/widgets/ModuleCube";
import { setSidebarButtonLayout, useSidebarButtonLayout } from "../../core/navigation/sidebarLayout";
import "../../styles/cyberpunk.css";
import "./SettingsPage.css";

function SettingsContent() {
  const {
    moduleBackgroundGradient,
    modulePlusMatchBackground,
    modulePlusColor,
    moduleFont,
    moduleText,
    moduleMuted,
    moduleAccent,
    moduleAccent2,
    moduleBorder,
    moduleGlass,
    moduleButtonBg,
    moduleButtonText,
    moduleInputBg,
    moduleInputBorder,
  } = useModuleTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const buttonLayout = useSidebarButtonLayout();

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const plusBackground = modulePlusMatchBackground ? moduleBackgroundGradient : modulePlusColor;
  
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
    padding: 0,
    margin: 0,
    ["--module-bg" as string]: moduleBackgroundGradient,
    ["--module-plus-bg" as string]: plusBackground,
    ["--module-font" as string]: moduleFont,
    ["--raphi-text" as string]: moduleText,
    ["--raphi-muted" as string]: moduleMuted,
    ["--raphi-accent" as string]: moduleAccent,
    ["--raphi-accent-2" as string]: moduleAccent2,
    ["--raphi-border" as string]: moduleBorder,
    ["--raphi-glass" as string]: moduleGlass,
    ["--raphi-button-bg" as string]: moduleButtonBg,
    ["--raphi-button-text" as string]: moduleButtonText,
    ["--raphi-input-bg" as string]: moduleInputBg,
    ["--raphi-input-border" as string]: moduleInputBorder,
  };

  return (
    <div style={containerStyle} className="module-shell">
      <div className="module-content">
        <SettingsButton onClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          useModuleTheme={true}
        />
        <div className="module-card">
          <div className="module-header-stack">
            <div className="module-header module-header-group">
              <div className="module-header-left">
                <ModuleCube moduleName="settings" defaultEmoji="⚙️" />
                <div>
                  <h1 className="module-title">Settings</h1>
                  <p className="module-subtitle">Preferences + Themes</p>
                </div>
              </div>
              <PlusCube moduleName="settings" />
            </div>
            <div className="module-hover-panel">
              <ModuleHoverPanel moduleName="settings" />
            </div>
          </div>
          <div className="module-section">
            <h2 className="module-section-title">Sidebar buttons</h2>
            <p className="module-muted">Choose how the module buttons appear in the sidebar.</p>
            <div className="settings-sidebar-layout" role="group" aria-label="Sidebar button layout">
              <button
                type="button"
                className={`settings-sidebar-layout__option${buttonLayout === "compact" ? " is-selected" : ""}`}
                aria-pressed={buttonLayout === "compact"}
                onClick={() => setSidebarButtonLayout("compact")}
              >
                <span className="settings-sidebar-layout__icon" aria-hidden="true">▦</span>
                <span>Compact grid<small>Two columns</small></span>
              </button>
              <button
                type="button"
                className={`settings-sidebar-layout__option${buttonLayout === "list" ? " is-selected" : ""}`}
                aria-pressed={buttonLayout === "list"}
                onClick={() => setSidebarButtonLayout("list")}
              >
                <span className="settings-sidebar-layout__icon" aria-hidden="true">☰</span>
                <span>Wide list<small>One button per row</small></span>
              </button>
            </div>
          </div>
          <MatrixTimerWidget moduleName="settings" />
          <MediaBoardWidget moduleName="settings" />
          <TableWidget moduleName="settings" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ModuleThemeProvider moduleName="settings">
      <SettingsContent />
    </ModuleThemeProvider>
  );
}
