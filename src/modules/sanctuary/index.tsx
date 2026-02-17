import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import ModuleHoverPanel from "../../core/widgets/ModuleHoverPanel";
import MatrixTimerWidget from "../../core/widgets/MatrixTimerWidget";
import MediaModalWidget from "../../core/widgets/MediaModalWidget";
import TableWidget from "../../core/widgets/TableWidget";
import PlusCube from "../../core/widgets/PlusCube";
import "../../styles/cyberpunk.css";

function SanctuaryHomeContent() {
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
              <div className="module-header-left sanctuary-header-left">
                <div className="module-cube">
                  <span>🕊️</span>
                </div>
                <div />
              </div>
              <PlusCube moduleName="sanctuary" />
            </div>
            <div className="module-hover-panel">
              <ModuleHoverPanel moduleName="sanctuary" />
            </div>
          </div>
          <MatrixTimerWidget moduleName="sanctuary" />
          <MediaModalWidget moduleName="sanctuary" />
          <TableWidget moduleName="sanctuary" />
        </div>
      </div>
    </div>
  );
}

export default function SanctuaryHome() {
  return (
    <ModuleThemeProvider moduleName="sanctuary">
      <SanctuaryHomeContent />
    </ModuleThemeProvider>
  );
}
