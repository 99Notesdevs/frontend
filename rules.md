# main-frontend implementation rules

## 1) App Router structure

- Pages and layouts live under `src/app/`.
- Use route groups (`(use-navbar)`, `(no-navbar)`) to control layout differences.

## 2) Server vs client components

- Prefer Server Components by default.
- Use `"use client"` only when needed (state, effects, browser-only APIs).
- Keep client-only dependencies isolated to client components.

## 3) API rules

- All network requests go through `src/config/api/route.ts`.
- Keep `credentials: "include"` when cookie auth is required.
- Do not hardcode base URLs inside components.

## 4) Auth state

- Auth state belongs in `src/contexts/AuthContext`.
- UI auth prompts belong in `AuthModal`.

## 5) UI and styling

- Prefer shared primitives/components in `src/components/`.
- Avoid duplicating layout logic across pages; use layouts.

## 6) SEO and metadata

- Prefer defining metadata in layout/page files where applicable.

## 7) PR checklist

- Confirm the correct layout group is used.
- Confirm API calls are centralized.
- Confirm images match `next.config.js` remotePatterns.
- Confirm no secrets are exposed to the browser bundle.
