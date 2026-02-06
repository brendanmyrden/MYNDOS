import { useNavigate } from "react-router-dom";
import { ModuleThemeProvider, useModuleTheme } from "../../core/state/ModuleThemeContext";
import "../../styles/cyberpunk.css";

function TradeCoreContent() {
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
  const navigate = useNavigate();

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
    <div style={containerStyle} className="module-shell trade-core-shell">
      <div className="module-content trade-core-content">
        <div className="trade-core-header">
          <div className="trade-core-header-left">
            <button
              type="button"
              className="module-btn module-btn-ghost module-btn-sm"
              onClick={() => navigate("/streams")}
            >
              Back to Streams
            </button>
            <div>
              <h1 className="trade-core-title">Trade Core</h1>
              <p className="trade-core-subtitle">Full-page trade interface foundation</p>
            </div>
          </div>
          <div className="trade-core-status">Standby</div>
        </div>

        <section className="trade-core-hero">
          <div className="trade-core-hero-cube">
            <span className="trade-core-hero-label">TRADE CORE</span>
          </div>
          <div className="trade-core-hero-copy">
            <div className="trade-core-hero-title">Execution surface primed</div>
            <p className="trade-core-hero-text">
              This interface will expand into live execution, signal routing, and position telemetry.
              For now, it anchors the trade stack and reserves space for the full workflow.
            </p>
            <div className="trade-core-hero-meta">Status: Interface scaffold ready</div>
          </div>
        </section>

        <div className="trade-core-grid">
          <section className="trade-core-panel">
            <div className="trade-core-panel__title">Order Flow</div>
            <div className="trade-core-panel__copy">Realtime routing, blotter, and fill capture.</div>
          </section>
          <section className="trade-core-panel">
            <div className="trade-core-panel__title">Position Stack</div>
            <div className="trade-core-panel__copy">Active exposure, sizing logic, and rotation.</div>
          </section>
          <section className="trade-core-panel">
            <div className="trade-core-panel__title">Signal Fabric</div>
            <div className="trade-core-panel__copy">Alpha triggers, alerts, and regime detection.</div>
          </section>
          <section className="trade-core-panel">
            <div className="trade-core-panel__title">Risk Control</div>
            <div className="trade-core-panel__copy">Guardrails, fail-safes, and audit trails.</div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function TradeCorePage() {
  return (
    <ModuleThemeProvider moduleName="streams">
      <TradeCoreContent />
    </ModuleThemeProvider>
  );
}
