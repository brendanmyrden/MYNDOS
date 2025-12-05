import { useState } from "react";
import { useTheme } from "../../core/state/ThemeContext";
import SettingsButton from "../../core/layout/SettingsButton";
import SettingsModal from "../../core/layout/SettingsModal";

export default function MYNDOS() {
  const { themeColor, setThemeColor } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  void themeColor;
  void setThemeColor;
  
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };
  
  return (
    <>
      <h1>MYND OS - Your Data, Your World</h1>
      <SettingsButton onClick={handleSettingsClick} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}