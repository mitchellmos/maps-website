#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { WORLDS } = require('./map-config.js');

/**
 * Remove a world from the system
 */
function removeWorld(worldId) {
    console.log(`Removing world: ${worldId}...`);
    
    // Remove world directory
    const worldDir = path.join('./maps', `world${worldId}`);
    if (fs.existsSync(worldDir)) {
        fs.rmSync(worldDir, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${worldDir}`);
    } else {
        console.log(`Directory doesn't exist: ${worldDir}`);
    }
    
    // Remove JSON file
    const jsonFile = path.join('./maps', `world${worldId}.json`);
    if (fs.existsSync(jsonFile)) {
        fs.unlinkSync(jsonFile);
        console.log(`✅ Removed JSON file: ${jsonFile}`);
    }
    
    // Remove HTML file
    const htmlFile = `world${worldId}.html`;
    if (fs.existsSync(htmlFile)) {
        fs.unlinkSync(htmlFile);
        console.log(`✅ Removed HTML file: ${htmlFile}`);
    }
    
    // Update map-config.js to remove the world
    updateMapConfig(worldId);
    
    // Rebuild all pages to remove the world button
    rebuildPages();
    
    console.log(`\n✅ World ${worldId} removed successfully!`);
}

/**
 * Update map-config.js to remove the world
 */
function updateMapConfig(worldId) {
    const configFile = './scripts/map-config.js';
    let content = fs.readFileSync(configFile, 'utf8');
    
    // Remove world from the WORLDS array
    const worldsRegex = /const WORLDS = \[(.*?)\];/s;
    const match = content.match(worldsRegex);
    
    if (match) {
        const currentWorlds = match[1].split(',').map(w => w.trim().replace(/['"]/g, ''));
        const filteredWorlds = currentWorlds.filter(w => w !== worldId);
        
        if (filteredWorlds.length !== currentWorlds.length) {
            const newWorldsArray = `const WORLDS = [${filteredWorlds.map(w => `'${w}'`).join(', ')}];`;
            content = content.replace(worldsRegex, newWorldsArray);
            
            fs.writeFileSync(configFile, content);
            console.log(`✅ Updated map-config.js to remove world ${worldId}`);
        } else {
            console.log(`World ${worldId} not found in map-config.js`);
        }
    } else {
        console.error('Could not find WORLDS array in map-config.js');
    }
}

/**
 * Rebuild all pages to remove the world button
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
        console.log('Usage: node scripts/remove-world.js <worldId>');
        console.log('Example: node scripts/remove-world.js 150');
        process.exit(1);
    }
    
    // Validate world ID (should be numeric)
    if (!/^\d+$/.test(worldId)) {
        console.error('Error: World ID must be numeric (e.g., 150)');
        process.exit(1);
    }
    
    // Check if world exists
    if (!WORLDS.includes(worldId)) {
        console.error(`Error: World ${worldId} does not exist in map-config.js`);
        console.log(`Available worlds: ${WORLDS.join(', ')}`);
        process.exit(1);
    }
    
    removeWorld(worldId);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { removeWorld };
