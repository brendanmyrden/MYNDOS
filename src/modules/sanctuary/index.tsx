import { useTheme } from "../../core/state/ThemeContext";

export default function SanctuaryHome() {
  const { themeColor, setThemeColor } = useTheme();
  void themeColor;
  void setThemeColor;
  
  return <h1>Sanctuary - Spiritual Mode</h1>;
}