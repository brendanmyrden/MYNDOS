import { useMemo, useState } from "react";
import { useWidgetState } from "./useWidgetState";
import { useModuleTheme } from "../state/ModuleThemeContext";
import "./widgets.css";

interface WidgetLauncherProps {
  moduleName: string;
}

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  if (![3, 6].includes(sanitized.length)) {
    return `rgba(125, 249, 255, ${alpha})`;
  }
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : sanitized;
  const value = parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export default function WidgetLauncher({ moduleName }: WidgetLauncherProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const { moduleAccent } = useModuleTheme();
  const [open, setOpen] = useState(false);

  const widgetLauncherColor = moduleAccent;
  const launcherStyle = useMemo(
    () =>
      ({
        ["--widget-launcher" as string]: widgetLauncherColor,
        ["--widget-launcher-soft" as string]: hexToRgba(widgetLauncherColor, 0.3),
        ["--widget-launcher-glow" as string]: hexToRgba(widgetLauncherColor, 0.6),
      }) as React.CSSProperties,
    [widgetLauncherColor]
  );

  const handleAddDashboard = () => {
    updateWidget("dashboard", true);
    setOpen(false);
  };

  return (
    <div className={`widget-launcher ${open ? "is-open" : ""}`} style={launcherStyle}>
      <button
        type="button"
        className="widget-launcher__btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        +
      </button>
      <div className="widget-launcher__menu">
        <div className="widget-launcher__menu-inner">
          <div className="widget-card">
            <div className="widget-card__preview">
              <div className="widget-card__line" />
              <div className="widget-card__line" />
              <div className="widget-card__line" />
            </div>
            <div className="widget-card__label">Dashboard</div>
            {!state.dashboard ? (
              <button type="button" className="widget-card__add" onClick={handleAddDashboard}>
                Add
              </button>
            ) : (
              <div className="widget-card__added">Added</div>
            )}
          </div>
          <div className="widget-card widget-card--empty">
            <div className="widget-card__placeholder">More slots</div>
          </div>
          <div className="widget-card widget-card--empty">
            <div className="widget-card__placeholder">Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
