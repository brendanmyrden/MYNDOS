import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useModuleTheme } from "../state/ModuleThemeContext";
import { defaultModuleCubeOverrides } from "../theme/defaultAppearance";
import { getSavedSidebarEmoji, MODULE_CUBE_EMOJI_CHANGE_EVENT, moduleCubeStorageKey } from "./moduleCubeEmoji";

const FullEmojiPicker = lazy(() => import("emoji-picker-react"));

type CubeMode = "page" | "single" | "gradient";

type CubeConfig = {
  appearanceVersion: number;
  emoji: string;
  mode: CubeMode;
  singleColor: string;
  gradientFrom: string;
  gradientTo: string;
  paletteLinked: boolean;
  glowStrength: number;
  glowColor: string | null;
  sidebarIconSynced?: string;
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
  "🎮",
  "💠",
  "⚡",
];

const DEFAULT_SINGLE_COLOR = "#7df9ff";
const DEFAULT_GRADIENT_FROM = "#7df9ff";
const DEFAULT_GRADIENT_TO = "#ff4fd8";

function createDefaultConfig(moduleName: string, defaultEmoji: string, accent: string, accent2: string): CubeConfig {
  const sidebarEmoji = getSavedSidebarEmoji(moduleName);
  const defaults = {
    emoji: sidebarEmoji ?? defaultEmoji,
    sidebarIconSynced: sidebarEmoji,
    mode: "page" as const,
    singleColor: accent,
    gradientFrom: accent,
    gradientTo: accent2,
    paletteLinked: true,
    glowStrength: 65,
    glowColor: null,
    ...defaultModuleCubeOverrides[moduleName],
  };
  return { ...defaults, appearanceVersion: 3, glowStrength: Math.round(defaults.glowStrength * 0.6) };
}

export default function ModuleCube({ moduleName, defaultEmoji, className = "module-cube" }: ModuleCubeProps) {
  const { moduleBackgroundGradient, moduleAccent, moduleAccent2 } = useModuleTheme();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastTapRef = useRef(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<CSSProperties>({});
  const [panelOffset, setPanelOffset] = useState(0);
  const [config, setConfig] = useState<CubeConfig>(() => createDefaultConfig(moduleName, defaultEmoji, moduleAccent, moduleAccent2));
  const [draftConfig, setDraftConfig] = useState<CubeConfig>(() => createDefaultConfig(moduleName, defaultEmoji, moduleAccent, moduleAccent2));

  useEffect(() => {
    const raw = window.localStorage.getItem(moduleCubeStorageKey(moduleName));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<CubeConfig>;
      const legacyDefaultColors =
        parsed.singleColor === DEFAULT_SINGLE_COLOR &&
        parsed.gradientFrom === DEFAULT_GRADIENT_FROM &&
        parsed.gradientTo === DEFAULT_GRADIENT_TO;
      const glowStrength = typeof parsed.glowStrength === "number" && Number.isFinite(parsed.glowStrength)
        ? Math.min(100, Math.max(0, parsed.glowStrength))
        : 65;
      const sidebarEmoji = getSavedSidebarEmoji(moduleName);
      const savedConfig: CubeConfig = {
        appearanceVersion: 3,
        emoji: sidebarEmoji && parsed.sidebarIconSynced !== sidebarEmoji
          ? sidebarEmoji
          : typeof parsed.emoji === "string" ? parsed.emoji : defaultEmoji,
        sidebarIconSynced: sidebarEmoji ?? parsed.sidebarIconSynced,
        mode: (parsed.appearanceVersion ?? 0) >= 2 && (parsed.mode === "single" || parsed.mode === "gradient")
          ? parsed.mode
          : "page",
        singleColor: typeof parsed.singleColor === "string" ? parsed.singleColor : moduleAccent,
        gradientFrom: typeof parsed.gradientFrom === "string" ? parsed.gradientFrom : moduleAccent,
        gradientTo: typeof parsed.gradientTo === "string" ? parsed.gradientTo : moduleAccent2,
        paletteLinked: parsed.paletteLinked ?? legacyDefaultColors,
        glowStrength: parsed.appearanceVersion === 3
          ? glowStrength
          : Math.round(glowStrength * (parsed.appearanceVersion === 2 ? 0.8 : 0.6)),
        glowColor: typeof parsed.glowColor === "string" && /^#[0-9a-f]{6}$/i.test(parsed.glowColor)
          ? parsed.glowColor
          : null,
      };
      setConfig(savedConfig);
      setDraftConfig(savedConfig);
    } catch {
      const defaults = createDefaultConfig(moduleName, defaultEmoji, moduleAccent, moduleAccent2);
      setConfig(defaults);
      setDraftConfig(defaults);
    }
  }, [defaultEmoji, moduleName, moduleAccent, moduleAccent2]);

  useEffect(() => {
    window.localStorage.setItem(moduleCubeStorageKey(moduleName), JSON.stringify(config));
  }, [config, moduleName]);

  useEffect(() => {
    const handleSidebarEmojiChange = (event: Event) => {
      const detail = (event as CustomEvent<{ moduleName: string; emoji: string }>).detail;
      if (detail?.moduleName !== moduleName || typeof detail.emoji !== "string") return;
      setConfig((current) => ({ ...current, emoji: detail.emoji, sidebarIconSynced: detail.emoji }));
      setDraftConfig((current) => ({ ...current, emoji: detail.emoji, sidebarIconSynced: detail.emoji }));
    };
    window.addEventListener(MODULE_CUBE_EMOJI_CHANGE_EVENT, handleSidebarEmojiChange);
    return () => window.removeEventListener(MODULE_CUBE_EMOJI_CHANGE_EVENT, handleSidebarEmojiChange);
  }, [moduleName]);

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

  const openEditor = () => {
    const rootLeft = rootRef.current?.getBoundingClientRect().left ?? 0;
    const panelWidth = Math.min(460, window.innerWidth - 28);
    setPanelOffset(Math.max(14 - rootLeft, Math.min(0, window.innerWidth - 14 - rootLeft - panelWidth)));
    setDraftConfig(config);
    setShowAllEmojis(false);
    setIsEditing(true);
  };

  const toggleAllEmojis = () => {
    if (showAllEmojis) {
      setShowAllEmojis(false);
      return;
    }

    const panel = panelRef.current?.getBoundingClientRect();
    if (panel) {
      const width = Math.min(340, window.innerWidth - 24);
      const height = Math.min(470, window.innerHeight - 24);
      const right = panel.right + 12;
      const left = panel.left - width - 12;
      const nextLeft = right + width <= window.innerWidth - 12
        ? right
        : left >= 12
          ? left
          : Math.max(12, Math.min(panel.left, window.innerWidth - width - 12));
      setEmojiPickerPosition({
        top: Math.max(12, Math.min(panel.top, window.innerHeight - height - 12)),
        left: nextLeft,
        width,
        height,
      });
    }
    setShowAllEmojis(true);
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      openEditor();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const handleSave = () => {
    setConfig(draftConfig);
    setShowAllEmojis(false);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!showAllEmojis) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAllEmojis(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAllEmojis]);

  const activeConfig = isEditing ? draftConfig : config;
  const cubeBackground = useMemo(() => {
    if (activeConfig.mode === "page") return moduleBackgroundGradient;
    const primary = activeConfig.paletteLinked ? moduleAccent : activeConfig.gradientFrom;
    const secondary = activeConfig.paletteLinked ? moduleAccent2 : activeConfig.gradientTo;
    if (activeConfig.mode === "single") {
      return activeConfig.paletteLinked ? moduleAccent : activeConfig.singleColor;
    }
    return `linear-gradient(145deg, ${primary}, ${secondary})`;
  }, [activeConfig, moduleBackgroundGradient, moduleAccent, moduleAccent2]);
  const glowColor = activeConfig.glowColor ?? moduleAccent2;
  const glowStrength = activeConfig.glowStrength;
  const cubeShadow = glowStrength === 0
    ? "0 12px 24px rgba(0, 0, 0, 0.35)"
    : `0 12px 24px rgba(0, 0, 0, 0.35), 0 0 ${Math.round(glowStrength * 0.37)}px color-mix(in srgb, ${glowColor} ${Math.round(glowStrength * 0.65)}%, transparent), 0 0 ${Math.round(glowStrength * 0.5)}px color-mix(in srgb, ${glowColor} ${Math.round(glowStrength * 0.9)}%, transparent)`;

  return (
    <div className="module-cube-editor" ref={rootRef}>
      <div
        className={`${className} module-cube-editor__cube`}
        style={{ background: cubeBackground, boxShadow: cubeShadow }}
        onDoubleClick={openEditor}
        onTouchEnd={handleTouchEnd}
        title="Double-click to edit cube"
      >
        <span>{activeConfig.emoji || "⬜"}</span>
      </div>

      {isEditing ? (
        <div className="module-cube-editor__panel" ref={panelRef} style={{ left: panelOffset }}>
          <div className="module-cube-editor__panel-heading">
            <div className="module-cube-editor__panel-title">Emoji</div>
            <button type="button" className="module-cube-editor__clear" onClick={() => setDraftConfig((prev) => ({ ...prev, emoji: "" }))}>
              Clear emoji
            </button>
          </div>
          <div className="module-cube-editor__emoji-grid">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`module-cube-editor__emoji-option${draftConfig.emoji === emoji ? " is-active" : ""}`}
                onClick={() => setDraftConfig((prev) => ({ ...prev, emoji }))}
                aria-label={`Use ${emoji}`}
                aria-pressed={draftConfig.emoji === emoji}
              >
                {emoji}
              </button>
            ))}
            <button
              type="button"
              className="module-cube-editor__emoji-option module-cube-editor__emoji-more"
              onClick={toggleAllEmojis}
              aria-label="Show all emojis"
              aria-expanded={showAllEmojis}
              aria-controls="module-cube-all-emojis"
              title="More emojis"
            >
              …
            </button>
          </div>

          <div className="module-cube-editor__panel-title">Style</div>
          <div className="module-cube-editor__mode-toggle">
            <button
              type="button"
              className={`module-cube-editor__mode-btn${draftConfig.mode === "page" ? " is-active" : ""}`}
              onClick={() => setDraftConfig((prev) => ({ ...prev, mode: "page" }))}
            >
              Match Page
            </button>
            <button
              type="button"
              className={`module-cube-editor__mode-btn${draftConfig.mode === "single" ? " is-active" : ""}`}
              onClick={() => setDraftConfig((prev) => ({ ...prev, mode: "single", singleColor: prev.paletteLinked ? moduleAccent : prev.singleColor, paletteLinked: false }))}
            >
              One Colour
            </button>
            <button
              type="button"
              className={`module-cube-editor__mode-btn${draftConfig.mode === "gradient" ? " is-active" : ""}`}
              onClick={() => setDraftConfig((prev) => ({ ...prev, mode: "gradient", gradientFrom: prev.paletteLinked ? moduleAccent : prev.gradientFrom, gradientTo: prev.paletteLinked ? moduleAccent2 : prev.gradientTo, paletteLinked: false }))}
            >
              Gradient
            </button>
          </div>

          {draftConfig.mode === "page" ? null : draftConfig.mode === "single" ? (
            <label className="module-cube-editor__color-row">
              <span>Color</span>
              <input
                type="color"
                value={draftConfig.paletteLinked ? moduleAccent : draftConfig.singleColor}
                onChange={(event) => setDraftConfig((prev) => ({ ...prev, singleColor: event.target.value, paletteLinked: false }))}
              />
            </label>
          ) : (
            <div className="module-cube-editor__gradient-row">
              <label className="module-cube-editor__color-row">
                <span>From</span>
                <input
                  type="color"
                  value={draftConfig.paletteLinked ? moduleAccent : draftConfig.gradientFrom}
                  onChange={(event) => setDraftConfig((prev) => ({ ...prev, gradientFrom: event.target.value, gradientTo: prev.paletteLinked ? moduleAccent2 : prev.gradientTo, paletteLinked: false }))}
                />
              </label>
              <label className="module-cube-editor__color-row">
                <span>To</span>
                <input
                  type="color"
                  value={draftConfig.paletteLinked ? moduleAccent2 : draftConfig.gradientTo}
                  onChange={(event) => setDraftConfig((prev) => ({ ...prev, gradientFrom: prev.paletteLinked ? moduleAccent : prev.gradientFrom, gradientTo: event.target.value, paletteLinked: false }))}
                />
              </label>
            </div>
          )}

          <div className="module-cube-editor__panel-title">Glow</div>
          <div className="module-cube-editor__glow-controls">
            <label className="module-cube-editor__glow-strength">
              <span>Strength</span>
              <input
                type="range"
                min="0"
                max="100"
                value={draftConfig.glowStrength}
                onChange={(event) => setDraftConfig((prev) => ({ ...prev, glowStrength: Number(event.target.value) }))}
              />
              <output>{draftConfig.glowStrength}%</output>
            </label>
            <label className="module-cube-editor__color-row">
              <span>Glow colour</span>
              <input
                type="color"
                value={draftConfig.glowColor ?? moduleAccent2}
                onChange={(event) => setDraftConfig((prev) => ({ ...prev, glowColor: event.target.value }))}
              />
            </label>
          </div>

          <div className="module-cube-editor__preview-wrap">
            <span>Preview</span>
            <div className="module-cube-editor__preview" style={{ background: cubeBackground, boxShadow: cubeShadow }}>
              {draftConfig.emoji || "⬜"}
            </div>
          </div>
          <div className="module-cube-editor__actions">
            <button type="button" className="module-cube-editor__cancel" onClick={() => { setShowAllEmojis(false); setIsEditing(false); }}>
              Cancel
            </button>
            <button type="button" className="module-cube-editor__save" onClick={handleSave}>
              Save changes
            </button>
          </div>
        </div>
      ) : null}
      {isEditing && showAllEmojis ? (
        <div
          id="module-cube-all-emojis"
          className="module-cube-editor__all-emojis"
          style={emojiPickerPosition}
          role="dialog"
          aria-label="All emojis"
        >
          <div className="module-cube-editor__all-emojis-heading">
            <span>All emojis</span>
            <button type="button" onClick={() => setShowAllEmojis(false)} aria-label="Close all emojis">×</button>
          </div>
          <div className="module-cube-editor__all-emojis-body">
            <Suspense fallback={<div className="module-cube-editor__all-emojis-loading">Loading emojis…</div>}>
              <FullEmojiPicker
                theme="dark"
                width="100%"
                height="100%"
                previewConfig={{ showPreview: false }}
                onEmojiClick={(emojiData) => {
                  setDraftConfig((prev) => ({ ...prev, emoji: emojiData.emoji }));
                  setShowAllEmojis(false);
                }}
              />
            </Suspense>
          </div>
        </div>
      ) : null}
    </div>
  );
}
