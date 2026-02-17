# AI Context for MYND OS

**Role:** Single source of truth for how MYND OS is structured, extended, and maintained.  
**Last Updated:** 2025-02-12  
**Stage:** Early alpha / modular MVP

---

## Doc flow

```
§1 Vision → §2 UX → §3 Principles → §4 Stack → §5 Structure → §6 Patterns → §7 AI rules → §8 Usage → §9 Milestones
```

- Each section: **high level** (what & why) first, then **low level** (how) in bullets.

---

## §1 Project vision

**High level**

- MYND OS = privacy-first personal hub / “second brain” / life OS.
- One unified personal database; modules (notes, tasks, calendar, finance, health, knowledge base, journaling, AI workspace) plug into it.
- User owns one place; adding or removing a module does not break or silo the system.

**Low level**

- Core provides: data layer, auth surface, UI shell, module registry.
- Modules declare schema + UI; they communicate via shared patterns (events, optional sync).
- Local-first and offline-capable by default; cloud/sync only when explicit and consented.

---

## §2 UX direction

**High level**

- User-focused, experience-oriented; single coherent system that solves complex needs without clutter.
- Aesthetic: cyberpunk, forward-thinking, futuristic — distinctive and modern.
- Outcome: calm but powerful; advanced workflows (multi-module, sync, dense data) stay manageable.

**Low level**

- Visual: cyberpunk-inspired (`cyberpunk.css`), clear hierarchy, purposeful motion (Motion).
- Flows optimized for real tasks; complex needs addressable in-app.
- Shared widgets and patterns across modules for a charted, predictable experience.

---

## §3 Design principles (non-negotiables)

Apply to every change — core and modules.

| Principle | Rule |
|-----------|------|
| Local-first | Prefer `localStorage` / in-memory; cloud only when configured and consented. |
| Data ownership | No unnecessary cloud; Supabase only where user chose sync; graceful degradation when unconfigured. |
| Unified data | Consistent entity/schema mindset; no silos; cross-module refs (e.g. task IDs) typed. |
| Loose coupling | No module imports another’s internals; central registry + `ModuleManifest` only. |
| Logic vs UI | Business logic and data access in stores/services; components consume state and call APIs. |
| Data layer only | All reads/writes via store facade or core storage; no direct `localStorage`/Supabase in components. |
| One facade per module | One `store.ts` owns all persistence for that module’s entities. |
| Composition | Reuse via components, hooks, shared widgets — not inheritance. |
| Module surface | Each module: `index.tsx`, `schema.ts`, `types.ts`; add/remove = registry only. |
| Versioned keys | Every `localStorage` key has a version suffix (e.g. `myndos.widgets.${moduleId}.v1`). |
| Graceful degradation | Backend missing → fall back to local; never block the user. |

---

## §4 Tech stack

**High level:** React 19 + TypeScript, Vite 7, Zustand, Tailwind 4; SPA with Supabase integration prepared; modularity via ModuleManifest + central registry.

### §4.1 Frontend

- React 19.x, TypeScript 5.9.
- State: Zustand (global/session), module stores (feature data), React state (local UI only).
- Styling: Tailwind 4 + `cyberpunk.css`, `global.css`.
- UI: Custom components in `core/` and `components/`; Lucide; Motion; no heavy component library.
- Build: Vite 7 + `@vitejs/plugin-react`.

### §4.2 Backend & Supabase

- SPA only; no separate backend server.
- **Supabase:** Integration prepared and intended.
  - Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  - Client: `src/services/supabaseClient.ts` → `isSupabaseConfigured`, `requireSupabase()`.
  - Pattern: `remoteStore.ts` + `localStore.ts` behind one `store.ts` facade; use remote when configured with local fallback on error or when unconfigured.
  - Auth: Supabase Auth when client configured; core `user`/`session` in `src/core/schema.ts`; flows in progress.
- DB: localStorage (local); Supabase Postgres (sync when configured).
- No ORM; raw client + SQL (e.g. `supabase/raphi.sql`).

### §4.3 Modularity

- **ModuleManifest:** `id`, `name`, `path`, `icon`, root component (or lazy loader); optional schema ref, ordering.
- **Registry:** Single source of truth (e.g. `src/core/navigation/` or `src/core/registry/`); sidebar, homescreen, router read from it.
- **Module folder:** `src/modules/<moduleId>/` → `index.tsx`, `schema.ts`, `types.ts`; optional `store.ts`, `localStore.ts`, `remoteStore.ts`.
- **Communication:** Custom DOM events (`widget-state-change`, `table-state-change`, `homescreen-cubed-change`); core services keyed by `moduleId`; no module-to-module calls.
- **Add module:** Create folder + manifest → register in registry → routes/nav from registry (no manual `<Route>` per module in `App.tsx`).

### §4.4 Data access layer (strict)

- One store facade (`store.ts`) per module = only public API for that module’s reads/writes.
- Behind facade: `localStore.ts` and/or `remoteStore.ts`; local-first; all branching in store layer.
- Core-owned: widget toggles, table state, sidebar order, theme → `core/widgets/*Storage.ts` or core services; versioned, module-scoped keys.
- No persistence in UI: no `localStorage`, Supabase, or fetch in components or UI-only hooks.
- Validate/normalize at store boundary; components receive typed, safe data.

### §4.5 Auth & security

- Supabase Auth when client configured; core `user`/`session` in `src/core/schema.ts`.
- No secrets in client; `import.meta.env.VITE_*` for public config only.

### §4.6 Deployment

- Web SPA (Vite build → static); dev `127.0.0.1:5173`. Tauri/Electron/PWA not in stack yet.

### §4.7 Other

- react-router-dom, Motion, lucide-react, @supabase/supabase-js. Validation/forms/dates: add when needed; small, focused libs.

---

## §5 Folder structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── core/
│   ├── schema.ts
│   ├── layout/
│   ├── navigation/   # Registry, Sidebar, HomeScreenGrid, homescreen
│   ├── state/
│   └── widgets/      # Shared widgets + storage hooks
├── dashboards/
├── modules/
│   └── <moduleId>/   # index, schema, types, [store, localStore, remoteStore]
├── services/supabaseClient.ts
├── styles/           # global.css, cyberpunk.css
├── components/ui/
└── lib/utils.ts
supabase/             # SQL (e.g. raphi.sql)
docs/
├── Agents.md         # Quick orientation → points here
└── AIcontext.md      # This file
```

---

## §6 Code patterns & conventions

- **Files:** PascalCase components (`TableWidget.tsx`); camelCase utils/hooks/stores (`useWidgetState.ts`, `tableStorage.ts`); per module: `schema.ts`, `types.ts`.
- **Hooks:** `use` prefix; shared in `core/widgets/` or in module; pass `moduleId` when needed.
- **Data:** Module data → `store.ts` only; core shared → `core/widgets/*Storage.ts` keyed by `moduleId`.
- **Storage keys:** Versioned, namespaced (`myndos.<feature>.<scope>.v1`); defined only in data layer; parse errors → safe defaults.
- **Registry:** Shell and nav use registry only; new module = one manifest + register.
- **Errors:** Fallback inside data layer; `console.error` in dev; avoid throwing in UI when fallback exists.

| Never | Always |
|-------|--------|
| Cross-module imports; logic/persistence in components; `localStorage`/Supabase in components or UI hooks; unversioned keys; assuming Supabase configured; duplicate module list outside registry | Type public surfaces; store facade for module data; `moduleId`-scoped widget helpers; register via registry + `ModuleManifest` |

---

## §7 AI coding guidelines (13 rules)

1. Read this file first; align with §1–3 before features or refactors.
2. Prefer new modules: self-contained feature → `src/modules/<id>/` + manifest in registry only.
3. Right layer: UI in components; data access in store facade or core storage only.
4. One store facade per module; validate at boundary; components call store APIs only.
5. Export from `types.ts` and `schema.ts`; strict TypeScript; version in keys/migrations (e.g. `v1`).
6. Add module: `index.tsx`, `schema.ts`, `types.ts`, `ModuleManifest` → register → routes/nav from registry; no cross-module wiring.
7. Supabase only in data layer (`remoteStore.ts`); `isSupabaseConfigured` or `requireSupabase()`; local fallback + single `store.ts`; never from component.
8. Widgets: `useWidgetState(moduleId)` and core storage; new type = extend `WidgetState` in `widgetStorage.ts`, default off, add launcher toggle.
9. Cross-cutting UI state: `window.dispatchEvent(new CustomEvent(...))`; small, typed payloads.
10. Styling: Tailwind + `widgets.css` / `cyberpunk.css`; inline only for dynamic values.
11. Commits: scoped (e.g. `feat(raphi): local fallback when Supabase fails`).
12. Avoid: cross-module imports; logic/persistence in components; `localStorage`/Supabase/fetch in UI; extra global state; breaking local-first; duplicate module list.
13. When in doubt: smaller change; composition over clever abstraction; persisted data → data layer.

---

## §8 How to use this file

- **Who:** Humans and AI agents working on MYND OS.
- **When:** Session start or architectural / cross-cutting changes.
- **How:** In Cursor: `@docs/AIcontext.md` or include in project context.
- **Companion:** `docs/Agents.md` gives quick orientation and decision flow; full rules and rationale are here.

---

## §9 Milestones & pain points

- Registry as single source for nav and routes; migrate `moduleLinks`/manual routes.
- Unified schema: shared entity model, optional cross-module refs.
- Auth: sign-in/sign-out and session through shell and modules.
- Sync UX: “enable sync” and conflict handling (local + remote).
- Widget/dashboard consistency: reuse TableWidget, MatrixTimer; clear rule for new widget vs reuse.

---

<!-- Single source of truth for MYND OS. When in doubt → AIcontext.md. -->
