import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import ModuleHoverPanel from "../../core/widgets/ModuleHoverPanel";
import MatrixTimerWidget from "../../core/widgets/MatrixTimerWidget";
import MediaModalWidget from "../../core/widgets/MediaModalWidget";
import TableWidget from "../../core/widgets/TableWidget";
import PlusCube from "../../core/widgets/PlusCube";
import ModuleCube from "../../core/widgets/ModuleCube";
import "../../styles/cyberpunk.css";

function PROMPTRACHomeContent() {
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
              <div className="module-header-left">
                <ModuleCube moduleName="prompttrac" defaultEmoji="✍️" />
                <div>
                  <h1 className="module-title">PROMPTRAC</h1>
                  <p className="module-subtitle">A way to track prompts</p>
                </div>
              </div>
              <PlusCube moduleName="prompttrac" />
            </div>
            <div className="module-hover-panel">
              <ModuleHoverPanel moduleName="prompttrac" />
            </div>
          </div>
          <MatrixTimerWidget moduleName="prompttrac" />
          <MediaModalWidget moduleName="prompttrac" />
          <TableWidget moduleName="prompttrac" />
        </div>
      </div>
    </div>
  );
}

export default function PROMPTRACHome() {
  return (
    <ModuleThemeProvider moduleName="prompttrac">
      <PROMPTRACHomeContent />
    </ModuleThemeProvider>
  );
}
