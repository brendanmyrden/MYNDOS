import { useState } from "react";
import IntakeDashboard from "./IntakeDashboard";
import { useTheme } from "../../core/state/ThemeContext";
import ThemeButton from "../../core/layout/ThemeButton";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";

export default function RAPHiDashboard() {
  const { themeColor, setThemeColor } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const gradient: React.CSSProperties = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #05070A 100%)`,
    minHeight: "100vh",
    padding: "24px",
    position: "relative"
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div style={gradient}>
      <ThemeButton onColorChange={setThemeColor} />
      <SettingsButton onClick={handleSettingsClick} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <h1>RAPH(i) — Health Intelligence Dashboard</h1>
      <IntakeDashboard />
    </div>
  );
}