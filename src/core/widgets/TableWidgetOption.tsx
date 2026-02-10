import { useWidgetState } from "./useWidgetState";

type TableWidgetOptionProps = {
  moduleName: string;
};

export default function TableWidgetOption({ moduleName }: TableWidgetOptionProps) {
  const { state, updateWidget } = useWidgetState(moduleName);

  return (
    <div className="module-widget-card">
      <div className="module-widget-card__header">
        <div>
          <div className="module-widget-card__title">Trac</div>
          <div className="module-widget-card__subtitle">Editable rows, columns, and cells</div>
        </div>
      </div>
      <div className="module-widget-card__actions">
        {state.tableLocal ? (
          <div className="module-widget-card__added">Local Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("tableLocal", true)}
          >
            Add Local
          </button>
        )}
        {state.tableGlobal ? (
          <div className="module-widget-card__added">Global Added</div>
        ) : (
          <button
            type="button"
            className="module-btn module-btn-ghost module-btn-sm"
            onClick={() => updateWidget("tableGlobal", true)}
          >
            Add Global
          </button>
        )}
      </div>
      <div className="module-widget-card__footer">
        <span className="module-widget-card__note">Global tables sync across modules.</span>
      </div>
    </div>
  );
}
