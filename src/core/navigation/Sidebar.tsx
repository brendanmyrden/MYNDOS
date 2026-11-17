import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { moduleLinks } from "./moduleLinks";
import { getHomescreenCubed, setHomescreenCubed } from "./homescreen";
import { useSidebarButtonLayout } from "./sidebarLayout";
import { loadSidebarButtonContent, SIDEBAR_CONTENT_STORAGE_KEY } from "./sidebarButtonContent";
import type { SidebarButtonContent } from "./sidebarButtonContent";
import { setModuleCubeEmoji } from "../widgets/moduleCubeEmoji";
import { loadModuleThemeValues } from "../theme/modulePalettes";
import { getActiveTheme } from "../theme/themeEngine";
import { defaultSidebarOrder, defaultSidebarSkin } from "../theme/defaultAppearance";

type SidebarLink = {
  name: string;
  path: string;
  moduleName?: string;
  icon: string;
};

type EditingButton = { path: string; field: "name" | "icon" };

const FullEmojiPicker = lazy(() => import("emoji-picker-react"));

type SidebarSkin = {
  mode: "solid" | "gradient";
  primary: string;
  secondary: string;
  titleColor: string;
};

const ORDER_STORAGE_KEY = "myndos.sidebar.order.v1";
const SKIN_STORAGE_KEY = "myndos.sidebar.skin.v1";
const SYNC_STORAGE_KEY = "myndos.sidebar.syncModule.v1";

const unorderedDefaultLinks: SidebarLink[] = [
  ...moduleLinks.map(({ name, path, moduleName, icon }) => ({
    name,
    path,
    moduleName,
    icon,
  })),
  {
    name: "Themes",
    path: "/themes",
    moduleName: "themes",
    icon: "🎨",
  },
];

const defaultOrderIndex = (path: string): number => {
  const index = defaultSidebarOrder.indexOf(path as (typeof defaultSidebarOrder)[number]);
  return index < 0 ? defaultSidebarOrder.length : index;
};

const defaultLinks: SidebarLink[] = [...unorderedDefaultLinks].sort(
  (first, second) => defaultOrderIndex(first.path) - defaultOrderIndex(second.path)
);

const defaultSkin: SidebarSkin = defaultSidebarSkin;

type SidebarButtonTheme = {
  style: "solid" | "gradient";
  primary: string;
  secondary: string;
};

type ListPointerDrag = {
  path: string;
  pointerId: number;
  startX: number;
  startY: number;
  startCenterY: number;
  startScrollTop: number;
  overPath: string | null;
  isDragging: boolean;
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
    if (
      parsed.primary === "#0b1424" &&
      parsed.secondary === "#291436" &&
      parsed.titleColor === "#7df9ff"
    ) {
      return defaultSkin;
    }
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
  const theme = loadModuleThemeValues(moduleName);
  return {
    backgroundGradient: theme.moduleBackgroundGradient,
    accent: theme.moduleAccent,
    accent2: theme.moduleAccent2,
    themeColor: theme.moduleThemeColor,
  };
};

const loadModuleButtonTheme = (moduleName?: string): SidebarButtonTheme => {
  if (!moduleName) {
    const theme = getActiveTheme();
    return {
      style: "gradient",
      primary: theme.primary,
      secondary: theme.secondary,
    };
  }
  const theme = loadModuleThemeValues(moduleName);
  return {
    style: theme.sidebarButtonStyle,
    primary: theme.sidebarButtonPrimary,
    secondary: theme.sidebarButtonSecondary,
  };
};

const getButtonBackground = (theme: SidebarButtonTheme, oceanBlue = false) => {
  const leading = oceanBlue ? theme.secondary : theme.primary;
  const supporting = oceanBlue ? theme.primary : theme.secondary;
  if (theme.style === "solid") {
    return `linear-gradient(130deg, color-mix(in srgb, ${leading} 72%, #000) 0%, color-mix(in srgb, ${leading} 35%, #000) 48%, #000 100%)`;
  }
  return `linear-gradient(130deg, color-mix(in srgb, ${leading} 72%, #000) 0%, color-mix(in srgb, ${supporting} 42%, #000) 48%, #000 100%)`;
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

export default function Sidebar({ onMatchedBackgroundChange }: { onMatchedBackgroundChange: (background: string | null) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [links, setLinks] = useState(() => reconcileLinks(loadStoredOrder()));
  const [draggingPath, setDraggingPath] = useState<string | null>(null);
  const [dragOverPath, setDragOverPath] = useState<string | null>(null);
  const [listDragOffsetY, setListDragOffsetY] = useState(0);
  const listPointerDragRef = useRef<ListPointerDrag | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const [trace, setTrace] = useState<{ path: string; id: number } | null>(null);
  const traceSequenceRef = useRef(0);
  const [skin, setSkin] = useState<SidebarSkin>(() => loadSkin());
  const [buttonContent, setButtonContent] = useState<Record<string, SidebarButtonContent>>(loadSidebarButtonContent);
  const [editingButton, setEditingButton] = useState<EditingButton | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<CSSProperties>({});
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [syncToModule, setSyncToModule] = useState<boolean>(() => loadSyncSetting());
  const [homescreenCubed, setHomescreenCubedState] = useState<boolean>(() => getHomescreenCubed());
  const buttonLayout = useSidebarButtonLayout();
  const [isSkinOpen, setIsSkinOpen] = useState(false);
  const [, setThemeVersion] = useState(0);
  const suppressNextClickRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(links.map((link) => link.path)));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(SKIN_STORAGE_KEY, JSON.stringify(skin));
  }, [skin]);

  useLayoutEffect(() => {
    localStorage.setItem(SIDEBAR_CONTENT_STORAGE_KEY, JSON.stringify(buttonContent));
  }, [buttonContent]);

  useEffect(() => {
    if (!editingButton) return;
    editInputRef.current?.focus();
    editInputRef.current?.select();
  }, [editingButton]);

  useEffect(() => () => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
  }, []);

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
    return links.find(
      (link) => location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
    )?.moduleName;
  }, [links, location.pathname]);

  const modulePalette = syncToModule ? loadModuleSidebarPalette(activeModuleName) : null;
  const matchedBackground = modulePalette?.backgroundGradient ?? null;

  useLayoutEffect(() => {
    onMatchedBackgroundChange(matchedBackground);
  }, [matchedBackground, onMatchedBackgroundChange]);

  const sidebarStyle = (() => {
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
  })();

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
    suppressNextClickRef.current = true;
    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 250);
    setLinks((prev) => moveLink(prev, draggedPath, path));
    setDragOverPath(null);
    setDraggingPath(null);
  };

  const handleDragEnd = () => {
    setDragOverPath(null);
    setDraggingPath(null);
  };

  const handleListPointerDown = (path: string) => (event: PointerEvent<HTMLButtonElement>) => {
    if (buttonLayout !== "list" || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    listPointerDragRef.current = {
      path,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCenterY: rect.top + rect.height / 2,
      startScrollTop: linksRef.current?.scrollTop ?? 0,
      overPath: null,
      isDragging: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleListPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = listPointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || buttonLayout !== "list") return;
    const offsetY = event.clientY - drag.startY;
    if (!drag.isDragging && Math.hypot(event.clientX - drag.startX, offsetY) < 6) return;
    event.preventDefault();
    if (!drag.isDragging) {
      drag.isDragging = true;
      setDraggingPath(drag.path);
    }
    setListDragOffsetY(offsetY);

    const container = linksRef.current;
    if (!container) return;
    const scrollDelta = container.scrollTop - drag.startScrollTop;
    const draggedCenterY = drag.startCenterY + offsetY - scrollDelta;
    const candidates = Array.from(container.querySelectorAll<HTMLButtonElement>("button.sidebar-link"))
      .filter((button) => button.dataset.path !== drag.path)
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return { path: button.dataset.path ?? "", centerY: rect.top + rect.height / 2 };
      });
    const crossed = candidates.filter(({ centerY }) =>
      offsetY > 0
        ? centerY > drag.startCenterY - scrollDelta && centerY <= draggedCenterY
        : centerY < drag.startCenterY - scrollDelta && centerY >= draggedCenterY
    );
    const target = crossed.sort((a, b) => offsetY > 0 ? b.centerY - a.centerY : a.centerY - b.centerY)[0];
    drag.overPath = target?.path ?? null;
    setDragOverPath(drag.overPath);
  };

  const handleListPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = listPointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    listPointerDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.isDragging) {
      suppressNextClickRef.current = true;
      window.setTimeout(() => { suppressNextClickRef.current = false; }, 250);
      const dropPath = drag.overPath;
      if (dropPath) setLinks((prev) => moveLink(prev, drag.path, dropPath));
    }
    setListDragOffsetY(0);
    setDraggingPath(null);
    setDragOverPath(null);
  };

  const handleListPointerCancel = () => {
    if (!listPointerDragRef.current) return;
    listPointerDragRef.current = null;
    setListDragOffsetY(0);
    setDraggingPath(null);
    setDragOverPath(null);
  };

  const cancelPendingNavigation = () => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current = null;
  };

  const navigateTo = (path: string) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    setEditingButton(null);
    setShowEmojiPicker(false);
    setTrace({ path, id: ++traceSequenceRef.current });
    navigate(path);
  };

  const handleNavigate = (path: string) => (event: MouseEvent<HTMLButtonElement>) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    if (event.detail > 0 && hit?.closest(".sidebar-link__icon, .sidebar-link__label")) {
      cancelPendingNavigation();
      navigationTimerRef.current = setTimeout(() => {
        navigationTimerRef.current = null;
        navigateTo(path);
      }, 350);
      return;
    }
    cancelPendingNavigation();
    navigateTo(path);
  };

  const beginEdit = (path: string, field: EditingButton["field"], value: string) => {
    cancelPendingNavigation();
    setEditingButton({ path, field });
    setEditDraft(value);
    setShowEmojiPicker(false);
  };

  const closeEdit = (path: string) => {
    setShowEmojiPicker(false);
    setEditingButton(null);
    requestAnimationFrame(() => {
      const button = Array.from(linksRef.current?.querySelectorAll<HTMLButtonElement>(".sidebar-link") ?? [])
        .find((candidate) => candidate.dataset.path === path);
      button?.focus();
    });
  };

  const saveEdit = () => {
    if (!editingButton) return;
    const value = editDraft.trim();
    if (!value) {
      editInputRef.current?.focus();
      return;
    }
    const { path, field } = editingButton;
    setButtonContent((current) => ({
      ...current,
      [path]: { ...current[path], [field]: value },
    }));
    if (field === "icon") {
      const moduleName = links.find((link) => link.path === path)?.moduleName;
      if (moduleName && moduleName !== "themes") setModuleCubeEmoji(moduleName, value);
    }
    closeEdit(path);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (editingButton) closeEdit(editingButton.path);
    }
  };

  const handleButtonKeyDown = (link: SidebarLink, name: string, icon: string) =>
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "F2") return;
      event.preventDefault();
      beginEdit(link.path, event.shiftKey ? "icon" : "name", event.shiftKey ? icon : name);
    };

  const openEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const height = Math.min(440, window.innerHeight - 24);
    setPickerPosition({
      position: "fixed",
      ["--sidebar-link-border" as string]: getComputedStyle(event.currentTarget).getPropertyValue("--sidebar-link-border"),
      left: Math.max(12, Math.min(rect.right + 12, window.innerWidth - width - 12)),
      top: Math.max(12, Math.min(rect.top, window.innerHeight - height - 12)),
      width,
      height,
    });
    setShowEmojiPicker(true);
  };

  const handleButtonDoubleClick = (link: SidebarLink, name: string, icon: string) =>
    (event: MouseEvent<HTMLButtonElement>) => {
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      if (hit?.closest(".sidebar-link__icon")) beginEdit(link.path, "icon", icon);
      else if (hit?.closest(".sidebar-link__label")) beginEdit(link.path, "name", name);
    };

  if (homescreenCubed) {
    return null;
  }

  return (
    <aside
      className={`sidebar-shell sidebar-shell--${buttonLayout}${syncToModule && activeModuleName ? " sidebar-shell--module-match" : ""}`}
      style={sidebarStyle}
    >
      <div className="sidebar-header">
        <div>
          <div className="sidebar-title">MYND OS</div>
          <div className="sidebar-subtitle">navigation matrix</div>
        </div>
        <div className="sidebar-orb" aria-hidden="true" />
      </div>

      <div className="sidebar-links" ref={linksRef}>
        {links.map((link) => {
          const name = buttonContent[link.path]?.name ?? link.name;
          const icon = buttonContent[link.path]?.icon ?? link.icon;
          const isEditing = editingButton?.path === link.path;
          const isActive = location.pathname === link.path;
          const isDragging = draggingPath === link.path;
          const isOver = dragOverPath === link.path && !isDragging;
          const buttonTheme = loadModuleButtonTheme(link.moduleName);
          const oceanBlue = link.moduleName === "syyr";
          const borderColor = oceanBlue ? buttonTheme.secondary : buttonTheme.primary;
          const glowColor = borderColor;
          const linkStyle = {
            ["--sidebar-link-accent" as string]: buttonTheme.primary,
            ["--sidebar-link-accent-soft" as string]: `color-mix(in srgb, ${glowColor} 30%, transparent)`,
            ["--sidebar-link-accent-bright" as string]: `color-mix(in srgb, ${glowColor} 64%, transparent)`,
            ["--sidebar-link-accent-2" as string]: buttonTheme.secondary,
            ["--sidebar-link-bg" as string]: getButtonBackground(buttonTheme, oceanBlue),
            ["--sidebar-link-border" as string]: borderColor,
            ...(buttonLayout === "list" && isDragging
              ? { transform: `translateY(${listDragOffsetY}px)` }
              : {}),
          } as CSSProperties;
          return (
            isEditing ? (
              <div
                key={link.path}
                className="sidebar-link sidebar-link--editing"
                style={linkStyle}
                role="group"
                aria-label={`Edit ${editingButton.field === "name" ? "name" : "emoji"} for ${name}`}
              >
                {editingButton.field === "icon" ? (
                  <div className="sidebar-link__edit-icon">
                    <input
                      ref={editInputRef}
                      className="sidebar-link__edit-input sidebar-link__edit-input--icon"
                      aria-label={`Emoji for ${name}`}
                      value={editDraft}
                      onChange={(event) => setEditDraft(event.target.value)}
                      onKeyDown={handleEditKeyDown}
                      maxLength={32}
                    />
                    <button type="button" className="sidebar-link__edit-action" onClick={openEmojiPicker} aria-label="Choose emoji" title="Choose emoji">☺</button>
                  </div>
                ) : <span className="sidebar-link__icon" aria-hidden="true">{icon}</span>}
                {editingButton.field === "name" ? (
                  <input
                    ref={editInputRef}
                    className="sidebar-link__edit-input sidebar-link__edit-input--name"
                    aria-label={`Name for ${name}`}
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    onKeyDown={handleEditKeyDown}
                    maxLength={40}
                  />
                ) : <span className="sidebar-link__label">{name}</span>}
                <div className="sidebar-link__edit-actions">
                  <button type="button" className="sidebar-link__edit-action" onClick={saveEdit} disabled={!editDraft.trim()} aria-label="Save change" title="Save (Enter)">✓</button>
                  <button type="button" className="sidebar-link__edit-action" onClick={() => closeEdit(link.path)} aria-label="Cancel edit" title="Cancel (Escape)">×</button>
                </div>
              </div>
            ) : <button
              key={link.path}
              type="button"
              className={`sidebar-link${isActive ? " is-active" : ""}${
                isDragging ? " is-dragging" : ""
              }${isOver ? " is-over" : ""}`}
              style={linkStyle}
              title={`${name} — double-click the name or emoji to edit; F2 edits name, Shift+F2 edits emoji`}
              aria-label={`${icon} ${name}`}
              aria-keyshortcuts="F2 Shift+F2"
              data-path={link.path}
              draggable={buttonLayout !== "list"}
              onClick={handleNavigate(link.path)}
              onDoubleClick={handleButtonDoubleClick(link, name, icon)}
              onKeyDown={handleButtonKeyDown(link, name, icon)}
              onPointerDown={handleListPointerDown(link.path)}
              onPointerMove={handleListPointerMove}
              onPointerUp={handleListPointerUp}
              onPointerCancel={handleListPointerCancel}
              onDragStart={handleDragStart(link.path)}
              onDragOver={handleDragOver(link.path)}
              onDrop={handleDrop(link.path)}
              onDragEnd={handleDragEnd}
            >
              <span
                className="sidebar-link__icon"
                aria-hidden="true"
                title="Double-click to edit emoji"
              >{icon}</span>
              <span
                className="sidebar-link__label"
                title="Double-click to edit name"
              >{name}</span>
              {trace?.path === link.path ? (
                <span key={trace.id} className="sidebar-link__trace" aria-hidden="true" />
              ) : null}
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
      {showEmojiPicker && editingButton?.field === "icon" ? createPortal(
        <div className="sidebar-emoji-picker" style={pickerPosition} role="dialog" aria-label="Choose sidebar emoji">
          <div className="sidebar-emoji-picker__heading">
            <span>Choose emoji</span>
            <button type="button" onClick={() => { setShowEmojiPicker(false); editInputRef.current?.focus(); }} aria-label="Close emoji picker">×</button>
          </div>
          <Suspense fallback={<div className="sidebar-emoji-picker__loading">Loading emojis…</div>}>
            <FullEmojiPicker
              theme="dark"
              width="100%"
              height="100%"
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiData) => {
                setEditDraft(emojiData.emoji);
                setShowEmojiPicker(false);
                requestAnimationFrame(() => editInputRef.current?.focus());
              }}
            />
          </Suspense>
        </div>,
        document.body
      ) : null}
    </aside>
  );
}
