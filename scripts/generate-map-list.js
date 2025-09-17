#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MAP_TYPES, WORLDS } = require('./map-config.js');

// Configuration
const MAPS_BASE_DIR = './maps';
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

/**
 * Generate map list for a specific world using the standard map types
 */
function generateWorldMapList(world) {
    const worldDir = path.join(MAPS_BASE_DIR, `world${world}`);
    
    try {
        // Check if world directory exists
        if (!fs.existsSync(worldDir)) {
            console.log(`World directory world${world} does not exist. Creating it...`);
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
                    url: `maps/world${world}/${mapType.filename}`,
                    
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
            console.log(`No map files found in world${world} directory.`);
            return;
        }

        // Write the map list to JSON file
        const outputFile = path.join(MAPS_BASE_DIR, `world${world}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(maps, null, 2));
        console.log(`Generated map list for world${world}: ${maps.length} maps`);

    } catch (error) {
        console.error(`Error processing world${world}:`, error.message);
    }
}

/**
 * Generate summary of all worlds
 */
function generateWorldsSummary() {
    const summary = {
        totalWorlds: WORLDS.length,
        worlds: {},
        lastUpdated: new Date().toISOString()
    };

    WORLDS.forEach(world => {
        const worldFile = path.join(MAPS_BASE_DIR, `world${world}.json`);
        
        if (fs.existsSync(worldFile)) {
            try {
                const maps = JSON.parse(fs.readFileSync(worldFile, 'utf8'));
                summary.worlds[world] = {
                    mapCount: maps.length,
                    lastUpdated: maps.length > 0 ? maps[0].date : null
                };
            } catch (error) {
                summary.worlds[world] = {
                    mapCount: 0,
                    lastUpdated: null,
                    error: error.message
                };
            }
        } else {
            summary.worlds[world] = {
                mapCount: 0,
                lastUpdated: null
            };
        }
    });

    // Write summary file
    const summaryFile = path.join(MAPS_BASE_DIR, 'worlds-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Summary saved to: ${summaryFile}`);
}

/**
 * Main function
 */
function main() {
    console.log('Generating map lists for all Tribal Wars worlds...\n');

    // Generate map lists for each world
    WORLDS.forEach(world => {
        generateWorldMapList(world);
    });

    // Generate summary
    generateWorldsSummary();

    console.log('\nMap list generation complete!\n');

    // Display summary
    console.log('World Summary:');
    WORLDS.forEach(world => {
        const worldFile = path.join(MAPS_BASE_DIR, `world${world}.json`);
        if (fs.existsSync(worldFile)) {
            try {
                const maps = JSON.parse(fs.readFileSync(worldFile, 'utf8'));
                console.log(`  ${world}: ${maps.length} maps`);
            } catch (error) {
                console.log(`  ${world}: 0 maps (error reading file)`);
            }
        } else {
            console.log(`  ${world}: 0 maps`);
        }
    });
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { generateWorldMapList, generateWorldsSummary };
