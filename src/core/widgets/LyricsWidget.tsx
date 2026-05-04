import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useDeleteHotspot } from "./useDeleteHotspot";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

type LyricsWidgetProps = {
  moduleName: string;
};

type ResizeCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type LyricsBoxSize = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

type PersistedLyricsState = {
  html: string;
  boxSize: LyricsBoxSize;
};

type FormatCommand = "bold" | "italic" | "underline" | "strikeThrough";

const MIN_BOX_WIDTH = 320;
const MAX_BOX_WIDTH = 1200;
const MIN_BOX_HEIGHT = 220;
const MAX_BOX_HEIGHT = 760;
const MIN_BOX_OFFSET_X = -460;
const MAX_BOX_OFFSET_X = 460;
const MIN_BOX_OFFSET_Y = -300;
const MAX_BOX_OFFSET_Y = 300;

const DEFAULT_BOX_SIZE: LyricsBoxSize = {
  width: 620,
  height: 320,
  offsetX: 0,
  offsetY: 0,
};

const DEFAULT_LYRICS_STATE: PersistedLyricsState = {
  html: "",
  boxSize: DEFAULT_BOX_SIZE,
};

const RESIZE_VECTORS: Record<ResizeCorner, { x: -1 | 1; y: -1 | 1 }> = {
  "top-left": { x: -1, y: -1 },
  "top-right": { x: 1, y: -1 },
  "bottom-left": { x: -1, y: 1 },
  "bottom-right": { x: 1, y: 1 },
};

const FORMAT_BUTTONS: Array<{ label: string; command: FormatCommand; title: string }> = [
  { label: "B", command: "bold", title: "Bold" },
  { label: "I", command: "italic", title: "Italic" },
  { label: "U", command: "underline", title: "Underline" },
  { label: "S", command: "strikeThrough", title: "Strikethrough" },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const readStoredLyricsState = (storageKey: string): PersistedLyricsState => {
  if (typeof window === "undefined") return DEFAULT_LYRICS_STATE;
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return DEFAULT_LYRICS_STATE;
    const parsed = JSON.parse(stored) as
      | (Partial<PersistedLyricsState> & { boxSize?: Partial<LyricsBoxSize> })
      | null;
    if (!parsed) return DEFAULT_LYRICS_STATE;
    return {
      html: typeof parsed.html === "string" ? parsed.html : DEFAULT_LYRICS_STATE.html,
      boxSize: {
        width:
          typeof parsed.boxSize?.width === "number"
            ? clamp(parsed.boxSize.width, MIN_BOX_WIDTH, MAX_BOX_WIDTH)
            : DEFAULT_BOX_SIZE.width,
        height:
          typeof parsed.boxSize?.height === "number"
            ? clamp(parsed.boxSize.height, MIN_BOX_HEIGHT, MAX_BOX_HEIGHT)
            : DEFAULT_BOX_SIZE.height,
        offsetX:
          typeof parsed.boxSize?.offsetX === "number"
            ? clamp(parsed.boxSize.offsetX, MIN_BOX_OFFSET_X, MAX_BOX_OFFSET_X)
            : DEFAULT_BOX_SIZE.offsetX,
        offsetY:
          typeof parsed.boxSize?.offsetY === "number"
            ? clamp(parsed.boxSize.offsetY, MIN_BOX_OFFSET_Y, MAX_BOX_OFFSET_Y)
            : DEFAULT_BOX_SIZE.offsetY,
      },
    };
  } catch {
    return DEFAULT_LYRICS_STATE;
  }
};

const placeCaretAtEnd = (element: HTMLElement) => {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

export default function LyricsWidget({ moduleName }: LyricsWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();
  const editorRef = useRef<HTMLDivElement>(null);
  const storageKey = useMemo(() => `myndos.widgets.${moduleName}.lyrics.v1`, [moduleName]);
  const initialState = useMemo(() => readStoredLyricsState(storageKey), [storageKey]);
  const [lyricsHtml, setLyricsHtml] = useState(initialState.html);
  const [boxSize, setBoxSize] = useState(initialState.boxSize);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== lyricsHtml) {
      editor.innerHTML = lyricsHtml;
    }
  }, [lyricsHtml]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ html: lyricsHtml, boxSize }));
    } catch {
      // ignore storage failures
    }
  }, [lyricsHtml, boxSize, storageKey]);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    window.requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      placeCaretAtEnd(editor);
    });
  }, []);

  const handleEditorInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    setLyricsHtml(editor.innerHTML);
  }, []);

  const handleEditorBlur = useCallback(() => {
    setIsEditing(false);
    const editor = editorRef.current;
    if (!editor) return;
    setLyricsHtml(editor.innerHTML);
  }, []);

  const applyFormatting = useCallback(
    (command: FormatCommand) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (!isEditing) setIsEditing(true);
      editor.focus();
      document.execCommand(command, false);
      setLyricsHtml(editor.innerHTML);
    },
    [isEditing]
  );

  const startResize = useCallback(
    (corner: ResizeCorner, event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const vector = RESIZE_VECTORS[corner];
      const startX = event.clientX;
      const startY = event.clientY;
      const startBoxSize = boxSize;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const nextWidth = clamp(
          startBoxSize.width + deltaX * vector.x,
          MIN_BOX_WIDTH,
          MAX_BOX_WIDTH
        );
        const nextHeight = clamp(
          startBoxSize.height + deltaY * vector.y,
          MIN_BOX_HEIGHT,
          MAX_BOX_HEIGHT
        );
        const widthDiff = startBoxSize.width - nextWidth;
        const heightDiff = startBoxSize.height - nextHeight;
        setBoxSize({
          width: nextWidth,
          height: nextHeight,
          offsetX:
            vector.x === -1
              ? clamp(startBoxSize.offsetX + widthDiff, MIN_BOX_OFFSET_X, MAX_BOX_OFFSET_X)
              : startBoxSize.offsetX,
          offsetY:
            vector.y === -1
              ? clamp(startBoxSize.offsetY + heightDiff, MIN_BOX_OFFSET_Y, MAX_BOX_OFFSET_Y)
              : startBoxSize.offsetY,
        });
      };

      const finishResize = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", finishResize);
        window.removeEventListener("pointercancel", finishResize);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", finishResize);
      window.addEventListener("pointercancel", finishResize);
    },
    [boxSize]
  );

  if (!state.lyrics) return null;

  return (
    <div className="lyrics-widget widget-shell" {...deleteHotspot}>
      <div className="lyrics-widget__frame">
        <div className="lyrics-widget__header">
          <div className="lyrics-widget__header-left">
            <button
              type="button"
              className="widget-remove fluid-delete"
              onClick={() => updateWidget("lyrics", false)}
              aria-label="Remove lyrics widget"
            >
              x
            </button>
            <div>
              <div className="lyrics-widget__title">Lyrics</div>
              <div className="lyrics-widget__subtitle">Double-click inside to write</div>
            </div>
          </div>
        </div>
        <div className="lyrics-widget__box-wrap">
          <div
            className={`lyrics-widget__box ${isEditing ? "is-editing" : ""}`}
            style={{
              width: `${boxSize.width}px`,
              height: `${boxSize.height}px`,
              transform: `translate(${boxSize.offsetX}px, ${boxSize.offsetY}px)`,
            }}
          >
            <div className="lyrics-widget__toolbar" role="toolbar" aria-label="Lyrics formatting toolbar">
              {FORMAT_BUTTONS.map((button) => (
                <button
                  key={button.command}
                  type="button"
                  className="lyrics-widget__tool-btn"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFormatting(button.command)}
                  aria-label={button.title}
                  title={button.title}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div
              ref={editorRef}
              className={`lyrics-widget__editor ${isEditing ? "is-editing" : ""}`}
              contentEditable={isEditing}
              suppressContentEditableWarning
              spellCheck={false}
              data-placeholder="Double-click to write lyrics. Emojis are supported."
              onDoubleClick={enableEditing}
              onFocus={() => setIsEditing(true)}
              onInput={handleEditorInput}
              onBlur={handleEditorBlur}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
            />
            {(Object.keys(RESIZE_VECTORS) as ResizeCorner[]).map((corner) => (
              <button
                key={corner}
                type="button"
                className={`lyrics-widget__resize-handle lyrics-widget__resize-handle--${corner}`}
                onPointerDown={(event) => startResize(corner, event)}
                aria-label={`Resize lyrics box from ${corner.replace("-", " ")}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
