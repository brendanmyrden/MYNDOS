import { Routes, Route } from "react-router-dom";
import { useTheme } from "./core/state/ThemeContext";

import Sidebar from "./core/navigation/Sidebar";

import SanctuaryHome from "./modules/sanctuary";
import TaskPillHome from "./modules/taskpill";
import RAPHiDashboard from "./modules/raphi";
import MYRRYRHome from "./modules/myrryr";
import SYYRHome from "./modules/syyr";
import SettingsPage from "./modules/settings/index.tsx";

export default function App() {
  const { themeColor } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    background: themeColor,
    color: "#EDEDED",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
  };

  return (
    <div style={containerStyle}>
      <Sidebar />

      <div style={contentStyle}>
        <Routes>
          <Route path="/" element={<SanctuaryHome />} />
          <Route path="/sanctuary" element={<SanctuaryHome />} />

          <Route path="/taskpill" element={<TaskPillHome />} />

          <Route path="/raphi" element={<RAPHiDashboard />} />

          <Route path="/myrryr" element={<MYRRYRHome />} />

          <Route path="/syyr" element={<SYYRHome />} />

          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}
