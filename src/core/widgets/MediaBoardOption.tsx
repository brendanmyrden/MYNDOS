import { useWidgetState } from "./useWidgetState";

type MediaBoardOptionProps = {
  moduleName: string;
};

export default function MediaBoardOption({ moduleName }: MediaBoardOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Media Board</div>
          <div className="module-widget-card__subtitle">Post photos and videos to a visual board</div>
        </div>
        {state.mediaBoard ? (
          <div className="module-widget-card__added">Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("mediaBoard", true)}
          >
            Add
          </button>
        )}
      </div>
      <div className="module-widget-card__preview media-board-option__preview" aria-hidden="true">
        <div className="media-board-option__tile media-board-option__tile--wide" />
        <div className="media-board-option__tile" />
        <div className="media-board-option__add">+</div>
      </div>
    </div>
  );
}
