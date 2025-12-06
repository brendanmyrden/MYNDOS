import { useState } from "react";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";

function TaskPillHomeContent() {
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
        <h1>TaskPill - Habits + Tracking</h1>
      </div>
    </div>
  );
}

export default function TaskPillHome() {
  return (
    <ModuleThemeProvider moduleName="taskpill">
      <TaskPillHomeContent />
    </ModuleThemeProvider>
  );
}