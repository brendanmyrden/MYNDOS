/// <reference types="vite/client" />

declare module "lucide-react";

declare module "lucide-react/dist/esm/icons/x.js" {
  import type { ComponentType, SVGProps } from "react";

  const XIcon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export default XIcon;
}
