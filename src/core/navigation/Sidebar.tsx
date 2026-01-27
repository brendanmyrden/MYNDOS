import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { moduleLinks } from "./moduleLinks";
import { getHomescreenCubed, setHomescreenCubed } from "./homescreen";

type SidebarLink = {
  name: string;
  path: string;
  moduleName?: string;
};

type SidebarSkin = {
  mode: "solid" | "gradient";
  primary: string;
  secondary: string;
  titleColor: string;
};

const ORDER_STORAGE_KEY = "myndos.sidebar.order.v1";
const SKIN_STORAGE_KEY = "myndos.sidebar.skin.v1";
const SYNC_STORAGE_KEY = "myndos.sidebar.syncModule.v1";

const defaultLinks: SidebarLink[] = moduleLinks.map(({ name, path, moduleName }) => ({
  name,
  path,
  moduleName,
}));

const defaultSkin: SidebarSkin = {
  mode: "gradient",
  primary: "#0b1424",
  secondary: "#291436",
  titleColor: "#7df9ff",
};

type SidebarButtonTheme = {
  style: "solid" | "gradient";
  primary: string;
  secondary: string;
  outline: string;
};

const DEFAULT_BUTTON_THEME: SidebarButtonTheme = {
  style: "gradient",
  primary: "#7df9ff",
  secondary: "#ff4fd8",
  outline: "#7df9ff",
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
      titleColor: parsed.titleColor || defaultSkin.titleColor,
    };
  } catch {
    return defaultSkin;
  }
};

const loadSyncSetting = (): boolean => {
  try {
    const stored = localStorage.getItem(SYNC_STORAGE_KEY);
    return stored ? JSON.parse(stored) === true : false;
  } catch {
    return false;
  }
};

const loadModuleSidebarPalette = (moduleName?: string) => {
  if (!moduleName) return null;
  try {
    const stored = localStorage.getItem(`moduleTheme_${moduleName}`);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return {
      backgroundGradient: parsed.moduleBackgroundGradient as string | undefined,
      accent: parsed.moduleAccent as string | undefined,
      accent2: parsed.moduleAccent2 as string | undefined,
      themeColor: parsed.moduleThemeColor as string | undefined,
    };
  } catch {
    return null;
  }
};

const loadModuleButtonTheme = (moduleName?: string): SidebarButtonTheme => {
  if (!moduleName) return DEFAULT_BUTTON_THEME;
  try {
    const stored = localStorage.getItem(`moduleTheme_${moduleName}`);
    if (!stored) return DEFAULT_BUTTON_THEME;
    const parsed = JSON.parse(stored);
    return {
      style:
        parsed.sidebarButtonStyle === "solid" || parsed.sidebarButtonStyle === "gradient"
          ? parsed.sidebarButtonStyle
          : DEFAULT_BUTTON_THEME.style,
      primary: parsed.sidebarButtonPrimary || DEFAULT_BUTTON_THEME.primary,
      secondary: parsed.sidebarButtonSecondary || DEFAULT_BUTTON_THEME.secondary,
      outline: parsed.sidebarButtonOutline || DEFAULT_BUTTON_THEME.outline,
    };
  } catch {
    return DEFAULT_BUTTON_THEME;
  }
};

const getButtonBackground = (theme: SidebarButtonTheme) => {
  if (theme.style === "solid") return theme.primary;
  return `linear-gradient(120deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
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
  const [syncToModule, setSyncToModule] = useState<boolean>(() => loadSyncSetting());
  const [homescreenCubed, setHomescreenCubedState] = useState<boolean>(() => getHomescreenCubed());
  const [isSkinOpen, setIsSkinOpen] = useState(true);
  const [, setThemeVersion] = useState(0);

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(links.map((link) => link.path)));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(skin));
  }, [skin]);

  useEffect(() => {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncToModule));
  }, [syncToModule]);

  useEffect(() => {
    const handleHomescreenChange = () => setHomescreenCubedState(getHomescreenCubed());
    window.addEventListener("homescreen-cubed-change", handleHomescreenChange);
    window.addEventListener("storage", handleHomescreenChange);
    return () => {
      window.removeEventListener("homescreen-cubed-change", handleHomescreenChange);
      window.removeEventListener("storage", handleHomescreenChange);
    };
  }, []);

  useEffect(() => {
    const handleThemeChange = () => setThemeVersion((prev) => prev + 1);
    window.addEventListener("module-theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("module-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const activeModuleName = useMemo(() => {
    return links.find((link) => link.path === location.pathname)?.moduleName;
  }, [links, location.pathname]);

  const sidebarStyle = useMemo(() => {
    const modulePalette = syncToModule ? loadModuleSidebarPalette(activeModuleName) : null;
    const moduleBackground = modulePalette?.backgroundGradient;
    const moduleAccent = modulePalette?.accent;
    const moduleAccent2 = modulePalette?.accent2;
    const background =
      syncToModule && moduleBackground
        ? moduleBackground
        : skin.mode === "solid"
          ? skin.primary
          : `linear-gradient(160deg, ${skin.primary} 0%, ${skin.secondary} 100%)`;
    const accent = syncToModule && moduleAccent ? moduleAccent : skin.primary;
    const accent2 = syncToModule && moduleAccent2 ? moduleAccent2 : skin.secondary;
    return {
      ["--sidebar-bg" as string]: background,
      ["--sidebar-accent" as string]: accent,
      ["--sidebar-accent-soft" as string]: hexToRgba(accent, 0.22),
      ["--sidebar-accent-glow" as string]: hexToRgba(accent, 0.45),
      ["--sidebar-accent-2" as string]: accent2,
      ["--sidebar-accent-2-soft" as string]: hexToRgba(accent2, 0.2),
      ["--sidebar-title-color" as string]: skin.titleColor,
    } as CSSProperties;
  }, [skin, syncToModule, activeModuleName]);

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

  if (homescreenCubed) {
    return null;
  }

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
          const buttonTheme = loadModuleButtonTheme(link.moduleName);
          const linkStyle = {
            ["--sidebar-link-accent" as string]: buttonTheme.primary,
            ["--sidebar-link-accent-soft" as string]: hexToRgba(buttonTheme.primary, 0.22),
            ["--sidebar-link-accent-2" as string]: buttonTheme.secondary,
            ["--sidebar-link-bg" as string]: getButtonBackground(buttonTheme),
            ["--sidebar-link-outline" as string]: buttonTheme.outline,
            ["--sidebar-link-outline-soft" as string]: hexToRgba(buttonTheme.outline, 0.4),
          } as CSSProperties;
          return (
            <button
              key={link.path}
              type="button"
              className={`sidebar-link${isActive ? " is-active" : ""}${
                isDragging ? " is-dragging" : ""
              }${isOver ? " is-over" : ""}`}
              style={linkStyle}
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

      <div
        className={`sidebar-controls${isSkinOpen ? " is-open" : " is-collapsed"}`}
        onMouseEnter={() => setIsSkinOpen(true)}
        onMouseLeave={() => setIsSkinOpen(false)}
      >
        <button
          type="button"
          className="sidebar-controls__title"
          onClick={() => setIsSkinOpen((prev) => !prev)}
          aria-expanded={isSkinOpen}
        >
          Sidebar skin
        </button>
        <div className="sidebar-controls__body">
            <div className="sidebar-sync">
              <span className="sidebar-sync__label">Match current module</span>
              <button
                type="button"
                className={`sidebar-sync__btn${syncToModule ? " is-selected" : ""}`}
                onClick={() => setSyncToModule((prev) => !prev)}
              >
                {syncToModule ? "On" : "Off"}
              </button>
            </div>
            <div className="sidebar-sync">
              <span className="sidebar-sync__label">Homescreen cubed</span>
              <button
                type="button"
                className={`sidebar-sync__btn${homescreenCubed ? " is-selected" : ""}`}
                onClick={() => {
                  const next = !homescreenCubed;
                  setHomescreenCubedState(next);
                  setHomescreenCubed(next);
                }}
              >
                {homescreenCubed ? "On" : "Off"}
              </button>
            </div>
            <div className="sidebar-color-row">
              <label className="sidebar-color">
                <span>Title</span>
                <input
                  type="color"
                  value={skin.titleColor}
                  onChange={(event) =>
                    setSkin((prev) => ({ ...prev, titleColor: event.target.value }))
                  }
                />
              </label>
            </div>
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
      </div>
    </aside>
  );
}
