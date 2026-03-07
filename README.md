# Melitta Barista Card

[![HACS Validation](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/github/license/dzerik/melitta-barista-card)](https://github.com/dzerik/melitta-barista-card/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/dzerik/melitta-barista-card)](https://github.com/dzerik/melitta-barista-card/releases)

A custom Lovelace card for the [Melitta Barista Smart](https://github.com/dzerik/melitta-barista-ha) Home Assistant integration. Built with [Lit](https://lit.dev/) and TypeScript.

## Features

- **Auto-detection** -- automatically finds your Melitta device, no manual configuration needed
- Machine state with color-coded badge
- BLE connection indicator
- Progress bar during brewing/cleaning
- Action required alerts
- Recipe select dropdown with brew button
- Cancel button during operations
- Optional settings display
- Visual card editor with device dropdown
- Theme-aware styling (light/dark)

## Screenshot

![Melitta Barista Card](https://raw.githubusercontent.com/dzerik/melitta-barista-card/main/screenshot.png)

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
| `show_recipes`  | boolean | true            | Show recipe buttons when machine is ready      |
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

## License

[MIT](LICENSE)
