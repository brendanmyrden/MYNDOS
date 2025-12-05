import { Routes, Route } from "react-router-dom";
import Sidebar from "./core/navigation/Sidebar.tsx";

import SanctuaryHome from "./modules/sanctuary/index";
import TaskPillHome from "./modules/taskpill/index";
import RAPHiDashboard from "./modules/raphi/index";
import MyrryrHome from "./modules/myrryr/index";
import SYYRHome from "./modules/syyr/index";

export default function App() {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <Routes>
          <Route path="/sanctuary" element={<SanctuaryHome />} />
          <Route path="/taskpill" element={<TaskPillHome />} />
          <Route path="/raphi" element={<RAPHiDashboard />} />
          <Route path="/myrryr" element={<MyrryrHome />} />
          <Route path="/syyr" element={<SYYRHome />} />
          <Route path="*" element={<SanctuaryHome />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#05070A",
    color: "#EDEDED",
  },
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto" as const,
  },
};