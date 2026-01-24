import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import "../../styles/cyberpunk.css";

function SettingsContent() {
  const { moduleBackgroundGradient, moduleFont } = useModuleTheme();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
    padding: 0,
    margin: 0,
    ["--module-bg" as string]: moduleBackgroundGradient,
    ["--module-font" as string]: moduleFont,
  };

  return (
    <div style={containerStyle} className="module-shell">
      <div className="module-content">
        <div className="module-card">
          <div className="module-header">
            <div className="module-cube">
              <span>⚙️</span>
            </div>
            <div>
              <h1 className="module-title">Settings</h1>
              <p className="module-subtitle">Preferences + Themes</p>
            </div>
          </div>
          <div className="module-section">
            <h2 className="module-section-title">Configuration</h2>
            <p className="module-muted">Settings UI will live here. Theme controls are available from any module via the floating button.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ModuleThemeProvider moduleName="settings">
      <SettingsContent />
    </ModuleThemeProvider>
  );
}
