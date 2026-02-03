import { useWidgetState } from "./useWidgetState";

type MediaModalOptionProps = {
  moduleName: string;
};

export default function MediaModalOption({ moduleName }: MediaModalOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const isAdded = state.mediaModal;

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Media Modal</div>
          <div className="module-widget-card__subtitle">Image + video lightbox widget</div>
        </div>
        {isAdded ? (
          <div className="module-widget-card__added">Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("mediaModal", true)}
          >
            Add
          </button>
        )}
      </div>
      <div className="module-widget-card__preview media-modal-widget__preview">
        <div className="media-modal-widget__preview-tile" />
        <div className="media-modal-widget__preview-tile" />
      </div>
    </div>
  );
}
