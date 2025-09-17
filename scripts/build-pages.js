const fs = require('fs');
const path = require('path');

// Load world configuration
const mapConfig = require('./map-config.js');
const WORLDS = mapConfig.WORLDS;

// Read template files
const headerTemplate = fs.readFileSync('templates/header.html', 'utf8');
const navTemplate = fs.readFileSync('templates/navigation.html', 'utf8');
const footerTemplate = fs.readFileSync('templates/footer.html', 'utf8');

// Base HTML template
const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
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

// Generate navigation buttons dynamically
function generateNavigationButtons() {
    return WORLDS.map(world => 
        `<a href="world${world}.html" class="world-btn">World ${world}</a>`
    ).join('\n            ');
}

// Build index page
function buildIndexPage() {
    const indexTemplate = fs.readFileSync('templates/index-template.html', 'utf8');
    
    let html = baseTemplate
        .replace('{{TITLE}}', 'TribalWars Maps - Daily Map Updates')
        .replace('{{HEADER}}', headerTemplate)
        .replace('{{NAVIGATION}}', navTemplate.replace('{{WORLD_BUTTONS}}', generateNavigationButtons()))
        .replace('{{CONTENT}}', indexTemplate)
        .replace('{{FOOTER}}', footerTemplate)
        .replace('{{SCRIPTS}}', '');

    fs.writeFileSync('index.html', html);
    console.log('Generated: index.html');
}

// Build world pages
function buildWorldPages() {
    const worldTemplate = fs.readFileSync('templates/world-template.html', 'utf8');
    
    WORLDS.forEach(world => {
        let html = baseTemplate
            .replace('{{TITLE}}', `World ${world} Maps - TribalWars Maps`)
            .replace('{{HEADER}}', headerTemplate)
            .replace('{{NAVIGATION}}', navTemplate.replace('{{WORLD_BUTTONS}}', generateNavigationButtons()))
            .replace('{{CONTENT}}', worldTemplate)
            .replace('{{FOOTER}}', footerTemplate)
            .replace('{{SCRIPTS}}', '');

        fs.writeFileSync(`world${world}.html`, html);
        console.log(`Generated: world${world}.html`);
    });
}

// Main build function
function build() {
    console.log('Building pages...');
    buildIndexPage();
    buildWorldPages();
    console.log(`All pages generated successfully! Built ${WORLDS.length + 1} pages for ${WORLDS.length} worlds.`);
}

build();
