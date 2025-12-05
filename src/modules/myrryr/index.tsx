import { useTheme } from "../../core/state/ThemeContext";

export default function MYRRYRHome() {
  const { themeColor, setThemeColor } = useTheme();
  void themeColor;
  void setThemeColor;
  
  return <h1>MYRRYR - Music Prod. + Versions + Brand</h1>;
}