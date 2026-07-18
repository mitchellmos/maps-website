const fs = require('fs');
const path = require('path');

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}

function getWorldCategory(world) {
    if (/^en\d+$/.test(world.id)) {
        return 'regular';
    }

    if (/^enp\d+$/.test(world.id)) {
        return 'casual';
    }

    return 'special';
}

function buildPages(worlds, { rootDir = path.resolve(__dirname, '..') } = {}) {
    const templatesDir = path.join(rootDir, 'templates');
    const headerTemplate = fs.readFileSync(path.join(templatesDir, 'header.html'), 'utf8');
    const navTemplate = fs.readFileSync(path.join(templatesDir, 'navigation.html'), 'utf8');
    const footerTemplate = fs.readFileSync(path.join(templatesDir, 'footer.html'), 'utf8');

    const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    {{HEADER}}
    {{NAVIGATION}}
    {{CONTENT}}
    {{FOOTER}}
    {{SCRIPTS}}
</body>
</html>`;

    const buildNavigation = (currentWorld) => {
        const defaultCategory = currentWorld ? getWorldCategory(currentWorld) : 'regular';
        const navigationButtons = worlds.map(world => {
            const category = getWorldCategory(world);
            const currentPage = currentWorld && world.id === currentWorld.id;
            return `<a href="${world.id}.html" class="world-btn${currentPage ? ' is-current' : ''}" data-world-category="${category}"${currentPage ? ' aria-current="page"' : ''}>${escapeHtml(world.name)}</a>`;
        }).join('\n            ');

        return navTemplate
            .replace('{{DEFAULT_CATEGORY}}', defaultCategory)
            .replace('{{WORLD_BUTTONS}}', navigationButtons);
    };

    const indexContent = `<main>
    <div class="container">
        <div class="welcome-section">
            <h2>Welcome to TribalWars Maps <span class="attribution">by superdog</span></h2>
            <p>Select a world above to view the latest map data.</p>
            <p>Got suggestions or feedback? Contact us at <a href="mailto:contact@superdogmaps.com" class="contact-link">contact@superdogmaps.com</a></p>
        </div>
    </div>
</main>`;

    const indexHtml = baseTemplate
        .replace('{{TITLE}}', 'TribalWars Maps - Daily Map Updates')
        .replace('{{HEADER}}', headerTemplate)
        .replace('{{NAVIGATION}}', buildNavigation())
        .replace('{{CONTENT}}', indexContent)
        .replace('{{FOOTER}}', footerTemplate)
        .replace('{{SCRIPTS}}', '');

    fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml);
    console.log('Generated: index.html');

    for (const world of worlds) {
        const worldContent = `<main>
    <div class="container">
        <div class="map-grid" id="mapContainer">
            <div class="loading">
                <p>Loading maps...</p>
            </div>
        </div>
    </div>
</main>`;
        const scripts = `<script>window.currentWorld = ${JSON.stringify(world.id)};</script>
    <script src="script.js"></script>`;
        const html = baseTemplate
            .replace('{{TITLE}}', `${escapeHtml(world.name)} Maps - TribalWars Maps`)
            .replace('{{HEADER}}', headerTemplate)
            .replace('{{NAVIGATION}}', buildNavigation(world))
            .replace('{{CONTENT}}', worldContent)
            .replace('{{FOOTER}}', footerTemplate)
            .replace('{{SCRIPTS}}', scripts);

        fs.writeFileSync(path.join(rootDir, `${world.id}.html`), html);
        console.log(`Generated: ${world.id}.html`);
    }

    console.log(
        `All pages generated successfully! Built ${worlds.length + 1} pages for ${worlds.length} worlds.`
    );
}

module.exports = { buildPages, escapeHtml, getWorldCategory };
