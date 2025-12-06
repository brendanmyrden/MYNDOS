import { useState } from "react";
import IntakeDashboard from "./IntakeDashboard";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";

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
    background: moduleBackgroundGradient,
    fontFamily: moduleFont,
    position: "relative",
    padding: 0,
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <SettingsButton onClick={handleSettingsClick} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        useModuleTheme={true}
      />
      <div style={{ padding: "24px" }}>
        <h1>RAPH(i) — Health Intelligence Dashboard</h1>
        <IntakeDashboard />
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