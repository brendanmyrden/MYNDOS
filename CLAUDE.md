# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Vite dev server
npm run build   # tsc -b && vite build
npm run lint    # eslint
```

No test runner is configured.

## Architecture

MYND OS is a modular personal dashboard SPA. `src/main.tsx` mounts `BrowserRouter > ThemeProvider > App`. `src/App.tsx` owns all routes. When "Homescreen Cubed" is on, `<Sidebar>` + `<Routes>` are replaced by `<HomeScreenGrid>` (a full-screen tile launcher).

### Module Pattern

Each module lives at `src/modules/<name>/{index.tsx, schema.ts, types.ts}`. The `index.tsx` exports a wrapper that provides the module's theme:

```tsx
export default function MyModule() {
  return (
    <ModuleThemeProvider moduleName="mymodule">
      <MyModuleContent />   // calls useModuleTheme(), injects CSS vars inline
    </ModuleThemeProvider>
  );
}
```

The inner component injects all palette values as inline CSS custom properties (e.g. `--raphi-accent`, `--module-bg`) so `src/styles/cyberpunk.css` can reference them without scoped class names.

Standard module header: `<ModuleCube>` (double-click to customize emoji/color) + title + `<PlusCube>` (reveals `<ModuleHoverPanel>` widget picker).

To add a module: create the three files, add a `<Route>` in `App.tsx`, and add an entry to `src/core/navigation/moduleLinks.ts`.

### Widget System

Widgets are optional panels toggled per module, stored in `localStorage` under `myndos.widgets.{moduleName}.v1`. Each widget component reads its key from `useWidgetState(moduleName)` and returns `null` when disabled. `ModuleHoverPanel` is the picker UI; `widgetStorage.ts` owns the `WidgetState` type and fires `widget-state-change` on writes.

Two widgets are module-specific and gated inside `ModuleHoverPanel`: `TradeCoreWidget` (streams only), `LyricsWidget` (myrryr only).

### Theme System

- **Global** (`ThemeContext`): single `themeColor`, stored in `localStorage.themeColor`
- **Per-module** (`ModuleThemeContext`): full palette stored in `localStorage.moduleTheme_{moduleName}`; supports preview mode (`cancelPreview()` reverts, `saveChanges()` commits)

The Sidebar "Match current module" toggle reads the active module's `moduleTheme_*` and applies it to the sidebar's own CSS vars.

Cross-component state propagates via custom window events: `widget-state-change`, `module-theme-change`, `homescreen-cubed-change`.

### Data / Supabase

Most modules use localStorage directly. For data-heavy modules follow the `raphi` pattern: `localStore.ts` (localStorage CRUD) + `remoteStore.ts` (Supabase CRUD) + `store.ts` (facade with Supabase fallback to local on error). Supabase is optional — `isSupabaseConfigured` in `src/services/supabaseClient.ts` is `true` only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.

### Debug

In dev, append `?debugPointer` or `?debugOverlay` to the URL to activate watchdogs in `src/debug/overlayDebug.ts`.
