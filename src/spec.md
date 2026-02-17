# Specification

## Summary
**Goal:** Show the existing launch preloader on every fresh app open/load, while ensuring it never reappears during internal SPA route navigation.

**Planned changes:**
- Update the app-level preloader gating so the preloader triggers on initial app load/open (including full page refresh), but not on client-side route changes.
- Remove/replace the current persistent “first launch only” localStorage behavior (key: `app-first-launch-complete`) so it no longer blocks the preloader on subsequent app opens.
- Preserve the current `FirstLaunchPreloader` animation visuals and timings exactly as implemented (Z → I → Z → O reveal and fade-out), including use of `/assets/generated/zizo-preloader-logo.dim_512x512.png`.

**User-visible outcome:** Each time the user opens or reloads the app, they see the same preloader animation before the main UI; navigating between pages within the app does not trigger the preloader again.
