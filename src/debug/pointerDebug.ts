type PointerDebugInfo = {
  tag: string;
  id?: string;
  className?: string;
  pointerEvents?: string;
  position?: string;
  zIndex?: string;
  opacity?: string;
};

const describeEl = (el: Element | null): PointerDebugInfo | null => {
  if (!el) return null;
  const htmlEl = el as HTMLElement;
  const style = window.getComputedStyle(htmlEl);
  return {
    tag: el.tagName.toLowerCase(),
    id: htmlEl.id || undefined,
    className: typeof htmlEl.className === "string" ? htmlEl.className || undefined : undefined,
    pointerEvents: style.pointerEvents || undefined,
    position: style.position || undefined,
    zIndex: style.zIndex || undefined,
    opacity: style.opacity || undefined,
  };
};

export function installPointerDebug() {
  if (typeof window === "undefined") return;
  // Avoid duplicate installs in React StrictMode
  if ((window as unknown as { __myndPointerDebugInstalled?: boolean }).__myndPointerDebugInstalled) {
    return;
  }
  (window as unknown as { __myndPointerDebugInstalled?: boolean }).__myndPointerDebugInstalled = true;

  window.addEventListener(
    "pointerdown",
    (event) => {
      const x = (event as PointerEvent).clientX;
      const y = (event as PointerEvent).clientY;
      const top = document.elementFromPoint(x, y);
      console.log("[pointer-debug] pointerdown", {
        x,
        y,
        target: describeEl(event.target as Element | null),
        topAtPoint: describeEl(top),
      });
    },
    true
  );
}
