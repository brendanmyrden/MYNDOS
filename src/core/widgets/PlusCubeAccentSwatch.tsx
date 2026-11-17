import type { ChangeEvent } from "react";
import { usePlusCubeAccent } from "./plusCubeAccent";
import { useModuleTheme } from "../state/ModuleThemeContext";

type PlusCubeAccentSwatchProps = {
  moduleName: string;
};

export default function PlusCubeAccentSwatch({ moduleName }: PlusCubeAccentSwatchProps) {
  const { appearance, updateAppearance } = usePlusCubeAccent(moduleName);
  const { moduleAccent, moduleAccent2 } = useModuleTheme();

  const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    updateAppearance((prev) => ({ ...prev, colorA: next }));
  };

  const handleSecondaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    updateAppearance((prev) => ({ ...prev, colorB: next }));
  };

  return (
    <div className="module-hover-panel__swatch">
      <span className="module-hover-panel__swatch-label">Cube</span>
      <div className="module-hover-panel__swatch-mode">
        <button
          type="button"
          className={`module-hover-panel__swatch-mode-btn ${appearance.mode === "module" ? "is-active" : ""}`}
          onClick={() => updateAppearance((prev) => ({ ...prev, mode: "module" }))}
        >
          Module
        </button>
        <button
          type="button"
          className={`module-hover-panel__swatch-mode-btn ${appearance.mode === "solid" ? "is-active" : ""}`}
          onClick={() => updateAppearance((prev) => ({
            ...prev,
            mode: "solid",
            colorA: prev.mode === "module" ? moduleAccent : prev.colorA,
          }))}
        >
          Color
        </button>
        <button
          type="button"
          className={`module-hover-panel__swatch-mode-btn ${appearance.mode === "gradient" ? "is-active" : ""}`}
          onClick={() => updateAppearance((prev) => ({
            ...prev,
            mode: "gradient",
            colorA: prev.mode === "module" ? moduleAccent : prev.colorA,
            colorB: prev.mode === "module" ? moduleAccent2 : prev.colorB,
          }))}
        >
          Gradient
        </button>
      </div>
      {appearance.mode === "module" ? null : (
        <div className="module-hover-panel__swatch-inputs">
          <input
            type="color"
            value={appearance.colorA}
            onChange={handlePrimaryChange}
            aria-label="Floating cube primary color"
          />
          {appearance.mode === "gradient" ? (
            <input
              type="color"
              value={appearance.colorB}
              onChange={handleSecondaryChange}
              aria-label="Floating cube secondary color"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
