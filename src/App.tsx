import { Routes, Route } from "react-router-dom";
import Sidebar from "./core/navigation/Sidebar";
import SanctuaryHome from "./modules/sanctuary";
import TaskPillHome from "./modules/taskpill";
import RAPHiDashboard from "./modules/raphi";
import MYRRYRHome from "./modules/myrryr";
import SYYRHome from "./modules/syyr";
import SettingsPage from "./modules/settings/index.tsx";
import MYNDOS from "./modules/myndos";
import StreamsHome from "./modules/streams";

export default function App() {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100%",
    background: "#0B0F1A",
    color: "#EDEDED",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
  };

  return (
    <div style={containerStyle}>
      <Sidebar />
      <div style={contentStyle}>
        <Routes>
          <Route path="/" element={<RAPHiDashboard />} />
          <Route path="/myndos" element={<MYNDOS />} />
          <Route path="/sanctuary" element={<SanctuaryHome />} />
          <Route path="/taskpill" element={<TaskPillHome />} />
          <Route path="/raphi" element={<RAPHiDashboard />} />
          <Route path="/myrryr" element={<MYRRYRHome />} />
          <Route path="/syyr" element={<SYYRHome />} />
          <Route path="/streams" element={<StreamsHome />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}
