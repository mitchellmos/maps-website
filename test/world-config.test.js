const assert = require('node:assert/strict');
const test = require('node:test');

const { loadWorlds, validateWorldDocument } = require('../scripts/world-config.js');

function world(overrides = {}) {
    return {
        id: 'en156',
        name: 'World 156',
        url: 'https://en156.tribalwars.net',
        market: 'en',
        startsAt: '2026-06-17T09:00:00Z',
        ...overrides
    };
}

test('filters to English worlds while preserving source order and supported ID variants', () => {
    const worlds = validateWorldDocument({
        schemaVersion: 1,
        worlds: [
            world({ id: 'enc1', name: 'Classic' }),
            world({ id: 'de200', name: 'Welt 200', market: 'de', url: 'https://de200.die-staemme.de' }),
            world({ id: 'enp19', name: 'Casual 19' })
        ]
    });

    assert.deepEqual(worlds.map(item => item.id), ['enc1', 'enp19']);
    assert.deepEqual(worlds.map(item => item.name), ['Classic', 'Casual 19']);
});

test('rejects unsupported schemas, duplicate IDs, unsafe IDs, and empty English lists', () => {
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 2, worlds: [world()] }),
        /Unsupported.*schemaVersion/
    );
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world(), world()] }),
        /duplicate id/
    );
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world({ id: '../en156' })] }),
        /lowercase letters and numbers/
    );
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world({ market: 'de' })] }),
        /no worlds for market/
    );
});

test('rejects malformed selected world fields', () => {
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world({ name: ' ' })] }),
        /name must be/
    );
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world({ url: 'http://example.com' })] }),
        /HTTPS URL/
    );
    assert.throws(
        () => validateWorldDocument({ schemaVersion: 1, worlds: [world({ startsAt: 'eventually' })] }),
        /valid date-time/
    );
});

test('loads and validates a successful HTTP response', async () => {
    const worlds = await loadWorlds({
        fetchImpl: async () => ({
            ok: true,
            json: async () => ({ schemaVersion: 1, worlds: [world()] })
        })
    });

    assert.equal(worlds[0].id, 'en156');
});

test('reports network, HTTP, and JSON failures', async () => {
    await assert.rejects(
        loadWorlds({ fetchImpl: async () => { throw new Error('offline'); } }),
        /Unable to fetch.*offline/
    );
    await assert.rejects(
        loadWorlds({ fetchImpl: async () => ({ ok: false, status: 503 }) }),
        /HTTP 503/
    );
    await assert.rejects(
        loadWorlds({
            fetchImpl: async () => ({
                ok: true,
                json: async () => { throw new SyntaxError('bad JSON'); }
            })
        }),
        /not valid JSON/
    );
});

test('aborts a world configuration request after the configured timeout', async () => {
    await assert.rejects(
        loadWorlds({
            timeoutMs: 1,
            fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
                signal.addEventListener('abort', () => reject(signal.reason), { once: true });
            })
        }),
        /Unable to fetch world configuration/
    );
});
