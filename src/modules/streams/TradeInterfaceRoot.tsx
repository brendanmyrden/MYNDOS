import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import "../../styles/cyberpunk.css";

function TradeInterfaceContent() {
  const {
    moduleBackgroundGradient,
    modulePlusMatchBackground,
    modulePlusColor,
    moduleFont,
    moduleText,
    moduleMuted,
    moduleAccent,
    moduleAccent2,
    moduleBorder,
    moduleGlass,
    moduleButtonBg,
    moduleButtonText,
    moduleInputBg,
    moduleInputBorder,
  } = useModuleTheme();

  const plusBackground = modulePlusMatchBackground ? moduleBackgroundGradient : modulePlusColor;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
    padding: 0,
    margin: 0,
    ["--module-bg" as string]: moduleBackgroundGradient,
    ["--module-plus-bg" as string]: plusBackground,
    ["--module-font" as string]: moduleFont,
    ["--raphi-text" as string]: moduleText,
    ["--raphi-muted" as string]: moduleMuted,
    ["--raphi-accent" as string]: moduleAccent,
    ["--raphi-accent-2" as string]: moduleAccent2,
    ["--raphi-border" as string]: moduleBorder,
    ["--raphi-glass" as string]: moduleGlass,
    ["--raphi-button-bg" as string]: moduleButtonBg,
    ["--raphi-button-text" as string]: moduleButtonText,
    ["--raphi-input-bg" as string]: moduleInputBg,
    ["--raphi-input-border" as string]: moduleInputBorder,
  };

  return (
    <div style={containerStyle} className="module-shell trade-interface-shell">
      <div className="module-content trade-interface-content">
        <header className="trade-interface-header">
          <div>
            <h1 className="trade-interface-title">$treams 0f $trategy</h1>
            <p className="trade-interface-subtitle">Trade Interface</p>
          </div>
          <div className="trade-interface-header-meta">Interface Root</div>
        </header>

        <div className="trade-interface-body">
          <aside className="trade-interface-rail" aria-label="Trade interface navigation">
            <div className="trade-interface-rail-section">
              <div className="trade-interface-rail-label">Section 01</div>
              <div className="trade-interface-rail-slot" />
              <div className="trade-interface-rail-slot" />
            </div>
            <div className="trade-interface-rail-section">
              <div className="trade-interface-rail-label">Section 02</div>
              <div className="trade-interface-rail-slot" />
              <div className="trade-interface-rail-slot" />
            </div>
            <div className="trade-interface-rail-section">
              <div className="trade-interface-rail-label">Section 03</div>
              <div className="trade-interface-rail-slot" />
            </div>
          </aside>

          <main className="trade-interface-canvas">
            <div className="trade-interface-blank">
              <div className="trade-interface-blank-title">Trade Interface Initialized</div>
              <p className="trade-interface-blank-copy">
                This is the structural scaffold for future trading features. Modules, charts, and
                execution surfaces will be composed here as they come online.
              </p>
            </div>
          </main>
        </div>

        <footer className="trade-interface-footer">
          <div className="trade-interface-status">Connection: Pending</div>
          <div className="trade-interface-status">Mode: Standby</div>
        </footer>
      </div>
    </div>
  );
}

export default function TradeInterfaceRoot() {
  return (
    <ModuleThemeProvider moduleName="streams">
      <TradeInterfaceContent />
    </ModuleThemeProvider>
  );
}
