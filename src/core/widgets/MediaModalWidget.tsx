import { MediaModal } from "../../components/ui/media-modal";
import { useDeleteHotspot } from "./useDeleteHotspot";
import { useWidgetState } from "./useWidgetState";
import "./widgets.css";

type MediaModalWidgetProps = {
  moduleName: string;
};

export default function MediaModalWidget({ moduleName }: MediaModalWidgetProps) {
  const { state, updateWidget } = useWidgetState(moduleName);
  const deleteHotspot = useDeleteHotspot<HTMLDivElement>();

  if (!state.mediaModal) return null;

  return (
    <div className="media-modal-widget widget-shell" {...deleteHotspot}>
      <div className="media-modal-widget__frame">
        <div className="media-modal-widget__header">
          <div className="media-modal-widget__header-left">
            <button
              type="button"
              className="widget-remove fluid-delete"
              onClick={() => updateWidget("mediaModal", false)}
              aria-label="Remove media modal"
            >
              x
            </button>
            <div>
              <div className="media-modal-widget__title">Media Modal</div>
              <div className="media-modal-widget__subtitle">Image + video preview</div>
            </div>
          </div>
        </div>
        <div className="media-modal-widget__grid">
          <MediaModal
            imgSrc="https://images.unsplash.com/photo-1726824766931-4bd8b59af37c?q=80&w=1000&auto=format&fit=crop"
          />
          <MediaModal
            videoSrc="https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4"
          />
        </div>
      </div>
    </div>
  );
}
