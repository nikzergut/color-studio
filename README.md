# Color Studio

A color picker and palette generator built with React, TypeScript and Vite. It runs
both as a **Tauri v2 desktop app** and as a **static web app** in the browser.

**[Open the live demo →](https://nikzergut.github.io/color-studio/)**

## Features

- Interactive color wheel with drag-to-pick hue and a saturation/brightness square.
- H/S/L sliders plus HEX input, with live RGB and HSL readouts.
- Seven harmony schemes: complementary, split-complementary, analogous, triadic,
  tetradic, square and monochromatic. Each scheme has a tooltip explaining it.
- Random palette generator (button or `R` shortcut).
- Copy any swatch's HEX value and export the whole palette as CSS custom properties.
- Save palettes in `localStorage`; the saved list scrolls inside a fixed-size window.
- Russian/English interface switch with the choice remembered between sessions.
- Strict CSP for production and development, native clipboard plugin with a
  browser fallback, and custom Windows icons.

## Tech stack

- React 19 + TypeScript + Vite 8
- Tauri v2 with a small Rust backend
- Vitest for unit tests
- Plain CSS, no UI framework

The web build uses `@tauri-apps/plugin-clipboard-manager` when available and falls
back to the browser Clipboard API (and `execCommand` where needed), so every feature
works on GitHub Pages too.

## Getting started

You need Node.js 22+ (20.19+ also works). Rust and platform build tools are only
needed for the desktop app.

```bash
npm install
npm run dev        # start the browser dev server at http://localhost:1420
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Browser dev server with hot reload |
| `npm run build` | Type-check and build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit tests (32 tests) |
| `npm run tauri dev` | Run the desktop app with hot reload |
| `npm run tauri build` | Build desktop installers for the host platform |
| `npm run build:win` | Build the Windows NSIS installer into `build/windows/` |

## Windows builds

Ready-made Windows x64 artifacts are in [`build/windows/`](build/windows/):

- `nsis/Color Studio_0.1.0_x64-setup.exe` — NSIS installer (recommended)
- `color-studio.exe` — portable executable

Windows 10/11 with the WebView2 Runtime is required (usually preinstalled).

## Project structure

- `src/App.tsx` — UI and application state
- `src/components/` — color wheel, SV square, sliders and icons
- `src/lib/color.ts` — HEX/RGB/HSL/HSV conversions, formatting and contrast
- `src/lib/harmonies.ts` — harmony generators
- `src/lib/storage.ts` — safe `localStorage` helpers and ID generation
- `src/i18n/` — RU/EN translations and language provider
- `src/**/*.test.ts` — Vitest unit tests
- `src-tauri/` — Tauri configuration and Rust side
- `audit/` — code audit reports
- `build/windows/` — Windows build artifacts
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment

## Deployment

Every push to `main` runs the tests, builds the site and publishes `dist/` to
GitHub Pages via the official `actions/deploy-pages` workflow. Vite uses relative
asset paths, so the app works from the `/color-studio/` subdirectory without extra
configuration.
