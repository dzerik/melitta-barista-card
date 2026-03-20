# Melitta Barista Card

[![HACS Validation](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/github/license/dzerik/melitta-barista-card)](https://github.com/dzerik/melitta-barista-card/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/dzerik/melitta-barista-card)](https://github.com/dzerik/melitta-barista-card/releases)

A custom Lovelace card for the [Melitta Barista Smart](https://github.com/dzerik/melitta-barista-ha) Home Assistant integration. Built with [Lit](https://lit.dev/) and TypeScript.

## Features

- **Auto-detection** -- automatically finds your Melitta device, no manual configuration needed
- **Recipe grid** -- all 24 recipes with SVG cup icons, DirectKey quick-access buttons, and user profile tabs
- **Freestyle builder** -- custom drink with two components, intensity, aroma, temperature, shots, and portion size
- **Cup statistics** -- total counter and per-recipe stats dashboard
- **Maintenance** -- easy clean, intensive clean, descaling, evaporating, water filter management
- **Machine settings** -- toggles and sliders for energy saving, auto bean select, rinsing, water hardness, auto-off, brew temperature
- **Real-time status** -- machine state badge, BLE connection indicator, brewing/cleaning progress bar
- **Action alerts** -- fill water, empty trays, insert brew unit, and other required actions
- **Visual editor** -- device dropdown in the card editor UI
- **Theme-aware** -- light and dark mode styling

## Screenshots

### Recipes

Recipe grid with user profiles, DirectKey quick-access buttons, and all available recipes with SVG cup icons.

![Recipes](images/recipes.png)

### Freestyle

Custom drink builder with two components, adjustable intensity, aroma, temperature, shots, and portion size.

![Freestyle](images/freestyle.png)

### Stats

Cup counter dashboard with total count and per-recipe statistics.

![Stats](images/stats.png)

### Maintenance

Cleaning, descaling, evaporating, water filter management, and power off.

![Maintenance](images/maintenance.png)

### Settings

Machine configuration: toggles (energy saving, auto bean, rinsing) and sliders (water hardness, auto-off, brew temperature).

![Settings](images/settings.png)

## Installation

### Via HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** and select the three-dot menu in the top right corner.
3. Choose **Custom repositories**.
4. Add the repository URL: `https://github.com/dzerik/melitta-barista-card`
5. Select category **Dashboard** and click **Add**.
6. Search for "Melitta Barista Card" in HACS and install it.
7. Refresh your browser (hard reload: Ctrl+Shift+R).

### Manual Installation

1. Download `melitta-barista-card.js` from the [latest release](https://github.com/dzerik/melitta-barista-card/releases).
2. Copy it to your `config/www/` directory.
3. In Home Assistant, go to **Settings** > **Dashboards** > three-dot menu > **Resources**.
4. Add resource: `/local/melitta-barista-card.js` (type: JavaScript Module).
5. Refresh your browser.

## Configuration

The card **automatically detects** your Melitta Barista device -- just add the card and it works:

```yaml
type: custom:melitta-barista-card
```

All options are optional:

```yaml
type: custom:melitta-barista-card
name: My Coffee Machine
show_recipes: true
show_settings: false
compact: false
```

### Options

| Option          | Type    | Default         | Description                                    |
| --------------- | ------- | --------------- | ---------------------------------------------- |
| `name`          | string  | auto-detected   | Card title (auto-filled from device name)      |
| `entity_prefix` | string  | auto-detected   | Entity prefix (auto-detected from integration) |
| `show_recipes`  | boolean | true            | Show recipe selector when machine is ready     |
| `show_settings` | boolean | false           | Show machine settings section                  |
| `compact`       | boolean | false           | Compact layout                                 |

If you have multiple Melitta machines, use the visual editor dropdown to select the desired device, or set `entity_prefix` manually.

## Requirements

- [Melitta Barista Smart](https://github.com/dzerik/melitta-barista-ha) integration installed and configured

## Development

```bash
npm install
npm run build     # Production build (minified)
npm run dev       # Watch mode for development
```

## Disclaimer

This project is an independent, open-source, non-commercial Lovelace card created for personal and home automation purposes. It is **not affiliated with, endorsed by, or connected to Melitta Group Management GmbH & Co. KG** or any of its subsidiaries.

"Melitta", "Barista T Smart", "Barista TS Smart", and the Melitta logo are registered trademarks of Melitta Group Management GmbH & Co. KG. All product names, logos, brands, and graphical assets are the property of their respective owners and are used here solely for identification and interoperability purposes.

This software is not intended for commercial use or the generation of revenue. See [NOTICE](NOTICE) for full legal details.

## License

[MIT](LICENSE)
