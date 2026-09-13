import React from "react";
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./core/state/ThemeContext";
import RuntimeErrorBoundary from "./core/RuntimeErrorBoundary";
import { initializeTheme } from "./core/theme/themeEngine";
import {
  installOverlayDebugWatchdog,
  installPointerDebug,
} from "./debug/overlayDebug";

initializeTheme();

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

const rootElement = document.getElementById("root");

if (!rootElement) {
  const fallback = document.createElement("main");
  fallback.textContent = "MYNDOS could not find the React root. Restart the Vite dev server.";
  fallback.style.minHeight = "100vh";
  fallback.style.display = "grid";
  fallback.style.placeItems = "center";
  fallback.style.background = "var(--bg-raised)";
  fallback.style.color = "var(--text)";
  fallback.style.fontFamily = "var(--font-family)";
  fallback.style.padding = "24px";
  fallback.style.textAlign = "center";
  document.body.replaceChildren(fallback);
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RuntimeErrorBoundary>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </RuntimeErrorBoundary>
    </React.StrictMode>
  );
}
