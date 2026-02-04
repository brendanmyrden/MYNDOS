import { useMemo } from "react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ScrollBaseAnimationProps = {
  children: ReactNode;
  baseVelocity?: number;
  delay?: number;
  className?: string;
  clasname?: string;
};

export default function ScrollBaseAnimation({
  children,
  baseVelocity = 3,
  delay = 0,
  className,
  clasname,
}: ScrollBaseAnimationProps) {
  const direction = baseVelocity < 0 ? "reverse" : "normal";
  const duration = useMemo(() => {
    const speed = Math.max(1, Math.abs(baseVelocity));
    return `${18 / speed}s`;
  }, [baseVelocity]);

  const style = {
    ["--scroll-duration" as string]: duration,
    ["--scroll-delay" as string]: `${delay}ms`,
  } as React.CSSProperties;

  return (
    <div className="scroll-marquee" style={style}>
      <div
        className={cn("scroll-marquee__inner", className, clasname)}
        style={{ animationDirection: direction }}
      >
        <span className="scroll-marquee__text">{children}</span>
        <span className="scroll-marquee__text">{children}</span>
      </div>
    </div>
  );
}
