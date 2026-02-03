import MatrixTimerOption from "./MatrixTimerOption";
import MediaModalOption from "./MediaModalOption";
import TableWidgetOption from "./TableWidgetOption";

type ModuleHoverPanelProps = {
  moduleName: string;
};

export default function ModuleHoverPanel({ moduleName }: ModuleHoverPanelProps) {
  return (
    <div className="module-hover-panel__inner">
      <div className="module-hover-panel__header">
        <div className="module-hover-panel__title">Widget Options</div>
        <div className="module-hover-panel__subtitle">Add widgets before they appear in your module</div>
      </div>
      <MatrixTimerOption moduleName={moduleName} />
      <MediaModalOption moduleName={moduleName} />
      <TableWidgetOption moduleName={moduleName} />
    </div>
  );
}
