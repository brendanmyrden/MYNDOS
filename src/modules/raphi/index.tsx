import IntakeDashboard from "./IntakeDashboard";
import { useTheme } from "../../core/state/ThemeContext";
import ThemeButton from "../../core/layout/ThemeButton";

export default function RAPHiDashboard() {
  const { themeColor, setThemeColor } = useTheme();

  const gradient: React.CSSProperties = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #05070A 100%)`,
    minHeight: "100vh",
    padding: "24px",
    position: "relative"
  };

  return (
    <div style={gradient}>
      <ThemeButton onColorChange={setThemeColor} />
      <h1>RAPH(i) — Health Intelligence Dashboard</h1>
      <IntakeDashboard />
    </div>
  );
}