import { useTheme } from "../../core/state/ThemeContext";

export default function TaskPillHome() {
  const { themeColor, setThemeColor } = useTheme();
  void themeColor;
  void setThemeColor;
  
  return <h1>TaskPill - Habits + Tracking</h1>;
}