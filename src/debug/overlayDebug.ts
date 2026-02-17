type OverlaySnapshot = {
  className?: string;
  pointerEvents?: string;
  position?: string;
  zIndex?: string;
  opacity?: string;
};

const WATCH_SELECTORS = [
  ".trade-interface-transition",
  ".fixed.inset-0.z-50",
];

const createSnapshot = (el: Element): OverlaySnapshot => {
  const node = el as HTMLElement;
  const style = window.getComputedStyle(node);
  return {
    className: node.className || undefined,
    pointerEvents: style.pointerEvents || undefined,
    position: style.position || undefined,
    zIndex: style.zIndex || undefined,
    opacity: style.opacity || undefined,
  };
};

export function installOverlayDebugWatchdog() {
  if (typeof window === "undefined") return;
  const debugWindow = window as unknown as {
    __myndOverlayDebugInstalled?: boolean;
    __myndOverlayFirstSeen?: WeakMap<Element, number>;
  };

  if (debugWindow.__myndOverlayDebugInstalled) return;
  debugWindow.__myndOverlayDebugInstalled = true;
  debugWindow.__myndOverlayFirstSeen = new WeakMap<Element, number>();

  const firstSeen = debugWindow.__myndOverlayFirstSeen;
  const maxVisibleMs = 1500;
  const tickMs = 400;

  window.setInterval(() => {
    const now = Date.now();
    const overlays = document.querySelectorAll(WATCH_SELECTORS.join(","));
    overlays.forEach((overlay) => {
      if (!firstSeen.has(overlay)) {
        firstSeen.set(overlay, now);
        return;
      }

      const age = now - (firstSeen.get(overlay) ?? now);
      if (age < maxVisibleMs) return;

      const snapshot = createSnapshot(overlay);
      const likelyBlocking = snapshot.pointerEvents !== "none";
      console.warn("[overlay-debug] stuck overlay detected", {
        ageMs: age,
        likelyBlocking,
        snapshot,
      });
      firstSeen.set(overlay, now + 60_000);
    });
  }, tickMs);
}
