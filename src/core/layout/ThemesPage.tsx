import { useState } from "react";
import type { MouseEvent } from "react";
import {
  deleteTheme,
  getActiveTheme,
  getThemes,
  saveTheme,
  setTheme,
} from "../theme/themeEngine";
import type { AppTheme } from "../theme/themeEngine";
import "./ThemesPage.css";

const createThemeId = (name: string): string => {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "theme";
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${slug}-${uniquePart}`;
};

export default function ThemesPage() {
  const [themes, setThemes] = useState<AppTheme[]>(() => getThemes());
  const [activeTheme, setActiveTheme] = useState<AppTheme>(() => getActiveTheme());

  const refreshThemes = () => {
    setThemes(getThemes());
    setActiveTheme(getActiveTheme());
  };

  const handleSelectTheme = (theme: AppTheme) => {
    setTheme(theme);
    setActiveTheme(getActiveTheme());
  };

  const handleSaveAsNew = () => {
    const requestedName = window.prompt("Name this theme");
    const name = requestedName?.trim();
    if (!name) return;

    const nextTheme: AppTheme = {
      ...getActiveTheme(),
      id: createThemeId(name),
      name,
    };

    saveTheme(nextTheme);
    setTheme(nextTheme);
    refreshThemes();
  };

  const handleUpdateCurrent = () => {
    saveTheme(getActiveTheme());
    refreshThemes();
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    if (themes.length <= 1) return;

    deleteTheme(id);
    refreshThemes();
  };

  return (
    <main className="themes-page">
      <header className="themes-page__header">
        <div>
          <p className="themes-page__eyebrow">MYND OS</p>
          <h1 className="themes-page__title">Themes</h1>
          <p className="themes-page__subtitle">Switch between your saved app themes.</p>
        </div>
        <div className="themes-page__actions">
          <button type="button" className="themes-page__button" onClick={handleUpdateCurrent}>
            Update current
          </button>
          <button
            type="button"
            className="themes-page__button themes-page__button--primary"
            onClick={handleSaveAsNew}
          >
            Save current as new theme
          </button>
        </div>
      </header>

      <section className="themes-page__grid" aria-label="Saved themes">
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
                  <span
                    className="themes-page__swatch"
                    style={{ background: theme.bg }}
                    title={`Background: ${theme.bg}`}
                  />
                  <span
                    className="themes-page__swatch"
                    style={{ background: theme.primary }}
                    title={`Primary: ${theme.primary}`}
                  />
                  <span
                    className="themes-page__swatch"
                    style={{ background: theme.secondary }}
                    title={`Secondary: ${theme.secondary}`}
                  />
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
      </section>
    </main>
  );
}
