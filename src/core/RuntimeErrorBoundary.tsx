import { Component, type ErrorInfo, type ReactNode } from "react";

type RuntimeErrorBoundaryProps = {
  children: ReactNode;
};

type RuntimeErrorBoundaryState = {
  error: Error | null;
};

export default class RuntimeErrorBoundary extends Component<
  RuntimeErrorBoundaryProps,
  RuntimeErrorBoundaryState
> {
  state: RuntimeErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): RuntimeErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MYNDOS runtime render failure", error, errorInfo);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#0B0F1A",
          color: "#EDEDED",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <section
          style={{
            width: "min(560px, 100%)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 8,
            padding: 24,
            background: "rgba(10,14,24,0.92)",
            boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1.2 }}>
            MYNDOS failed to render
          </h1>
          <p style={{ margin: "12px 0 0", color: "#AEB7C8", lineHeight: 1.55 }}>
            A module threw while React was mounting. Check the browser console for the
            stack trace, then reload after the dev server finishes restarting.
          </p>
          <pre
            style={{
              margin: "18px 0",
              padding: 12,
              overflow: "auto",
              maxHeight: 180,
              borderRadius: 6,
              background: "rgba(0,0,0,0.32)",
              color: "#F7B7B7",
              fontSize: 12,
              lineHeight: 1.45,
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error.stack ?? this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              padding: "9px 12px",
              background: "#EDEDED",
              color: "#0B0F1A",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </section>
      </main>
    );
  }
}
