import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

type SidebarLink = {
  name: string;
  path: string;
};

type SidebarSkin = {
  mode: "solid" | "gradient";
  primary: string;
  secondary: string;
};

const ORDER_STORAGE_KEY = "myndos.sidebar.order.v1";
const SKIN_STORAGE_KEY = "myndos.sidebar.skin.v1";

const defaultLinks: SidebarLink[] = [
  { name: "MYND OS", path: "/myndos" },
  { name: "Sanctuary", path: "/sanctuary" },
  { name: "Task Pill", path: "/taskpill" },
  { name: "R-A-P-H [ i ]", path: "/raphi" },
  { name: "MYRRYR", path: "/myrryr" },
  { name: "SYYR", path: "/syyr" },
  { name: "$.0.$. - $treams 0f $trategy", path: "/streams" },
  { name: "Settings", path: "/settings" },
];

const defaultSkin: SidebarSkin = {
  mode: "gradient",
  primary: "#0b1424",
  secondary: "#291436",
};

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace("#", "");
  if (![3, 6].includes(sanitized.length)) {
    return `rgba(125, 249, 255, ${alpha})`;
  }
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : sanitized;
  const value = parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const loadStoredOrder = () => {
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : null;
  } catch {
    return null;
  }
};

const reconcileLinks = (storedPaths: string[] | null) => {
  if (!storedPaths) return defaultLinks;
  const linkMap = new Map(defaultLinks.map((link) => [link.path, link]));
  const ordered = storedPaths
    .map((path) => linkMap.get(path))
    .filter((link): link is SidebarLink => Boolean(link));
  const missing = defaultLinks.filter((link) => !storedPaths.includes(link.path));
  return [...ordered, ...missing];
};

const loadSkin = (): SidebarSkin => {
  try {
    const stored = localStorage.getItem(SKIN_STORAGE_KEY);
    if (!stored) return defaultSkin;
    const parsed = JSON.parse(stored) as Partial<SidebarSkin>;
    return {
      mode: parsed.mode === "solid" ? "solid" : "gradient",
      primary: parsed.primary || defaultSkin.primary,
      secondary: parsed.secondary || defaultSkin.secondary,
    };
  } catch {
    return defaultSkin;
  }
};

const moveLink = (links: SidebarLink[], fromPath: string, toPath: string) => {
  const fromIndex = links.findIndex((link) => link.path === fromPath);
  const toIndex = links.findIndex((link) => link.path === toPath);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return links;
  const next = [...links];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links, setLinks] = useState(() => reconcileLinks(loadStoredOrder()));
  const [draggingPath, setDraggingPath] = useState<string | null>(null);
  const [dragOverPath, setDragOverPath] = useState<string | null>(null);
  const [skin, setSkin] = useState<SidebarSkin>(() => loadSkin());

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(links.map((link) => link.path)));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(skin));
  }, [skin]);

  const sidebarStyle = useMemo(() => {
    const background =
      skin.mode === "solid"
        ? skin.primary
        : `linear-gradient(160deg, ${skin.primary} 0%, ${skin.secondary} 100%)`;
    return {
      ["--sidebar-bg" as string]: background,
      ["--sidebar-accent" as string]: skin.primary,
      ["--sidebar-accent-soft" as string]: hexToRgba(skin.primary, 0.22),
      ["--sidebar-accent-glow" as string]: hexToRgba(skin.primary, 0.45),
      ["--sidebar-accent-2" as string]: skin.secondary,
      ["--sidebar-accent-2-soft" as string]: hexToRgba(skin.secondary, 0.2),
    } as CSSProperties;
  }, [skin]);

  const handleDragStart = (path: string) => (event: DragEvent<HTMLButtonElement>) => {
    setDraggingPath(path);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", path);
  };

  const handleDragOver = (path: string) => (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverPath !== path) {
      setDragOverPath(path);
    }
  };

  const handleDrop = (path: string) => (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const draggedPath = draggingPath || event.dataTransfer.getData("text/plain");
    if (!draggedPath || draggedPath === path) {
      setDragOverPath(null);
      setDraggingPath(null);
      return;
    }
    setLinks((prev) => moveLink(prev, draggedPath, path));
    setDragOverPath(null);
    setDraggingPath(null);
  };

  const handleDragEnd = () => {
    setDragOverPath(null);
    setDraggingPath(null);
  };

  const handleNavigate = (path: string) => () => {
    if (draggingPath) return;
    navigate(path);
  };

  return (
    <aside className="sidebar-shell" style={sidebarStyle}>
      <div className="sidebar-header">
        <div>
          <div className="sidebar-title">MYND OS</div>
          <div className="sidebar-subtitle">navigation matrix</div>
        </div>
        <div className="sidebar-orb" aria-hidden="true" />
      </div>

      <div className="sidebar-links">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const isDragging = draggingPath === link.path;
          const isOver = dragOverPath === link.path && !isDragging;
          return (
            <button
              key={link.path}
              type="button"
              className={`sidebar-link${isActive ? " is-active" : ""}${
                isDragging ? " is-dragging" : ""
              }${isOver ? " is-over" : ""}`}
              draggable
              onClick={handleNavigate(link.path)}
              onDragStart={handleDragStart(link.path)}
              onDragOver={handleDragOver(link.path)}
              onDrop={handleDrop(link.path)}
              onDragEnd={handleDragEnd}
            >
              <span className="sidebar-link__label">{link.name}</span>
              <span className="sidebar-link__handle" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="sidebar-controls">
        <div className="sidebar-controls__title">Sidebar skin</div>
        <div className="sidebar-toggle">
          <button
            type="button"
            className={`sidebar-toggle__btn${skin.mode === "solid" ? " is-selected" : ""}`}
            onClick={() => setSkin((prev) => ({ ...prev, mode: "solid" }))}
          >
            Solid
          </button>
          <button
            type="button"
            className={`sidebar-toggle__btn${skin.mode === "gradient" ? " is-selected" : ""}`}
            onClick={() => setSkin((prev) => ({ ...prev, mode: "gradient" }))}
          >
            Gradient
          </button>
        </div>
        <div className="sidebar-color-row">
          <label className="sidebar-color">
            <span>Primary</span>
            <input
              type="color"
              value={skin.primary}
              onChange={(event) => setSkin((prev) => ({ ...prev, primary: event.target.value }))}
            />
          </label>
          {skin.mode === "gradient" ? (
            <label className="sidebar-color">
              <span>Secondary</span>
              <input
                type="color"
                value={skin.secondary}
                onChange={(event) =>
                  setSkin((prev) => ({ ...prev, secondary: event.target.value }))
                }
              />
            </label>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
