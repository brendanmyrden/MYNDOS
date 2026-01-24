import { useState } from "react";
import IntakeDashboard from "./IntakeDashboard";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";
import "../../styles/cyberpunk.css";

function RAPHiDashboardContent() {
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
    ["--raphi-bg" as string]: moduleBackgroundGradient,
    ["--raphi-font" as string]: moduleFont,
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
          <div className="raphi-header">
            <div className="raphi-cube">
              <span>🧬</span>
            </div>
            <div>
              <h1 className="raphi-title">RAPH[i]</h1>
              <p className="raphi-subtitle">Health Intelligence Dashboard</p>
            </div>
          </div>
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
