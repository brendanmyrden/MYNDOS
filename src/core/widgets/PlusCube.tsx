import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

type PlusCubeProps = {
  moduleName: string;
};

const storageKey = (moduleName: string) => `myndos.plus-cube.${moduleName}.accent`;

export default function PlusCube({ moduleName }: PlusCubeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [accent, setAccent] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(moduleName));
      if (stored) setAccent(stored);
    } catch {
      // ignore
    }
  }, [moduleName]);

  const handleAccentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setAccent(next);
    try {
      localStorage.setItem(storageKey(moduleName), next);
    } catch {
      // ignore
    }
  };

  const handleDoubleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      data-plus-cube="true"
      role="button"
      tabIndex={0}
      aria-label="Customize plus cube color"
      onDoubleClick={handleDoubleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleDoubleClick();
        }
      }}
      className="group relative flex h-[var(--module-plus-size)] w-[var(--module-plus-size)] cursor-pointer select-none items-center justify-center rounded-[16px] border border-white/10 bg-white/10 backdrop-blur-lg shadow-[0_12px_22px_rgba(0,0,0,0.35),_0_0_10px_var(--plus-accent)] transition-all duration-200 ease-in-out hover:border-white/20 hover:bg-white/20 hover:shadow-[0_12px_22px_rgba(0,0,0,0.35),_0_0_24px_var(--plus-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plus-accent)]"
      style={{ ["--plus-accent" as string]: accent ?? "var(--raphi-accent)" }}
    >
      <input
        ref={inputRef}
        type="color"
        className="sr-only"
        aria-hidden="true"
        onChange={handleAccentChange}
      />
      <span className="text-[24px] font-bold leading-none text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-colors duration-200 ease-in-out group-hover:text-[var(--plus-accent)]">
        +
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-white/10 transition-all duration-200 ease-in-out group-hover:ring-2 group-hover:ring-[var(--plus-accent)] group-hover:ring-opacity-70" />
    </div>
  );
}
