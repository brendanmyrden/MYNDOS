# Agents — Quick orientation for MYND OS

**ROLE:** Entry point for AI agents. Points to full context; does not replace it.  

**CANONICAL RULES:** All rules + Rationale live in `docs/AIcontext.md`.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## FLOW

```
Read this → Load AIcontext.md → Decide layer (core vs module) → Apply §6 patterns + §7 rules
```

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## §1 Entry point

- **FULL DOC:** `docs/AIcontext.md` — single source of truth.
- **WHEN:** Session start; any architectural or cross-cutting change.
- **CURSOR:** `@docs/AIcontext.md` to load context.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## §2 Repo at a glance

| Aspect | Summary |
|--------|---------|
| What | MYND OS = modular, privacy-first personal hub / “second brain” / life OS; one unified personal database, modules plug in. |
| Stack | React 19, TypeScript, Vite 7, Zustand, Tailwind 4; Supabase integration prepared. |
| UX | Cyberpunk, forward-thinking, futuristic, user-focused; solves complex needs in-app. |
| Core | `src/core/` — schema, layout, navigation (registry, sidebar, homescreen), state, widgets. |
| Modules | `src/modules/<moduleId>/` — manifest, schema, types, optional store/localStore/remoteStore. |
| Data | All persistence via store facades or core storage; no `localStorage`/Supabase in components. |
| Registry | Central module registry + `ModuleManifest`; routes and nav derive from it. |

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## §3 Decision flow

| If you need to… | Then… |
|-----------------|--------|
| Add a self-contained feature | New module under `src/modules/<moduleId>/`; register in central registry. |
| Touch persisted data | Data layer only: `store.ts` (facade), `localStore.ts`, `remoteStore.ts`; never in components. |
| Add shared UI or shell behavior | Core: `src/core/widgets/`, `src/core/layout/`, `src/core/navigation/`. |
| Add route or nav entry | Add/update `ModuleManifest` in central registry; do not hardcode in `App.tsx` or sidebar. |
| Use Supabase | Only in data layer; use `supabaseClient`; local fallback + single store facade. |
| Do something across modules | Events or core services only; no direct module-to-module imports. |

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## §4 Must-do / must-not

**DO:** Read AIcontext.md first; prefer new modules; data access in store layer only; versioned storage keys; register modules via registry; type public surfaces.

**DO NOT:** Import one module from another; put logic or persistence in components; call `localStorage`/Supabase/fetch in components or UI hooks; duplicate module list; assume Supabase is configured.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## §5 Where in AIcontext.md

| Need | Section |
|------|---------|
| Vision, UX, principles | §1–3 |
| Tech stack, Supabase, data layer | §4 |
| Folder structure | §5 |
| Patterns and conventions | §6 |
| AI rules (13) | §7 |
| How to use this file | §8 |
| Milestones | §9 |

---

<!-- Quick orientation only. Full context → AIcontext.md. -->
