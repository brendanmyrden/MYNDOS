import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import { Dashboard } from "../../dashboards/Dashboard";
import { mockDashboard } from "../../dashboards/dashboard.mock";
import "../../styles/cyberpunk.css";

function SYYRHomeContent() {
  const { moduleBackgroundGradient, moduleFont } = useModuleTheme();
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
              <span>🔮</span>
            </div>
            <div>
              <h1 className="module-title">SYYR</h1>
              <p className="module-subtitle">Data, Strategy, & Foresight</p>
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

export default function SYYRHome() {
  return (
    <ModuleThemeProvider moduleName="syyr">
      <SYYRHomeContent />
    </ModuleThemeProvider>
  );
}
