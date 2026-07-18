# TribalWars Maps Website

A simple static website to display daily updated TribalWars map PNG files for multiple worlds.

## Features

- **Multi-World Support**: Separate pages for each TribalWars world
- **Clean Navigation**: Easy switching between worlds
- **Modern Design**: Responsive grid layout with beautiful styling
- **Modal Image Viewer**: Click any map to view full-size
- **Automatic Timestamps**: Shows when each map was last updated
- **Mobile-Friendly**: Works perfectly on all devices
- **Build-Time Generation**: Consistent templating system for all pages
- **Shared World Configuration**: Active English worlds are loaded from the central configuration repository

## File Structure

```
maps-website/
├── index.html              # Homepage with world selection
├── enXXX.html              # Generated world map pages (also enc*/enp*)
├── styles.css              # CSS styling
├── script.js               # JavaScript functionality
├── templates/              # HTML templates
│   ├── header.html         # Common header template
│   ├── navigation.html     # Navigation template
│   └── footer.html         # Footer template
├── scripts/                # Build/management tools
│   ├── map-config.js       # Standard map type configuration
│   ├── world-config.js     # External world loader and validation
│   ├── build.js            # Complete build orchestration
│   ├── build-pages.js      # Page generator
│   ├── generate-map-list.js # Map list generator script
├── maps/                   # Maps directory
│   ├── <world-id>/        # World-specific PNG files
│   ├── <world-id>.json    # World-specific map metadata
│   └── worlds-summary.json # Summary of all worlds
├── package.json            # Project configuration
├── .gitignore             # Git ignore rules
├── LICENSE                 # MIT License
└── README.md              # This file
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maps-website
   ```

2. **Start local development server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Development

### World Configuration

The active world list is owned by the shared configuration file:

[tribalwars-config/worlds.json](https://raw.githubusercontent.com/mitchellmos/tribalwars-config/main/worlds.json)

This repository currently publishes entries whose `market` is `en`. Add, rename, reorder, or retire worlds in the shared configuration repository rather than editing this repository's scripts.

The build requires network access and Node.js 18 or newer. It validates schema version 1 before changing any generated files. If fetching or validation fails, the build stops and does not remove existing world assets.

When a previously managed world disappears from the shared list, a successful build removes its generated HTML page, map JSON, and complete `maps/<world-id>/` PNG directory. Those removals are committed like the other generated output.

### Build

```bash
npm install
npm test
npm run build
```

### Updating Maps

1. Add new PNG files to the appropriate `maps/<world-id>/` directory.
2. Run `npm run build` to refresh the active worlds, pages, map metadata, and summary.
3. Run `npm start` and open `http://localhost:8000` to verify the site locally.

## Map Types

Each world supports these standard map types:

- **Barbarians** - Barbarian village locations
- **Top Dominance Tribes** - Tribes ranked by dominance
- **Top Loss Tribes** - Tribes ranked by losses
- **Top Conquer Tribes** - Tribes ranked by conquests
- **Top ODD Tribes** - Tribes ranked by ODD (Offensive Defensive Difference)
- **Top ODA Tribes** - Tribes ranked by ODA (Offensive Defensive Average)
- **Top OD Tribes** - Tribes ranked by OD (Offensive Defensive)
- **Top Tribes** - General tribe rankings
- **Top Dominance Players** - Players ranked by dominance
- **Top Loss Players** - Players ranked by losses
- **Top Conquer Players** - Players ranked by conquests
- **Top ODD Players** - Players ranked by ODD
- **Top ODA Players** - Players ranked by ODA
- **Top OD Players** - Players ranked by OD
- **Top Players** - General player rankings

## Deployment

This is a static website that can be deployed to any static hosting service:

- **Cloudflare Pages** (recommended)
- **GitHub Pages**

Simply push your code and the hosting service will serve the static files.

## License

MIT License - see [LICENSE](LICENSE) file for details.
