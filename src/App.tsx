import { Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./core/navigation/Sidebar";
import HomeScreenGrid from "./core/navigation/HomeScreenGrid";
import { getHomescreenCubed } from "./core/navigation/homescreen";
import { getDefaultModule, getEnabledModuleRoutes } from "./modules/registry";
import type { ModuleRouteDefinition } from "./modules/types";

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

const renderModuleElement = (route: ModuleRouteDefinition) => {
  if ("redirectTo" in route) {
    return <Navigate to={route.redirectTo} replace />;
  }

  const ModuleComponent = route.component;
  return <ModuleComponent />;
};

export default function App() {
  const [homescreenCubed, setHomescreenCubed] = useState(() => getHomescreenCubed());
  const moduleRoutes = useMemo(() => getEnabledModuleRoutes(), []);
  const defaultModule = useMemo(() => getDefaultModule(), []);
  const defaultPath = defaultModule?.navigation.path ?? "/";
  const defaultRouteElement = useMemo(() => {
    if (!defaultModule) return routeFallback;
    const DefaultModuleComponent = defaultModule.component;
    return <DefaultModuleComponent />;
  }, [defaultModule]);

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
              <Route path="/" element={defaultRouteElement} />
              {moduleRoutes.map((route) => (
                <Route key={route.id} path={route.path} element={renderModuleElement(route)} />
              ))}
              <Route path="*" element={<Navigate to={defaultPath} replace />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </div>
  );
}
