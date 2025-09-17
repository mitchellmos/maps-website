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

## File Structure

```
maps-website/
├── index.html              # Homepage with world selection
├── worldXXX.html           # Individual world maps pages
├── styles.css              # CSS styling
├── script.js               # JavaScript functionality
├── templates/              # HTML templates
│   ├── header.html         # Common header template
│   ├── navigation.html     # Navigation template
│   └── footer.html         # Footer template
├── scripts/                # Build/management tools
│   ├── map-config.js       # Map types and world configuration
│   ├── build-pages.js      # Page generation script
│   ├── generate-map-list.js # Map list generator script
│   ├── add-world.js        # Add new world script
│   └── remove-world.js     # Remove world script
├── maps/                   # Maps directory
│   ├── worldXXX/          # World-specific PNG files
│   ├── worldXXX.json      # World-specific map metadata
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

### Adding a New World

```bash
# Add a new world (replace XXX with world number)
node scripts/add-world.js XXX

# Add PNG files to maps/worldXXX/
# Generate map list
node scripts/generate-map-list.js

# Rebuild pages
node scripts/build-pages.js
```

### Removing a World

```bash
# Remove a world (replace XXX with world number)
node scripts/remove-world.js XXX
```

### Updating Maps

1. Add new PNG files to the appropriate `maps/worldXXX/` directory
2. Run `node scripts/generate-map-list.js` to update JSON metadata
3. Maps will automatically appear on the website

### Building Pages

```bash
# Generate all HTML pages from templates
node scripts/build-pages.js
```

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
