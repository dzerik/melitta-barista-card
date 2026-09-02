# Changelog

All notable changes to the Melitta Barista Card.

## [2.6.1] — 2026-09-03

### Fixed

- Brew steps in the favorite details expander and the step wizard now describe the phase composition — "Brew phase 1/2 — Milk, 160 ml" / "Brew phase 2/2 — Coffee, 40 ml, Strong" — instead of the uninformative bare phase number. Reuses the existing localized value labels, so no new translations were needed.

## [2.6.0] — 2026-09-03

### Added

- Info button on sommelier favorites: expands the recipe description and the full step plan (manual actions interleaved with machine phases), reusing the wizard's step model. Localized in all 29 languages.

## [2.5.0] — 2026-09-02

### Added

- Brand badge in the card header (UI Contract §3.10, integration ≥ 0.91 with the `brand_theme` amendment): a compact wordmark badge tinted with the brand's accent colors served by the integration. When the user has placed their own logo file under Home Assistant's `www/melitta_barista/` directory, the badge shows that image instead, falling back to the wordmark text if it fails to load. The card ships no brand assets and hardcodes no brand colors — everything is data from the contract.

### Compatibility

- Contracts without `brand_theme` (older integrations) render exactly the previous header; malformed theme data degrades to a neutral badge or no badge, never an error. Accent pairs with insufficient text contrast are automatically corrected for legibility.

## [2.4.1] — 2026-09-02

### Fixed

- Multi-phase sommelier recipes no longer one-shot brew from the card: recipes with several machine phases or manual steps (attach milk, add syrup, ...) now open a compact step-by-step wizard that brews each phase separately via `sommelier/brew_phase`, pausing for the user actions the recipe requires. Single-phase recipes keep the legacy instant brew.
- Sommelier generation errors now surface the backend pre-flight codes (`no_llm_agent`, `no_llm_agent_selected`, `llm_agent_missing`) as localized, actionable hints instead of a generic failure message.

### Added

- "Why this recipe?" expander on generated quick recipes when the sommelier provides reasoning.
- All 29 locales gained the new wizard/error strings.

## [2.4.0] — 2026-09-02

### Added

- UI Contract v1 client (integration ≥ 0.91): when the integration advertises `contract_version` on the connection sensor, the card switches to token-based status handling — machine state, activity, and required actions are derived from stable machine-readable tokens instead of matching English display strings, with localized labels for all 29 languages (including the new filter and evaporation states).
- Contract document fetch over WebSocket (`melitta_barista/ui_contract/get`): freestyle pickers and portion sliders now use the machine's own vocabularies and limits (e.g. 3-level Nivona intensity, single-hopper blend), and the freestyle section is hidden on machines that do not support freestyle brewing. The document is cached per config entry and refreshed automatically when the machine's contract fingerprint changes (reconnect, model refinement, recipe preload).
- Procedural drink icons: recipe tiles and the brewing view render each drink from the per-recipe icon description served by the integration (glass shape, layers, foam, steam) instead of a hardcoded English-name table — machines and recipes the card has never heard of get correct icons.

### Compatibility

- Graceful fallback everywhere: against integrations older than the contract the card behaves exactly as 2.3.x — string-based status matching, built-in option lists and limits, and the name-keyed icon table remain as permanent legacy paths. A failed or unsupported contract fetch degrades only contract-derived features (icons, option lists, limits, capability gating); token status handling and all legacy behaviour stay intact. Transient fetch failures retry automatically on reconnect, without polling.

## [2.3.4] — 2026-09-02

### Fixed

- Profile tabs now use the numeric slot as their stable identity instead of the mutable display label. Profile names load asynchronously from the machine, so a tab rendered as `Profile 1` could be renamed before the click; the old handler then submitted the stale label, which Home Assistant rejected as an invalid option. The card now resolves the current `select` option for the slot at click time; invalid slots are ignored with a console warning. Contributed by @Chreece (#6).

## [2.3.3] — 2026-07-08

### Fixed

- CI builds failed on a fresh install: migrated from the unmaintained `rollup-plugin-typescript2` to the official `@rollup/plugin-typescript` (the old plugin silently skipped TypeScript transformation with current Rollup releases).

## [2.3.2] — 2026-07-08

### Added

- Card version indicator at the right edge of the profile tab bar.
- CI: tests workflow (vitest + build) and release workflow that attaches the built bundle to GitHub releases (enables the downloads counter).
- CHANGELOG.md covering the full release history.
- README: refreshed badges (release, downloads, tests, HACS validate, translations), full options table, localization section.

## [2.3.0] — 2026-07-08

Major quality release: full localization, an AI Sommelier section, two long-standing interaction bugs fixed, and a complete internal decomposition backed by unit tests. Internal version increments 2.1.3–2.2.0 were folded into this release.

### Added

- **Localization: 29 languages** (bg, bs, cs, da, de, el, en, es, et, fi, fr, hr, hu, it, lt, lv, mk, nb, nl, pl, pt, ro, ru, sk, sl, sr, sv, tr, uk) — mirrors the language list of the melitta_barista integration and reuses its terminology for machine states, cleaning and settings. The language follows the Home Assistant profile setting and switches on the fly, falling back regional → base language → English.
- **AI Sommelier section** (`show_sommelier`): bean hopper tags, top favorites with one-tap brew, and a "Surprise me" recipe generator backed by the integration's Sommelier WebSocket API.
- Unit tests (vitest, 83 tests): recipe service-payload round-trip, machine-state derivation, DirectKey parsing, localization completeness (every language file must match the en.json key set and preserve placeholders).
- Source maps for the published bundle.

### Fixed

- **Maintenance confirm buttons never worked**: the click event bubbled to the section container, which immediately reset the confirmation state — Easy Clean, Intensive Clean, Descaling, Evaporating and Switch Off could not be started at all.
- **Double-click on a DirectKey tile started an unintended brew** before opening the recipe editor (browsers deliver two `click` events before `dblclick`). Editing is via long-press; the `dblclick` handler was removed.
- **"Enter manually..." in the card editor did nothing**: the manual prefix input never appeared when devices were auto-detected. The entity prefix is now also trimmed.
- Sensors in `unavailable`/`unknown` state no longer render fake values ("0 min", "Low", an empty progress bar, alert text "unavailable").
- Sommelier: load errors now show a Retry button instead of a silently empty section; brew/generate failures surface as Home Assistant toasts; duplicate WebSocket requests during the initial load are prevented; favorite brew counter no longer turns into NaN.
- State badge translucent background was invalid CSS (hex-alpha appended to `var()`) and silently dropped — replaced with `color-mix()`.
- Missing `.mbc-section` styles and an undefined CSS variable in the Sommelier section.
- Intensity dots and other hardcoded white-on-dark colors are now theme-aware (light theme support for those elements).
- `getCardSize()`/`getGridOptions()` account for enabled sections instead of a fixed height.
- Guard against double registration in the card picker when the resource is loaded twice.

### Changed

- Card version in the console banner is sourced from package.json (the previous hardcoded constant had drifted).
- Internal: the 1141-line monolith was decomposed into pure modules (recipe model, machine-state derivation, API layer, per-section renderers) and a standalone `<mbc-sommelier>` element; `shouldUpdate` now compares a precomputed list of tracked entity ids instead of scanning all `hass.states`, and internal state updates can no longer be lost.

## [2.1.2] — 2026-03-20

### Added

- Screenshots for all card sections in the README.

## [2.1.1] — 2026-03-20

### Added

- Disclaimer and NOTICE (trademark / non-affiliation statement).

## [2.1.0] — 2026-03-20

### Added

- Milk DirectKey category.
- GitHub community files (contributing, code of conduct, security policy, PR template).

### Fixed

- Icon name mismatch for several recipes.
- Removed the broken Aroma toggle.

## [2.0.0] — 2026-03-09

### Added

- **DirectKey grid**: quick-access drink tiles with recipe preview overlay, 2x (two cups) toggle and long-press recipe editing.
- **Cup statistics** section: total counter and per-recipe stats.
- **Maintenance** section: cleaning, descaling, evaporating, water filter management, switch off — with confirmation flow.
- **Recipe edit dialog** for DirectKey recipes.
- Aroma control in freestyle.

## [1.2.0] — 2026-03-08

### Added

- Unified brewing view with recipe icon, activity text and progress bar.

## [1.1.0] — 2026-03-08

### Added

- `show_header` / `show_status` options, compact header style.

### Changed

- Simplified to a single card class.

## [1.0.0] — 2026-03-08

### Changed

- Premium UI redesign: SVG cup icons, dark surface styling, segment pickers.

## [0.5.0] — 2026-03-07

### Added

- User profile selector.
- Freestyle recipe controls (two components: process, intensity, aroma, temperature, shots, portion).

### Fixed

- Renamed "steam" to "milk" in the freestyle UI.

## [0.4.1] — 2026-03-07

### Fixed

- Progress bar value validation, accessibility improvements, device auto-detection, editor labels.

## [0.4.0] — 2026-03-07

Initial public release: machine status with connection indicator, recipe selector, freestyle builder, machine settings, visual card editor, HACS packaging.
