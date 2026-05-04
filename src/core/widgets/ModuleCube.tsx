import { useEffect, useMemo, useRef, useState } from "react";

type CubeMode = "single" | "gradient";

type CubeConfig = {
  emoji: string;
  mode: CubeMode;
  singleColor: string;
  gradientFrom: string;
  gradientTo: string;
};

type ModuleCubeProps = {
  moduleName: string;
  defaultEmoji: string;
  className?: string;
};

const EMOJI_OPTIONS = [
  "🧠",
  "🧬",
  "🕊️",
  "💊",
  "🔮",
  "🛰️",
  "⚙️",
  "🎛️",
  "🔢",
  "✍️",
  "🪞",
  "🔥",
  "🌊",
  "🌙",
  "⭐",
  "🚀",
];

const DEFAULT_SINGLE_COLOR = "#7df9ff";
const DEFAULT_GRADIENT_FROM = "#7df9ff";
const DEFAULT_GRADIENT_TO = "#ff4fd8";

function createDefaultConfig(defaultEmoji: string): CubeConfig {
  return {
    emoji: defaultEmoji,
    mode: "gradient",
    singleColor: DEFAULT_SINGLE_COLOR,
    gradientFrom: DEFAULT_GRADIENT_FROM,
    gradientTo: DEFAULT_GRADIENT_TO,
  };
}

function storageKey(moduleName: string) {
  return `module-cube-config:${moduleName}`;
}

export default function ModuleCube({ moduleName, defaultEmoji, className = "module-cube" }: ModuleCubeProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<CubeConfig>(() => createDefaultConfig(defaultEmoji));

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey(moduleName));
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<CubeConfig>;
      setConfig({
        emoji: typeof parsed.emoji === "string" ? parsed.emoji : defaultEmoji,
        mode: parsed.mode === "single" ? "single" : "gradient",
        singleColor: typeof parsed.singleColor === "string" ? parsed.singleColor : DEFAULT_SINGLE_COLOR,
        gradientFrom: typeof parsed.gradientFrom === "string" ? parsed.gradientFrom : DEFAULT_GRADIENT_FROM,
        gradientTo: typeof parsed.gradientTo === "string" ? parsed.gradientTo : DEFAULT_GRADIENT_TO,
      });
    } catch {
      setConfig(createDefaultConfig(defaultEmoji));
    }
  }, [defaultEmoji, moduleName]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(moduleName), JSON.stringify(config));
  }, [config, moduleName]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const onDocumentDoubleClick = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }
      if (!rootRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("dblclick", onDocumentDoubleClick);
    return () => {
      document.removeEventListener("dblclick", onDocumentDoubleClick);
    };
  }, [isEditing]);

  const cubeBackground = useMemo(() => {
    if (config.mode === "single") {
      return config.singleColor;
    }
    return `linear-gradient(145deg, ${config.gradientFrom}, ${config.gradientTo})`;
  }, [config.gradientFrom, config.gradientTo, config.mode, config.singleColor]);

  return (
    <div className="module-cube-editor" ref={rootRef}>
      <div
        className={`${className} module-cube-editor__cube`}
        style={{ background: cubeBackground }}
        onDoubleClick={() => setIsEditing(true)}
        title="Double-click to edit cube"
      >
        <span>{config.emoji || "⬜"}</span>
        {isEditing ? (
          <button
            type="button"
            className="module-cube-editor__delete"
            onClick={() => setConfig((prev) => ({ ...prev, emoji: "" }))}
            aria-label="Clear emoji"
            title="Clear emoji"
          >
            x
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="module-cube-editor__panel">
          <div className="module-cube-editor__panel-title">Emoji</div>
          <div className="module-cube-editor__emoji-grid">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`module-cube-editor__emoji-option${config.emoji === emoji ? " is-active" : ""}`}
                onClick={() => setConfig((prev) => ({ ...prev, emoji }))}
                aria-label={`Use ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="module-cube-editor__panel-title">Style</div>
          <div className="module-cube-editor__mode-toggle">
            <button
              type="button"
              className={`module-cube-editor__mode-btn${config.mode === "single" ? " is-active" : ""}`}
              onClick={() => setConfig((prev) => ({ ...prev, mode: "single" }))}
            >
              One Colour
            </button>
            <button
              type="button"
              className={`module-cube-editor__mode-btn${config.mode === "gradient" ? " is-active" : ""}`}
              onClick={() => setConfig((prev) => ({ ...prev, mode: "gradient" }))}
            >
              Gradient
            </button>
          </div>

          {config.mode === "single" ? (
            <label className="module-cube-editor__color-row">
              <span>Color</span>
              <input
                type="color"
                value={config.singleColor}
                onChange={(event) => setConfig((prev) => ({ ...prev, singleColor: event.target.value }))}
              />
            </label>
          ) : (
            <div className="module-cube-editor__gradient-row">
              <label className="module-cube-editor__color-row">
                <span>From</span>
                <input
                  type="color"
                  value={config.gradientFrom}
                  onChange={(event) => setConfig((prev) => ({ ...prev, gradientFrom: event.target.value }))}
                />
              </label>
              <label className="module-cube-editor__color-row">
                <span>To</span>
                <input
                  type="color"
                  value={config.gradientTo}
                  onChange={(event) => setConfig((prev) => ({ ...prev, gradientTo: event.target.value }))}
                />
              </label>
            </div>
          )}

          <div className="module-cube-editor__preview-wrap">
            <span>Preview</span>
            <div className="module-cube-editor__preview" style={{ background: cubeBackground }}>
              {config.emoji || "⬜"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
