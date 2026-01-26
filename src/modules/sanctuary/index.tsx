import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import { Dashboard } from "../../dashboards/Dashboard";
import { mockDashboard } from "../../dashboards/dashboard.mock";
import "../../styles/cyberpunk.css";

function SanctuaryHomeContent() {
  const {
    moduleBackgroundGradient,
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
  
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
    padding: 0,
    margin: 0,
    ["--module-bg" as string]: moduleBackgroundGradient,
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
          <div className="module-header">
            <div className="module-cube">
              <span>🕊️</span>
            </div>
            <div>
              <h1 className="module-title">Sanctuary</h1>
              <p className="module-subtitle">Spiritual Mode</p>
            </div>
          </div>
          <div className="module-section">
            <h2 className="module-section-title">Overview</h2>
            <Dashboard data={mockDashboard} />
          </div>
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
