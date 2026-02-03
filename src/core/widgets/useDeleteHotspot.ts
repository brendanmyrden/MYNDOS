import { useCallback } from "react";
import type { PointerEvent } from "react";

type HotspotHandlers<T extends HTMLElement> = {
  onPointerMove: (event: PointerEvent<T>) => void;
  onPointerLeave: (event: PointerEvent<T>) => void;
};

export const useDeleteHotspot = <T extends HTMLElement = HTMLElement>(): HotspotHandlers<T> => {
  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const isHot = x <= rect.width / 2 && y <= rect.height / 2;
    target.dataset.deleteHot = isHot ? "true" : "false";
  }, []);

  const onPointerLeave = useCallback((event: PointerEvent<T>) => {
    event.currentTarget.dataset.deleteHot = "false";
  }, []);

  return { onPointerMove, onPointerLeave };
};
