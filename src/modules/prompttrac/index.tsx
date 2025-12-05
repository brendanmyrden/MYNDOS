import { useState } from "react";
import { useTheme } from "../../core/state/ThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";

export default function PROMPTRACHome() {
  const { themeColor, setThemeColor } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  void themeColor;
  void setThemeColor;
  
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };
  
  return (
    <>
      <h1>PROMPTRAC - A way to track prompts    </h1>
      <SettingsButton onClick={handleSettingsClick} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}