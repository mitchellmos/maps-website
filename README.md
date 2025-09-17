# Tribal Wars Maps Website

A simple static website to display daily updated Tribal Wars map PNG files for multiple worlds (144, 147, 148, 149).

## Features

- **Multi-World Support**: Separate pages for each Tribal Wars world
- **Clean Navigation**: Easy switching between worlds
- **Modern Design**: Responsive grid layout with beautiful styling
- **Modal Image Viewer**: Click any map to view full-size
- **Automatic Timestamps**: Shows when each map was last updated
- **Mobile-Friendly**: Works perfectly on all devices

## File Structure

```
maps-website/
├── src/                    # Website source files
│   ├── index.html          # Homepage with world selection
│   ├── world144.html       # World 144 maps page
│   ├── world147.html       # World 147 maps page
│   ├── world148.html       # World 148 maps page
│   ├── world149.html       # World 149 maps page
│   ├── styles.css          # CSS styling
│   └── script.js           # JavaScript functionality
├── scripts/                # Build/management tools
│   ├── map-config.js       # Map types and world configuration
│   ├── generate-map-list.js # Map list generator script
│   ├── add-world.js        # Add new world script
│   └── remove-world.js     # Remove world script
├── maps/                   # Maps directory
│   ├── world144/          # World 144 PNG files
│   ├── world147/          # World 147 PNG files
│   ├── world148/          # World 148 PNG files
│   ├── world149/          # World 149 PNG files
│   ├── world144.json      # World 144 map metadata
│   ├── world147.json      # World 147 map metadata
│   ├── world148.json      # World 148 map metadata
│   ├── world149.json      # World 149 map metadata
│   └── worlds-summary.json # Summary of all worlds
├── package.json            # Project configuration
├── README.md              # This file
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

## Setup

1. **Place your PNG files** in the appropriate world directories:
   - `maps/world144/` for World 144 maps
   - `maps/world147/` for World 147 maps
   - `maps/world148/` for World 148 maps
   - `maps/world149/` for World 149 maps

2. **Generate map lists** for all worlds:
   ```bash
   npm run generate-maps
   ```

3. **Serve the website**:
   ```bash
   npm start
   ```
   Then open `http://localhost:8000` in your browser.

## Available Commands

### Map Management
```bash
# Generate map lists for all worlds
npm run generate-maps

# Generate for a specific world
npm run generate-world world144

# Generate summary only
npm run generate-summary
```

### World Management
```bash
# Add a new world
npm run add-world world150

# Remove a world
npm run remove-world world150
```

### Development
```bash
# Start local server
npm start

# Show help
npm run help
```

## Adding Maps

### For All Worlds
```bash
# Generate map lists for all worlds
npm run generate-maps
```

### For a Specific World
```bash
# Generate map list for World 144 only
npm run generate-world world144
```

## Integration with Daily Updates

Your separate job that generates maps daily can easily integrate with this website:

1. **Generate maps** → Save PNG files to appropriate world directories
2. **Update catalogs** → Run `npm run generate-maps` to update all map lists
3. **Deploy** → Upload the `src/` folder to your web server

The website will automatically:
- Display the newest maps first for each world
- Show timestamps for when each map was last updated
- Provide easy navigation between worlds

## Navigation

- **Homepage** (`src/index.html`): World selection page
- **World Pages**: Each world has its own dedicated page showing only that world's maps
- **Active World**: The current world is highlighted in the navigation
- **Responsive Design**: Navigation adapts to mobile screens

## Customization

### Adding New Worlds
```bash
npm run add-world world150
```
This automatically:
1. Creates `maps/world150/` directory
2. Updates `scripts/map-config.js`
3. Creates `src/world150.html`
4. Updates all existing HTML files

### Adding New Map Types
Edit `scripts/map-config.js` to add new map types. All worlds will automatically include the new map type.

### Styling
- **Colors**: Modify the gradient in `src/styles.css`
- **Layout**: Adjust grid columns in the `.maps-grid` CSS rule
- **Navigation**: Customize the `.world-btn` styles

## Serving the Website

### Local Development
```bash
# Using npm (recommended)
npm start

# Using Python directly
cd src && python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
cd src && npx http-server

# Using PHP
cd src && php -S localhost:8000
```

### Production Deployment
- Upload the `src/` folder to your web server
- Ensure the `maps/` directory is accessible
- Configure your web server to serve static files

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Responsive design works on all screen sizes

## Example Usage

```bash
# Add maps to World 144
cp tribal-wars-map-144.png maps/world144/

# Add maps to World 147
cp tribal-wars-map-147.png maps/world147/

# Generate all map lists
npm run generate-maps

# Start the website
npm start
```

The website will now show separate pages for each world, with easy navigation between them!
