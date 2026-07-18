const WORLDS_URL = 'https://raw.githubusercontent.com/mitchellmos/tribalwars-config/main/worlds.json';
const SUPPORTED_SCHEMA_VERSION = 1;
const DEFAULT_MARKET = 'en';
const DEFAULT_TIMEOUT_MS = 10_000;
const SAFE_WORLD_ID = /^[a-z0-9]+$/;

function validateWorldDocument(document, market = DEFAULT_MARKET) {
    if (!document || typeof document !== 'object' || Array.isArray(document)) {
        throw new Error('World configuration must be a JSON object.');
    }

    if (document.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
        throw new Error(
            `Unsupported world configuration schemaVersion: ${document.schemaVersion}. ` +
            `Expected ${SUPPORTED_SCHEMA_VERSION}.`
        );
    }

    if (!Array.isArray(document.worlds)) {
        throw new Error('World configuration must contain a worlds array.');
    }

    const worlds = document.worlds
        .filter(world => world && world.market === market)
        .map((world, index) => validateWorld(world, index));

    if (worlds.length === 0) {
        throw new Error(`World configuration contains no worlds for market "${market}".`);
    }

    const seenIds = new Set();
    for (const world of worlds) {
        if (seenIds.has(world.id)) {
            throw new Error(`World configuration contains duplicate id "${world.id}".`);
        }
        seenIds.add(world.id);
    }

    return worlds;
}

function validateWorld(world, index) {
    const prefix = `Invalid world at index ${index}`;

    if (typeof world.id !== 'string' || !SAFE_WORLD_ID.test(world.id)) {
        throw new Error(`${prefix}: id must contain only lowercase letters and numbers.`);
    }

    if (typeof world.name !== 'string' || world.name.trim() === '') {
        throw new Error(`${prefix}: name must be a non-empty string.`);
    }

    if (typeof world.url !== 'string') {
        throw new Error(`${prefix}: url must be an HTTPS URL.`);
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(world.url);
    } catch {
        throw new Error(`${prefix}: url must be an HTTPS URL.`);
    }

    if (parsedUrl.protocol !== 'https:') {
        throw new Error(`${prefix}: url must be an HTTPS URL.`);
    }

    if (
        typeof world.startsAt !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T/.test(world.startsAt) ||
        !Number.isFinite(Date.parse(world.startsAt))
    ) {
        throw new Error(`${prefix}: startsAt must be a valid date-time string.`);
    }

    return {
        id: world.id,
        name: world.name.trim(),
        url: world.url,
        market: world.market,
        startsAt: world.startsAt
    };
}

async function loadWorlds({
    url = WORLDS_URL,
    market = DEFAULT_MARKET,
    fetchImpl = globalThis.fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
    if (typeof fetchImpl !== 'function') {
        throw new Error('This build requires a Node.js version with fetch support.');
    }

    let response;
    try {
        response = await fetchImpl(url, {
            headers: { accept: 'application/json' },
            signal: AbortSignal.timeout(timeoutMs)
        });
    } catch (error) {
        throw new Error(`Unable to fetch world configuration from ${url}: ${error.message}`);
    }

    if (!response.ok) {
        throw new Error(
            `Unable to fetch world configuration from ${url}: HTTP ${response.status}.`
        );
    }

    let document;
    try {
        document = await response.json();
    } catch (error) {
        throw new Error(`World configuration from ${url} is not valid JSON: ${error.message}`);
    }

    return validateWorldDocument(document, market);
}

module.exports = {
    DEFAULT_MARKET,
    SAFE_WORLD_ID,
    SUPPORTED_SCHEMA_VERSION,
    WORLDS_URL,
    loadWorlds,
    validateWorldDocument
};
