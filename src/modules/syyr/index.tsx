import { useTheme } from "../../core/state/ThemeContext";

export default function SYYRHome() {
  const { themeColor, setThemeColor } = useTheme();
  void themeColor;
  void setThemeColor;
  
  return <h1>SYYR — Data, Strategy, & Foresight</h1>;
}