import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { moduleLinks } from "../navigation/moduleLinks";
import { loadModuleThemeValues } from "../theme/modulePalettes";
import { ModuleThemeProvider, useModuleTheme } from "../state/ModuleThemeContext";
import SettingsModal from "./SettingsModal";
import { deleteTheme, getActiveTheme, getThemes, setTheme } from "../theme/themeEngine";
import { designSystems, getActiveDesignSystem, setDesignSystem } from "../theme/designSystems";
import type { AppTheme } from "../theme/themeEngine";
import "./ThemesPage.css";

const paletteLinks = [
  ...moduleLinks,
  { name: "Themes", path: "/themes", moduleName: "themes", icon: "🎨" },
];

function ThemesPageContent() {
  const {
    moduleThemeColor,
    moduleBackgroundGradient,
    moduleFont,
    moduleText,
    moduleMuted,
    moduleAccent,
    moduleAccent2,
    moduleBorder,
    moduleGlass,
    moduleButtonBg,
  } = useModuleTheme();
  const [themes, setThemes] = useState<AppTheme[]>(getThemes);
  const [activeTheme, setActiveTheme] = useState<AppTheme>(getActiveTheme);
  const [activeSystemId, setActiveSystemId] = useState(() => getActiveDesignSystem().id);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [, setModulePaletteVersion] = useState(0);
  const pageStyle = {
    ["--bg" as string]: moduleThemeColor,
    ["--bg-raised" as string]: moduleGlass,
    ["--primary" as string]: moduleAccent,
    ["--secondary" as string]: moduleAccent2,
    ["--text" as string]: moduleText,
    ["--text-muted" as string]: moduleMuted,
    ["--border" as string]: moduleBorder,
    ["--outline" as string]: moduleBorder,
    ["--gradient-page" as string]: moduleBackgroundGradient,
    ["--gradient-header" as string]: `linear-gradient(125deg, color-mix(in srgb, ${moduleAccent} 22%, ${moduleThemeColor}), color-mix(in srgb, ${moduleAccent2} 18%, ${moduleThemeColor}))`,
    ["--gradient-sidebar-button" as string]: moduleButtonBg,
    ["--font-family" as string]: moduleFont,
  } as CSSProperties;

  useEffect(() => {
    const refreshModulePalettes = () => setModulePaletteVersion((version) => version + 1);
    window.addEventListener("module-theme-change", refreshModulePalettes);
    window.addEventListener("storage", refreshModulePalettes);
    return () => {
      window.removeEventListener("module-theme-change", refreshModulePalettes);
      window.removeEventListener("storage", refreshModulePalettes);
    };
  }, []);

  const handleSelectTheme = (theme: AppTheme) => {
    setTheme(theme);
    setActiveTheme(getActiveTheme());
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    if (themes.length <= 1) return;

    deleteTheme(id);
    setThemes(getThemes());
    if (id === activeTheme.id) setActiveTheme(getActiveTheme());
  };

  return (
    <main className="themes-page" style={pageStyle}>
      <header className="themes-page__header">
        <div>
          <p className="themes-page__eyebrow">MYND OS</p>
          <h1 className="themes-page__title">Themes</h1>
          <p className="themes-page__subtitle">Choose your design system and manage the colours saved on this device.</p>
        </div>
        <button type="button" className="themes-page__button themes-page__button--primary" onClick={() => setIsSettingsOpen(true)}>
          Edit page and button colours
        </button>
      </header>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        useModuleTheme
        title="Themes page colours"
        showPlusCube={false}
        showPreviewAction={false}
      />

      <section className="themes-page__systems" aria-labelledby="design-systems-title">
        <div className="themes-page__module-heading">
          <div>
            <p className="themes-page__eyebrow">Appearance library</p>
            <h2 id="design-systems-title" className="themes-page__editor-title">Design systems</h2>
          </div>
          <p className="themes-page__editor-note">A system covers typography, spacing, surfaces, layout, motion, and colours. Your choice is saved on this device.</p>
        </div>
        <div className="themes-page__systems-grid">
          {designSystems.map((system) => (
            <button
              key={system.id}
              type="button"
              className={`themes-page__system${activeSystemId === system.id ? " is-active" : ""}`}
              onClick={() => setActiveSystemId(setDesignSystem(system.id).id)}
              aria-pressed={activeSystemId === system.id}
            >
              <span className="themes-page__system-heading">
                <strong>{system.name}</strong>
                <span>{activeSystemId === system.id ? "Default on this device" : "Use this system"}</span>
              </span>
              <span className="themes-page__system-description">{system.description}</span>
              <span className="themes-page__system-parts">Typography · Spacing · Surfaces · Layout · Motion · Colours</span>
            </button>
          ))}
        </div>
      </section>

      <section className="themes-page__module-section" aria-labelledby="module-palettes-title">
        <div className="themes-page__module-heading">
          <div>
            <p className="themes-page__eyebrow">Page palettes</p>
            <h2 id="module-palettes-title" className="themes-page__editor-title">Module colours</h2>
          </div>
          <p className="themes-page__editor-note">Your saved colours appear here and on each page's sidebar button.</p>
        </div>
        <div className="themes-page__module-grid">
          {paletteLinks.map((module) => {
            const palette = loadModuleThemeValues(module.moduleName);
            const style = {
              "--module-preview-bg": palette.moduleBackgroundGradient,
              "--module-preview-base": palette.moduleThemeColor,
              "--module-preview-primary": palette.sidebarButtonPrimary,
              "--module-preview-secondary": palette.sidebarButtonSecondary,
              "--module-preview-outline": module.moduleName === "syyr"
                ? palette.sidebarButtonSecondary
                : palette.sidebarButtonPrimary,
              "--module-preview-leading": module.moduleName === "syyr"
                ? palette.sidebarButtonSecondary
                : palette.sidebarButtonPrimary,
              "--module-preview-supporting": module.moduleName === "syyr"
                ? palette.sidebarButtonPrimary
                : palette.sidebarButtonSecondary,
              "--module-preview-text": palette.moduleText,
            } as CSSProperties;

            return (
              <Link
                key={module.path}
                to={module.path}
                className="themes-page__module-card"
                style={style}
                aria-label={`Open ${module.name} page`}
              >
                <div className="themes-page__module-card-top">
                  <span className="themes-page__module-icon" aria-hidden="true">{module.icon}</span>
                  <span className="themes-page__module-open" aria-hidden="true">Open page ↗</span>
                </div>
                <h3 className="themes-page__module-name">{module.name}</h3>
                <span
                  className="themes-page__module-button-preview"
                  data-style={palette.sidebarButtonStyle}
                  aria-hidden="true"
                >
                  {module.name}
                </span>
                <div className="themes-page__module-colours">
                  {[
                    { label: "Base", value: palette.moduleThemeColor },
                    { label: "Primary", value: palette.moduleAccent },
                    { label: "Secondary", value: palette.moduleAccent2 },
                  ].map((colour) => (
                    <span key={colour.label} className="themes-page__module-colour">
                      <span className="themes-page__module-swatch" style={{ background: colour.value }} aria-hidden="true" />
                      <span>{colour.label}<strong>{colour.value}</strong></span>
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="themes-page__app-themes" aria-labelledby="app-themes-title">
        <div className="themes-page__module-heading">
          <div>
            <p className="themes-page__eyebrow">Within the current system</p>
            <h2 id="app-themes-title" className="themes-page__editor-title">Saved app colour themes</h2>
          </div>
          <p className="themes-page__editor-note">These change the app palette. Your module palettes, sidebar, and cubes keep their own saved choices.</p>
        </div>
      <div className="themes-page__grid" aria-label="Saved app colour themes">
        {themes.map((theme) => {
          const isActive = theme.id === activeTheme.id;

          return (
            <article
              key={theme.id}
              className={`themes-page__card${isActive ? " is-active" : ""}`}
              onClick={() => handleSelectTheme(theme)}
              aria-label={`Use ${theme.name} theme`}
              aria-current={isActive ? "true" : undefined}
            >
              <div className="themes-page__card-heading">
                <div>
                  <h2 className="themes-page__card-name">{theme.name}</h2>
                  <span className="themes-page__status">
                    {isActive ? "Active theme" : "Select theme"}
                  </span>
                </div>
                <div className="themes-page__swatches" aria-label={`${theme.name} colors`}>
                  <span className="themes-page__swatch" style={{ background: theme.bg }} title={`Background: ${theme.bg}`} />
                  <span className="themes-page__swatch" style={{ background: theme.primary }} title={`Primary: ${theme.primary}`} />
                  <span className="themes-page__swatch" style={{ background: theme.secondary }} title={`Secondary: ${theme.secondary}`} />
                </div>
              </div>

              <button
                type="button"
                className="themes-page__delete"
                onClick={(event) => handleDelete(event, theme.id)}
                disabled={themes.length <= 1}
                title={themes.length <= 1 ? "At least one theme is required" : `Delete ${theme.name}`}
              >
                Delete
              </button>
            </article>
          );
        })}
      </div>
      </section>
    </main>
  );
}

export default function ThemesPage() {
  return (
    <ModuleThemeProvider moduleName="themes">
      <ThemesPageContent />
    </ModuleThemeProvider>
  );
}
