import { useWidgetState } from "./useWidgetState";

type LyricsOptionProps = {
  moduleName: string;
};

export default function LyricsOption({ moduleName }: LyricsOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const isAdded = state.lyrics;

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Lyrics</div>
          <div className="module-widget-card__subtitle">Large rich text box with corner resize</div>
        </div>
        {isAdded ? (
          <div className="module-widget-card__added">Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("lyrics", true)}
          >
            Add
          </button>
        )}
      </div>
      <div className="module-widget-card__preview lyrics-option__preview">
        <div className="lyrics-option__line" />
        <div className="lyrics-option__line lyrics-option__line--short" />
        <div className="lyrics-option__line" />
      </div>
    </div>
  );
}
