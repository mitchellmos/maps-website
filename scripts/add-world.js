#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { WORLDS } = require('./map-config.js');

/**
 * Add a new world to the system
 */
function addWorld(worldId) {
    const worldDir = path.join('./maps', `world${worldId}`);
    
    // Create world directory
    if (!fs.existsSync(worldDir)) {
        fs.mkdirSync(worldDir, { recursive: true });
        console.log(`Created directory: ${worldDir}`);
    } else {
        console.log(`Directory already exists: ${worldDir}`);
    }
    
    // Update map-config.js
    updateMapConfig(worldId);
    
    // Rebuild all pages to include the new world
    rebuildPages();
    
    console.log(`\n✅ World ${worldId} added successfully!`);
    console.log(`\nNext steps:`);
    console.log(`1. Add PNG files to maps/world${worldId}/`);
    console.log(`2. Run: node scripts/generate-map-list.js`);
    console.log(`3. Test: http://localhost:8000/world${worldId}.html`);
}

/**
 * Update map-config.js to include the new world
 */
function updateMapConfig(worldId) {
    const configFile = './scripts/map-config.js';
    let content = fs.readFileSync(configFile, 'utf8');
    
    // Add new world to the WORLDS array
    const worldsRegex = /const WORLDS = \[(.*?)\];/s;
    const match = content.match(worldsRegex);
    
    if (match) {
        const currentWorlds = match[1].split(',').map(w => w.trim().replace(/['"]/g, ''));
        if (!currentWorlds.includes(worldId)) {
            currentWorlds.push(worldId);
            currentWorlds.sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically
            
            const newWorldsArray = `const WORLDS = [${currentWorlds.map(w => `'${w}'`).join(', ')}];`;
            content = content.replace(worldsRegex, newWorldsArray);
            
            fs.writeFileSync(configFile, content);
            console.log(`✅ Updated map-config.js with world ${worldId}`);
        } else {
            console.log(`World ${worldId} already exists in map-config.js`);
        }
    } else {
        console.error('Could not find WORLDS array in map-config.js');
    }
}

/**
 * Rebuild all pages to include the new world
 */
function rebuildPages() {
    try {
        const { execSync } = require('child_process');
        execSync('node scripts/build-pages.js', { stdio: 'inherit' });
        console.log('✅ Rebuilt all pages');
    } catch (error) {
        console.error('Error rebuilding pages:', error.message);
    }
}

/**
 * Main function
 */
function main() {
    const worldId = process.argv[2];
    
    if (!worldId) {
        console.log('Usage: node scripts/add-world.js <worldId>');
        console.log('Example: node scripts/add-world.js 150');
        process.exit(1);
    }
    
    // Validate world ID (should be numeric)
    if (!/^\d+$/.test(worldId)) {
        console.error('Error: World ID must be numeric (e.g., 150)');
        process.exit(1);
    }
    
    addWorld(worldId);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { addWorld };
