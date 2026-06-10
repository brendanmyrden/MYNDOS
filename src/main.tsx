import React from "react";
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./core/state/ThemeContext";
import {
  installOverlayDebugWatchdog,
  installPointerDebug,
} from "./debug/overlayDebug";

if (import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search);
  if (params.has("debugPointer")) {
    installPointerDebug();
    installOverlayDebugWatchdog();
  }
  if (params.has("debugOverlay")) {
    installOverlayDebugWatchdog();
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
