import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_COLOR = "#7df9ff";
const DEFAULT_GRADIENT_END = "#ff4fd8";
const PLUS_CUBE_APPEARANCE_EVENT = "plus-cube-appearance-change";

export type PlusCubeColorMode = "solid" | "gradient";

export type PlusCubeAppearance = {
  mode: PlusCubeColorMode;
  colorA: string;
  colorB: string;
};

const DEFAULT_APPEARANCE: PlusCubeAppearance = {
  mode: "solid",
  colorA: DEFAULT_COLOR,
  colorB: DEFAULT_GRADIENT_END,
};

const storageKey = (moduleName: string) => `myndos.plus-cube.${moduleName}.appearance.v2`;
const legacyStorageKey = (moduleName: string) => `myndos.plus-cube.${moduleName}.accent`;

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

const readStoredAppearance = (moduleName: string): PlusCubeAppearance => {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  try {
    const v2 = localStorage.getItem(storageKey(moduleName));
    if (v2) {
      const parsed = JSON.parse(v2) as Partial<PlusCubeAppearance> | null;
      if (parsed) {
        return {
          mode: parsed.mode === "gradient" ? "gradient" : "solid",
          colorA: isHexColor(parsed.colorA) ? parsed.colorA : DEFAULT_APPEARANCE.colorA,
          colorB: isHexColor(parsed.colorB) ? parsed.colorB : DEFAULT_APPEARANCE.colorB,
        };
      }
    }
    const legacy = localStorage.getItem(legacyStorageKey(moduleName));
    if (isHexColor(legacy)) {
      return { ...DEFAULT_APPEARANCE, colorA: legacy };
    }
  } catch {
    // ignore
  }
  return DEFAULT_APPEARANCE;
};

export const setPlusCubeAppearance = (moduleName: string, appearance: PlusCubeAppearance) => {
  try {
    localStorage.setItem(storageKey(moduleName), JSON.stringify(appearance));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(PLUS_CUBE_APPEARANCE_EVENT, { detail: { moduleName, appearance } }));
};

export const usePlusCubeAccent = (moduleName: string) => {
  const [appearance, setAppearance] = useState<PlusCubeAppearance>(() => readStoredAppearance(moduleName));

  useEffect(() => {
    setAppearance(readStoredAppearance(moduleName));
  }, [moduleName]);

  useEffect(() => {
    const handleAppearanceChange = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { moduleName?: string; appearance?: PlusCubeAppearance }
        | undefined;
      if (!detail?.moduleName || detail.moduleName !== moduleName || !detail.appearance) return;
      setAppearance(detail.appearance);
    };
    window.addEventListener(PLUS_CUBE_APPEARANCE_EVENT, handleAppearanceChange);
    return () => window.removeEventListener(PLUS_CUBE_APPEARANCE_EVENT, handleAppearanceChange);
  }, [moduleName]);

  const updateAppearance = useCallback(
    (updater: (prev: PlusCubeAppearance) => PlusCubeAppearance) => {
      setAppearance((prev) => {
        const next = updater(prev);
        setPlusCubeAppearance(moduleName, next);
        return next;
      });
    },
    [moduleName]
  );

  const glowCss = useMemo(
    () =>
      appearance.mode === "gradient"
        ? `linear-gradient(135deg, ${appearance.colorA} 0%, ${appearance.colorB} 100%)`
        : appearance.colorA,
    [appearance]
  );

  return { appearance, updateAppearance, glowCss };
};
