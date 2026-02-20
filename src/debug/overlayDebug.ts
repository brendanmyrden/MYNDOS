type OverlaySnapshot = {
  className?: string;
  pointerEvents?: string;
  position?: string;
  zIndex?: string;
  opacity?: string;
};

type DebugWindow = Window & {
  __myndOverlayDebugInstalled?: boolean;
  __myndOverlayFirstSeen?: WeakMap<Element, number>;
  __myndPointerDebugInstalled?: boolean;
};

const WATCH_SELECTORS = [
  ".trade-interface-transition",
  ".fixed.inset-0.z-50",
];

const WATCHED_POINTER_EVENTS = ["pointerdown", "pointerup", "click"] as const;

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

function describeElement(node: EventTarget | null): string {
  if (!(node instanceof Element)) return "unknown";

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const classes =
    typeof el.className === "string" && el.className.trim().length > 0
      ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
      : "";

  return `${tag}${id}${classes}`;
}

function getPointerType(event: MouseEvent): string {
  if ("pointerType" in event) {
    return (event as PointerEvent).pointerType;
  }
  return "mouse";
}

export function installPointerDebug() {
  if (typeof window === "undefined") return;

  const debugWindow = window as DebugWindow;
  if (debugWindow.__myndPointerDebugInstalled) return;
  debugWindow.__myndPointerDebugInstalled = true;

  const handler = (event: Event) => {
    if (!(event instanceof MouseEvent)) return;

    const target = event.target instanceof Element ? event.target : null;
    const style = target ? window.getComputedStyle(target) : null;

    console.info("[pointer-debug]", {
      type: event.type,
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      target: describeElement(event.target),
      pointerType: getPointerType(event),
      pointerEvents: style?.pointerEvents,
      zIndex: style?.zIndex,
      defaultPrevented: event.defaultPrevented,
    });
  };

  WATCHED_POINTER_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, handler, true);
  });

  console.info("[pointer-debug] installed", { events: WATCHED_POINTER_EVENTS });
}

export function installOverlayDebugWatchdog() {
  if (typeof window === "undefined") return;
  const debugWindow = window as DebugWindow;

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
