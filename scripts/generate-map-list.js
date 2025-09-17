#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MAP_TYPES, WORLDS } = require('../scripts/map-config.js');

// Configuration
const MAPS_BASE_DIR = './maps';
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

/**
 * Generate map list for a specific world using the standard map types
 */
function generateWorldMapList(world) {
    const worldDir = path.join(MAPS_BASE_DIR, world);
    
    try {
        // Check if world directory exists
        if (!fs.existsSync(worldDir)) {
            console.log(`World directory ${world} does not exist. Creating it...`);
            fs.mkdirSync(worldDir, { recursive: true });
            return;
        }

        // Generate map metadata based on standard map types
        const maps = MAP_TYPES.map(mapType => {
            const filePath = path.join(worldDir, mapType.filename);
            
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                return {
                    name: mapType.name,
                    filename: mapType.filename,
                    url: `maps/${world}/${mapType.filename}`,
                    date: stats.mtime.toISOString(),
                    size: stats.size,
                    world: world,
                    type: mapType.id
                };
            } else {
                // File doesn't exist, return null (will be filtered out)
                return null;
            }
        }).filter(map => map !== null); // Remove null entries

        if (maps.length === 0) {
            console.log(`No map files found in ${world} directory.`);
            return;
        }

        // Sort by the order defined in MAP_TYPES (maintains consistent ordering)
        maps.sort((a, b) => {
            const aIndex = MAP_TYPES.findIndex(type => type.id === a.type);
            const bIndex = MAP_TYPES.findIndex(type => type.id === b.type);
            return aIndex - bIndex;
        });

        // Write to world-specific JSON file
        const outputFile = path.join(MAPS_BASE_DIR, `${world}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(maps, null, 2));
        
        console.log(`Generated map list for ${world} with ${maps.length} maps:`);
        maps.forEach(map => {
            console.log(`  - ${map.name} (${map.filename})`);
        });
        console.log(`  Saved to: ${outputFile}\n`);

    } catch (error) {
        console.error(`Error generating map list for ${world}:`, error.message);
    }
}

/**
 * Generate map lists for all worlds
 */
function generateAllMapLists() {
    console.log('Generating map lists for all Tribal Wars worlds...\n');
    
    WORLDS.forEach(world => {
        generateWorldMapList(world);
    });
    
    console.log('Map list generation complete!');
}

/**
 * Generate a summary of all worlds
 */
function generateWorldSummary() {
    const summary = {};
    
    WORLDS.forEach(world => {
        const worldFile = path.join(MAPS_BASE_DIR, `${world}.json`);
        if (fs.existsSync(worldFile)) {
            try {
                const maps = JSON.parse(fs.readFileSync(worldFile, 'utf8'));
                summary[world] = {
                    mapCount: maps.length,
                    lastUpdate: maps.length > 0 ? maps[0].date : null
                };
            } catch (error) {
                summary[world] = { mapCount: 0, lastUpdate: null };
            }
        } else {
            summary[world] = { mapCount: 0, lastUpdate: null };
        }
    });
    
    const summaryFile = path.join(MAPS_BASE_DIR, 'worlds-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log('\nWorld Summary:');
    Object.entries(summary).forEach(([world, data]) => {
        console.log(`  ${world}: ${data.mapCount} maps${data.lastUpdate ? ` (last: ${new Date(data.lastUpdate).toLocaleDateString()})` : ''}`);
    });
    console.log(`\nSummary saved to: ${summaryFile}`);
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Generate for all worlds
        generateAllMapLists();
        generateWorldSummary();
    } else if (args[0] === '--world' && args[1]) {
        // Generate for specific world
        const world = args[1];
        if (WORLDS.includes(world)) {
            generateWorldMapList(world);
        } else {
            console.error(`Invalid world: ${world}. Available worlds: ${WORLDS.join(', ')}`);
        }
    } else if (args[0] === '--summary') {
        // Generate summary only
        generateWorldSummary();
    } else if (args[0] === '--help') {
        console.log('Usage:');
        console.log('  node generate-map-list.js                    # Generate for all worlds');
        console.log('  node generate-map-list.js --world world144   # Generate for specific world');
        console.log('  node generate-map-list.js --summary          # Generate summary only');
        console.log('  node generate-map-list.js --help             # Show this help');
        console.log(`\nAvailable worlds: ${WORLDS.join(', ')}`);
        console.log(`\nStandard map types: ${MAP_TYPES.length} types defined`);
    } else {
        console.error('Invalid arguments. Use --help for usage information.');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { 
    generateWorldMapList, 
    generateAllMapLists, 
    generateWorldSummary,
    MAP_TYPES,
    WORLDS 
};
