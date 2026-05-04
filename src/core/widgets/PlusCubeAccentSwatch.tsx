import type { ChangeEvent } from "react";
import { usePlusCubeAccent } from "./plusCubeAccent";

type PlusCubeAccentSwatchProps = {
  moduleName: string;
};

export default function PlusCubeAccentSwatch({ moduleName }: PlusCubeAccentSwatchProps) {
  const { appearance, updateAppearance } = usePlusCubeAccent(moduleName);

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
          className={`module-hover-panel__swatch-mode-btn ${appearance.mode === "solid" ? "is-active" : ""}`}
          onClick={() => updateAppearance((prev) => ({ ...prev, mode: "solid" }))}
        >
          Color
        </button>
        <button
          type="button"
          className={`module-hover-panel__swatch-mode-btn ${appearance.mode === "gradient" ? "is-active" : ""}`}
          onClick={() => updateAppearance((prev) => ({ ...prev, mode: "gradient" }))}
        >
          Gradient
        </button>
      </div>
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
    </div>
  );
}
