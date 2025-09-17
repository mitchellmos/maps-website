#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { WORLDS } = require('../script../scripts/map-config.js');

/**
 * Add a new world to the system
 */
function addWorld(worldId) {
    const worldDir = path.join('./maps', worldId);
    
    // Create world directory
    if (!fs.existsSync(worldDir)) {
        fs.mkdirSync(worldDir, { recursive: true });
        console.log(`Created directory: ${worldDir}`);
    } else {
        console.log(`Directory already exists: ${worldDir}`);
    }
    
    // Update map-config.js
    updateMapConfig(worldId);
    
    // Create HTML file for the new world
    createWorldHtml(worldId);
    
    // Update all existing HTML files to include the new world
    updateAllHtmlFiles(worldId);
    
    console.log(`\n✅ World ${worldId} added successfully!`);
    console.log(`\nNext steps:`);
    console.log(`1. Add PNG files to maps/${worldId}/`);
    console.log(`2. Run: node generate-map-list.js`);
    console.log(`3. Test: http://localhost:8000/${worldId}.html`);
}

/**
 * Update map-config.js to include the new world
 */
function updateMapConfig(worldId) {
    const configFile = '../scripts/map-config.js';
    let content = fs.readFileSync(configFile, 'utf8');
    
    // Add new world to the WORLDS array
    const worldsRegex = /const WORLDS = \[(.*?)\];/s;
    const match = content.match(worldsRegex);
    
    if (match) {
        const currentWorlds = match[1].split(',').map(w => w.trim().replace(/['"]/g, ''));
        if (!currentWorlds.includes(worldId)) {
            currentWorlds.push(worldId);
            const newWorldsArray = currentWorlds.map(w => `'${w}'`).join(', ');
            content = content.replace(worldsRegex, `const WORLDS = [${newWorldsArray}];`);
            fs.writeFileSync(configFile, content);
            console.log(`Updated map-config.js with new world: ${worldId}`);
        } else {
            console.log(`World ${worldId} already exists in map-config.js`);
        }
    }
}

/**
 * Create HTML file for the new world
 */
function createWorldHtml(worldId) {
    const worldNumber = worldId.replace('world', '');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World ${worldNumber} - Tribal Wars Maps</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="index.html">Tribal Wars Maps</a></h1>
            <p>World ${worldNumber} - Daily map updates</p>
        </div>
    </header>

    <nav class="world-nav">
        <div class="container">
            <h2>Select World</h2>
            <div class="world-buttons">
                <a href="world144.html" class="world-btn">World 144</a>
                <a href="world147.html" class="world-btn">World 147</a>
                <a href="world148.html" class="world-btn">World 148</a>
                <a href="world149.html" class="world-btn">World 149</a>
                <a href="${worldId}.html" class="world-btn active">World ${worldNumber}</a>
            </div>
        </div>
    </nav>

    <main class="container">
        <section class="maps-section">
            <h2>World ${worldNumber} Maps</h2>
            <div class="maps-grid" id="mapsGrid">
                <!-- Maps will be dynamically loaded here -->
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Tribal Wars Maps</p>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        // Set the current world for this page
        window.currentWorld = '${worldId}';
    </script>
</body>
</html>`;
    
    fs.writeFileSync(`${worldId}.html`, htmlContent);
    console.log(`Created: ${worldId}.html`);
}

/**
 * Update all existing HTML files to include the new world button
 */
function updateAllHtmlFiles(newWorldId) {
    const worldNumber = newWorldId.replace('world', '');
    const files = ['index.html', 'world144.html', 'world147.html', 'world148.html', 'world149.html'];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            
            // Add new world button before the closing </div> of world-buttons
            const buttonRegex = /(<div class="world-buttons">[\s\S]*?)(<\/div>)/;
            const match = content.match(buttonRegex);
            
            if (match) {
                const newButton = `                <a href="${newWorldId}.html" class="world-btn">World ${worldNumber}</a>\n`;
                content = content.replace(buttonRegex, `$1${newButton}            $2`);
                fs.writeFileSync(file, content);
                console.log(`Updated: ${file}`);
            }
        }
    });
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node add-world.js <world-id>');
        console.log('Example: node add-world.js world150');
        console.log('\nThis will:');
        console.log('1. Create maps/world150/ directory');
        console.log('2. Update map-config.js');
        console.log('3. Create world150.html');
        console.log('4. Update all existing HTML files');
        return;
    }
    
    const worldId = args[0];
    
    if (!worldId.startsWith('world')) {
        console.error('World ID must start with "world" (e.g., world150)');
        return;
    }
    
    if (WORLDS.includes(worldId)) {
        console.log(`World ${worldId} already exists!`);
        return;
    }
    
    addWorld(worldId);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { addWorld };
