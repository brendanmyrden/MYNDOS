import { useState } from "react";
import IntakeDashboard from "./IntakeDashboard";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import ModuleHoverPanel from "../../core/widgets/ModuleHoverPanel";
import MatrixTimerWidget from "../../core/widgets/MatrixTimerWidget";
import MediaModalWidget from "../../core/widgets/MediaModalWidget";
import TableWidget from "../../core/widgets/TableWidget";
import "../../styles/cyberpunk.css";

function RAPHiDashboardContent() {
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
    ["--raphi-bg" as string]: moduleBackgroundGradient,
    ["--module-plus-bg" as string]: plusBackground,
    ["--raphi-font" as string]: moduleFont,
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
    <div style={containerStyle} className="raphi-shell">
      <div className="raphi-content">
      <SettingsButton onClick={handleSettingsClick} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        useModuleTheme={true}
      />
        <div className="raphi-card">
          <div className="raphi-header-stack">
            <div className="raphi-header raphi-header-group">
              <div className="raphi-header-left">
                <div className="raphi-cube">
                  <span>🧬</span>
                </div>
                <div>
                  <h1 className="raphi-title">RAPH[i]</h1>
                  <p className="raphi-subtitle">Health Intelligence Dashboard</p>
                </div>
              </div>
              <div className="raphi-plus-cube" aria-hidden="true">
                <span>+</span>
              </div>
            </div>
            <div className="raphi-hover-panel">
              <ModuleHoverPanel moduleName="raphi" />
            </div>
          </div>
          <MatrixTimerWidget moduleName="raphi" />
          <MediaModalWidget moduleName="raphi" />
          <TableWidget moduleName="raphi" />
          <IntakeDashboard />
        </div>
      </div>
    </div>
  );
}

export default function RAPHiDashboard() {
  return (
    <ModuleThemeProvider moduleName="raphi">
      <RAPHiDashboardContent />
    </ModuleThemeProvider>
  );
}
