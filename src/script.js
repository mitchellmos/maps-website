// Configuration - loaded from map-config.js
const WORLDS = ['world144', 'world147', 'world148', 'world149'];

// DOM elements
const mapsGrid = document.getElementById('mapsGrid');

// Get current world from the page
function getCurrentWorld() {
    return window.currentWorld || 'world144';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Only load maps if we're on a world page
    if (window.currentWorld) {
        loadMaps();
    }
});

// Load and display maps for the current world
async function loadMaps() {
    try {
        showLoading();
        
        const currentWorld = getCurrentWorld();
        const maps = await getMapsList(currentWorld);
        
        if (maps.length === 0) {
            showNoMaps();
            return;
        }
        
        displayMaps(maps);
    } catch (error) {
        console.error('Error loading maps:', error);
        showError();
    }
}

// Get list of available maps for a specific world
async function getMapsList(world) {
    try {
        const response = await fetch(`maps/${world}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to load maps/${world}.json:`, error);
        // Return empty array if file doesn't exist or can't be loaded
        return [];
    }
}

// Display maps in the grid
function displayMaps(maps) {
    mapsGrid.innerHTML = '';
    
    maps.forEach(map => {
        const mapElement = createMapElement(map);
        mapsGrid.appendChild(mapElement);
    });
}

// Create a map element
function createMapElement(map) {
    const mapItem = document.createElement('div');
    mapItem.className = 'map-item';
    
    mapItem.innerHTML = `
        <img src="${map.url}" alt="${map.name}" class="map-image" onclick="openModal('${map.url}', '${map.name}')">
        <div class="map-info">
            <h3 class="map-title">${map.name}</h3>
            <p class="map-date">${formatDate(map.date)}</p>
        </div>
    `;
    
    return mapItem;
}

// Show loading state
function showLoading() {
    if (!mapsGrid) return;
    
    mapsGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading maps...</p>
        </div>
    `;
}

// Show no maps message
function showNoMaps() {
    if (!mapsGrid) return;
    
    const currentWorld = getCurrentWorld();
    mapsGrid.innerHTML = `
        <div class="loading">
            <p>No maps available for ${currentWorld} yet. Check back later!</p>
            <p><small>Make sure to run <code>node generate-map-list.js</code> to generate the map list.</small></p>
        </div>
    `;
}

// Show error message
function showError() {
    if (!mapsGrid) return;
    
    mapsGrid.innerHTML = `
        <div class="loading">
            <p>Error loading maps. Please try again later.</p>
            <p><small>Check the browser console for more details.</small></p>
        </div>
    `;
}

// Open modal for full-size image viewing
function openModal(imageSrc, imageAlt) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close" onclick="closeModal(this)">&times;</span>
        <img class="modal-content" src="${imageSrc}" alt="${imageAlt}">
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal when clicking outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal(modal.querySelector('.close'));
        }
    };
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal(modal.querySelector('.close'));
        }
    });
}

// Close modal
function closeModal(element) {
    const modal = element.closest('.modal');
    modal.remove();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Refresh maps (useful for development)
function refreshMaps() {
    if (window.currentWorld) {
        loadMaps();
    }
}

// Export functions for potential use in other scripts
window.TribalWarsMaps = {
    loadMaps,
    refreshMaps,
    openModal,
    closeModal,
    getCurrentWorld,
    WORLDS
};
