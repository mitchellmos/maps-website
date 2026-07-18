const fs = require('fs');
const path = require('path');

const { MAP_TYPES } = require('./map-config.js');

function generateWorldMapList(world, { rootDir = path.resolve(__dirname, '..') } = {}) {
    const mapsBaseDir = path.join(rootDir, 'maps');
    const worldDir = path.join(mapsBaseDir, world.id);
    fs.mkdirSync(worldDir, { recursive: true });

    const maps = MAP_TYPES.map(mapType => {
        const filePath = path.join(worldDir, mapType.filename);
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const stats = fs.statSync(filePath);
        return {
            name: mapType.name,
            filename: mapType.filename,
            url: `maps/${world.id}/${mapType.filename}`,
            size: stats.size,
            world: world.id,
            type: mapType.id
        };
    }).filter(Boolean);

    const outputFile = path.join(mapsBaseDir, `${world.id}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(maps, null, 2));
    console.log(`Generated map list for ${world.id}: ${maps.length} maps`);
    return maps;
}

function generateMapLists(worlds, options = {}) {
    const mapLists = new Map();
    for (const world of worlds) {
        mapLists.set(world.id, generateWorldMapList(world, options));
    }
    return mapLists;
}

function generateWorldsSummary(
    worlds,
    mapLists,
    { rootDir = path.resolve(__dirname, '..'), now = () => new Date() } = {}
) {
    const summary = {
        totalWorlds: worlds.length,
        worlds: {},
        lastUpdated: now().toISOString()
    };

    for (const world of worlds) {
        const maps = mapLists.get(world.id) || [];
        summary.worlds[world.id] = {
            name: world.name,
            mapCount: maps.length,
            lastUpdated: null
        };
    }

    const summaryFile = path.join(rootDir, 'maps', 'worlds-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Summary saved to: ${summaryFile}`);
    return summary;
}

module.exports = {
    generateMapLists,
    generateWorldMapList,
    generateWorldsSummary
};
