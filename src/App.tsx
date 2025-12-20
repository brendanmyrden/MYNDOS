import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./dashboards/Dashboard";
import { mockDashboard } from "./dashboards/dashboard.mock";


import Sidebar from "./core/navigation/Sidebar";

import SanctuaryHome from "./modules/sanctuary";
import TaskPillHome from "./modules/taskpill";
import RAPHiDashboard from "./modules/raphi";
import RAPHInputPanel from "./modules/raphi/RAPHInputPanel";
import MYRRYRHome from "./modules/myrryr";
import SYYRHome from "./modules/syyr";
import SettingsPage from "./modules/settings/index.tsx";


export default function App() {



  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    background: "#0B0F1A",
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
        {/* Temporary dashboard render */}
        <Dashboard data={mockDashboard} />

        <Routes>
          <Route path="/" element={<RAPHInputPanel />} />
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
