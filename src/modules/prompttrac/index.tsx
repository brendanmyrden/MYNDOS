import { useTheme } from "../../core/state/ThemeContext";

export default function PROMPTRACHome() {
  const { themeColor, setThemeColor } = useTheme();
  void themeColor;
  void setThemeColor;
  
  return <h1>PROMPTRAC - A way to track prompts    </h1>;
}