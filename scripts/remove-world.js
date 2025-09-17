#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { WORLDS } = require('../script../scripts/map-config.js');

/**
 * Remove a world from the system
 */
function removeWorld(worldId) {
    console.log(`Removing world: ${worldId}...`);
    
    // Remove world directory
    const worldDir = path.join('./maps', worldId);
    if (fs.existsSync(worldDir)) {
        fs.rmSync(worldDir, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${worldDir}`);
    } else {
        console.log(`Directory doesn't exist: ${worldDir}`);
    }
    
    // Remove JSON file
    const jsonFile = path.join('./maps', `${worldId}.json`);
    if (fs.existsSync(jsonFile)) {
        fs.unlinkSync(jsonFile);
        console.log(`✅ Removed JSON file: ${jsonFile}`);
    }
    
    // Remove HTML file
    const htmlFile = `${worldId}.html`;
    if (fs.existsSync(htmlFile)) {
        fs.unlinkSync(htmlFile);
        console.log(`✅ Removed HTML file: ${htmlFile}.html`);
    }
    
    // Update map-config.js to remove the world
    updateMapConfig(worldId);
    
    // Update all existing HTML files to remove the world button
    updateAllHtmlFiles(worldId);
    
    console.log(`\n✅ World ${worldId} removed successfully!`);
}

/**
 * Update map-config.js to remove the world
 */
function updateMapConfig(worldId) {
    const configFile = '../scripts/map-config.js';
    let content = fs.readFileSync(configFile, 'utf8');
    
    // Remove world from the WORLDS array
    const worldsRegex = /const WORLDS = \[(.*?)\];/s;
    const match = content.match(worldsRegex);
    
    if (match) {
        const currentWorlds = match[1].split(',').map(w => w.trim().replace(/['"]/g, ''));
        const filteredWorlds = currentWorlds.filter(w => w !== worldId);
        const newWorldsArray = filteredWorlds.map(w => `'${w}'`).join(', ');
        content = content.replace(worldsRegex, `const WORLDS = [${newWorldsArray}];`);
        fs.writeFileSync(configFile, content);
        console.log(`✅ Updated map-config.js - removed ${worldId}`);
    }
}

/**
 * Update all existing HTML files to remove the world button
 */
function updateAllHtmlFiles(worldId) {
    const worldNumber = worldId.replace('world', '');
    const files = ['index.html', 'world144.html', 'world147.html', 'world148.html', 'world149.html'];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            
            // Remove the world button
            const buttonRegex = new RegExp(`\\s*<a href="${worldId}\\.html" class="world-btn[^"]*">World ${worldNumber}</a>\\s*`, 'g');
            content = content.replace(buttonRegex, '');
            
            fs.writeFileSync(file, content);
            console.log(`✅ Updated: ${file}`);
        }
    });
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node remove-world.js <world-id>');
        console.log('Example: node remove-world.js world150');
        console.log('\nThis will:');
        console.log('1. Remove maps/world150/ directory');
        console.log('2. Remove world150.json file');
        console.log('3. Remove world150.html file');
        console.log('4. Update map-config.js');
        console.log('5. Update all existing HTML files');
        return;
    }
    
    const worldId = args[0];
    
    if (!worldId.startsWith('world')) {
        console.error('World ID must start with "world" (e.g., world150)');
        return;
    }
    
    if (!WORLDS.includes(worldId)) {
        console.log(`World ${worldId} doesn't exist in the system!`);
        return;
    }
    
    removeWorld(worldId);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { removeWorld };
