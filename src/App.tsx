import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./core/navigation/Sidebar";
import HomeScreenGrid from "./core/navigation/HomeScreenGrid";
import { getHomescreenCubed } from "./core/navigation/homescreen";
import SanctuaryHome from "./modules/sanctuary";
import TaskPillHome from "./modules/taskpill";
import RAPHiDashboard from "./modules/raphi";
import MYRRYRHome from "./modules/myrryr";
import SYYRHome from "./modules/syyr";
import SettingsPage from "./modules/settings/index.tsx";
import MYNDOS from "./modules/myndos";
import StreamsHome from "./modules/streams";

export default function App() {
  const [homescreenCubed, setHomescreenCubed] = useState(() => getHomescreenCubed());

  useEffect(() => {
    const handleChange = () => setHomescreenCubed(getHomescreenCubed());
    window.addEventListener("homescreen-cubed-change", handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("homescreen-cubed-change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

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
      {!homescreenCubed && <Sidebar />}
      <div style={contentStyle}>
        {homescreenCubed ? (
          <HomeScreenGrid />
        ) : (
          <Routes>
            <Route path="/" element={<RAPHiDashboard />} />
            <Route path="/myndos" element={<MYNDOS />} />
            <Route path="/sanctuary" element={<SanctuaryHome />} />
            <Route path="/taskpill" element={<TaskPillHome />} />
            <Route path="/raphi" element={<RAPHiDashboard />} />
            <Route path="/myrryr" element={<MYRRYRHome />} />
            <Route path="/syyr" element={<SYYRHome />} />
            <Route path="/streams" element={<StreamsHome />} />
            <Route path="/streams-of-strategy" element={<Navigate to="/streams" replace />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
