#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { buildPages } = require('./build-pages.js');
const { generateMapLists, generateWorldsSummary } = require('./generate-map-list.js');
const { loadWorlds, SAFE_WORLD_ID } = require('./world-config.js');

const DEFAULT_ROOT_DIR = path.resolve(__dirname, '..');

function readPreviousWorldIds(rootDir) {
    const summaryFile = path.join(rootDir, 'maps', 'worlds-summary.json');
    if (!fs.existsSync(summaryFile)) {
        return [];
    }

    try {
        const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
        if (!summary.worlds || typeof summary.worlds !== 'object' || Array.isArray(summary.worlds)) {
            throw new Error('missing worlds object');
        }

        return Object.keys(summary.worlds).filter(id => SAFE_WORLD_ID.test(id));
    } catch (error) {
        console.warn(
            `Unable to read previous world state from ${summaryFile}; retirement cleanup skipped: ` +
            error.message
        );
        return [];
    }
}

function cleanupRetiredWorlds(previousWorldIds, activeWorldIds, rootDir) {
    const activeIds = new Set(activeWorldIds);
    const retiredIds = previousWorldIds.filter(id => !activeIds.has(id));

    for (const id of retiredIds) {
        const targets = [
            path.join(rootDir, `${id}.html`),
            path.join(rootDir, 'maps', `${id}.json`),
            path.join(rootDir, 'maps', id)
        ];

        for (const target of targets) {
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
                console.log(`Removed retired world asset: ${path.relative(rootDir, target)}`);
            }
        }
    }

    return retiredIds;
}

async function runBuild({ rootDir = DEFAULT_ROOT_DIR, worldsLoader = loadWorlds } = {}) {
    console.log('Fetching active worlds...');
    const worlds = await worldsLoader();
    console.log(`Loaded ${worlds.length} active English worlds.`);

    const previousWorldIds = readPreviousWorldIds(rootDir);
    buildPages(worlds, { rootDir });
    const mapLists = generateMapLists(worlds, { rootDir });

    const retiredIds = cleanupRetiredWorlds(
        previousWorldIds,
        worlds.map(world => world.id),
        rootDir
    );

    generateWorldsSummary(worlds, mapLists, { rootDir });
    console.log(
        `Build complete: ${worlds.length} active worlds, ${retiredIds.length} retired worlds cleaned up.`
    );

    return { worlds, retiredIds };
}

if (require.main === module) {
    runBuild().catch(error => {
        console.error(`Build failed: ${error.message}`);
        process.exitCode = 1;
    });
}

module.exports = {
    cleanupRetiredWorlds,
    readPreviousWorldIds,
    runBuild
};
