const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { runBuild } = require('../scripts/build.js');
const { getWorldCategory } = require('../scripts/build-pages.js');
const { MAP_TYPES } = require('../scripts/map-config.js');

function createFixture() {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'maps-website-test-'));
    fs.mkdirSync(path.join(rootDir, 'templates'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'maps', 'enold'), { recursive: true });
    fs.writeFileSync(path.join(rootDir, 'templates', 'header.html'), '<header>Header</header>');
    fs.writeFileSync(
        path.join(rootDir, 'templates', 'navigation.html'),
        '<nav><select data-default-category="{{DEFAULT_CATEGORY}}"></select>{{WORLD_BUTTONS}}</nav>'
    );
    fs.writeFileSync(path.join(rootDir, 'templates', 'footer.html'), '<footer>Footer</footer>');
    fs.writeFileSync(path.join(rootDir, 'enold.html'), 'old page');
    fs.writeFileSync(path.join(rootDir, 'maps', 'enold.json'), '[]');
    fs.writeFileSync(path.join(rootDir, 'maps', 'enold', 'barbarians.png'), 'old image');
    fs.mkdirSync(path.join(rootDir, 'maps', 'unmanaged'), { recursive: true });
    fs.writeFileSync(path.join(rootDir, 'maps', 'unmanaged', 'keep.png'), 'keep');
    fs.writeFileSync(
        path.join(rootDir, 'maps', 'worlds-summary.json'),
        JSON.stringify({ totalWorlds: 1, worlds: { enold: { mapCount: 1 } } })
    );
    return rootDir;
}

function activeWorld() {
    return {
        id: 'enc1',
        name: 'Classic & Fast',
        url: 'https://enc1.tribalwars.net',
        market: 'en',
        startsAt: '2026-05-06T09:00:00Z'
    };
}

test('builds pages for non-numeric IDs and removes all assets for retired managed worlds', async t => {
    const rootDir = createFixture();
    t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

    const result = await runBuild({
        rootDir,
        worldsLoader: async () => [activeWorld()]
    });

    assert.deepEqual(result.retiredIds, ['enold']);
    assert.equal(fs.existsSync(path.join(rootDir, 'enold.html')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'enold.json')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'enold')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'unmanaged', 'keep.png')), true);

    const page = fs.readFileSync(path.join(rootDir, 'enc1.html'), 'utf8');
    assert.match(page, /Classic &amp; Fast/);
    assert.match(page, /window\.currentWorld = "enc1"/);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(rootDir, 'maps', 'enc1.json'))), []);

    const summary = JSON.parse(
        fs.readFileSync(path.join(rootDir, 'maps', 'worlds-summary.json'), 'utf8')
    );
    assert.equal(summary.totalWorlds, 1);
    assert.equal(summary.worlds.enc1.name, 'Classic & Fast');
});

test('does not generate or delete anything when world loading fails', async t => {
    const rootDir = createFixture();
    t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

    await assert.rejects(
        runBuild({
            rootDir,
            worldsLoader: async () => { throw new Error('source unavailable'); }
        }),
        /source unavailable/
    );

    assert.equal(fs.existsSync(path.join(rootDir, 'enold.html')), true);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'enold', 'barbarians.png')), true);
    assert.equal(fs.existsSync(path.join(rootDir, 'index.html')), false);
});

test('does not delete retired assets when active output generation fails', async t => {
    const rootDir = createFixture();
    t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
    fs.rmSync(path.join(rootDir, 'templates', 'footer.html'));

    await assert.rejects(
        runBuild({
            rootDir,
            worldsLoader: async () => [activeWorld()]
        }),
        /ENOENT/
    );

    assert.equal(fs.existsSync(path.join(rootDir, 'enold.html')), true);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'enold.json')), true);
    assert.equal(fs.existsSync(path.join(rootDir, 'maps', 'enold', 'barbarians.png')), true);
});

test('groups world IDs into regular, casual, and special categories', () => {
    assert.equal(getWorldCategory({ id: 'en156' }), 'regular');
    assert.equal(getWorldCategory({ id: 'enp19' }), 'casual');
    assert.equal(getWorldCategory({ id: 'enc1' }), 'special');
});

test('places loss maps immediately after their corresponding conquer maps', () => {
    const mapTypeIds = MAP_TYPES.map(mapType => mapType.id);

    assert.equal(
        mapTypeIds.indexOf('topLossTribes'),
        mapTypeIds.indexOf('topConqTribes') + 1
    );
    assert.equal(
        mapTypeIds.indexOf('topLossPlayers'),
        mapTypeIds.indexOf('topConqPlayers') + 1
    );
});

test('generates category-aware navigation with sensible page defaults', async t => {
    const rootDir = createFixture();
    t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

    await runBuild({
        rootDir,
        worldsLoader: async () => [
            { ...activeWorld(), id: 'en156', name: 'World 156' },
            { ...activeWorld(), id: 'enp19', name: 'Casual 19' },
            activeWorld()
        ]
    });

    const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const casualPage = fs.readFileSync(path.join(rootDir, 'enp19.html'), 'utf8');
    const specialPage = fs.readFileSync(path.join(rootDir, 'enc1.html'), 'utf8');

    assert.match(index, /data-default-category="regular"/);
    assert.match(casualPage, /data-default-category="casual"/);
    assert.match(specialPage, /data-default-category="special"/);
    assert.match(index, /data-world-category="regular">World 156/);
    assert.match(index, /data-world-category="casual">Casual 19/);
    assert.match(index, /data-world-category="special"[^>]*>Classic &amp; Fast/);
});
