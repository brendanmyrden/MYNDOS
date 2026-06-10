import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./core/navigation/Sidebar";
import HomeScreenGrid from "./core/navigation/HomeScreenGrid";
import { getHomescreenCubed } from "./core/navigation/homescreen";

const SanctuaryHome = lazy(() => import("./modules/sanctuary"));
const TaskPillHome = lazy(() => import("./modules/taskpill"));
const RAPHiDashboard = lazy(() => import("./modules/raphi"));
const MYRRYRHome = lazy(() => import("./modules/myrryr"));
const SYYRHome = lazy(() => import("./modules/syyr"));
const NumbersStarsSignsHome = lazy(() => import("./modules/numbers-stars-signs"));
const SettingsPage = lazy(() => import("./modules/settings/index.tsx"));
const MYNDOS = lazy(() => import("./modules/myndos"));
const StreamsHome = lazy(() => import("./modules/streams"));
const TradeCorePage = lazy(() => import("./modules/streams/TradeCore"));
const TradeInterfaceRoot = lazy(() => import("./modules/streams/TradeInterfaceRoot"));

const routeFallback = (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      minHeight: "100%",
      color: "#EDEDED",
      background: "#0B0F1A",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    Loading module
  </div>
);

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
          <Suspense fallback={routeFallback}>
            <Routes>
              <Route path="/" element={<RAPHiDashboard />} />
              <Route path="/myndos" element={<MYNDOS />} />
              <Route path="/sanctuary" element={<SanctuaryHome />} />
              <Route path="/taskpill" element={<TaskPillHome />} />
              <Route path="/raphi" element={<RAPHiDashboard />} />
              <Route path="/myrryr" element={<MYRRYRHome />} />
              <Route path="/syyr" element={<SYYRHome />} />
              <Route path="/numbers-stars-signs" element={<NumbersStarsSignsHome />} />
              <Route path="/streams" element={<StreamsHome />} />
              <Route path="/streams-of-strategy" element={<Navigate to="/streams" replace />} />
              <Route path="/streams/trade-core" element={<TradeCorePage />} />
              <Route path="/streams/trade-interface" element={<TradeInterfaceRoot />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </div>
  );
}
