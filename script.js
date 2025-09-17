// Get current world from the page
function getCurrentWorld() {
    return window.currentWorld || '144';
}

// Get the maps container element
function getMapsContainer() {
    return document.getElementById('mapContainer');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Only load maps if we're on a world page
    if (window.currentWorld) {
        loadMaps();
    }
});

// Load and display maps for the current world
async function loadMaps(worldId = null) {
    try {
        showLoading();
        
        const currentWorld = worldId || getCurrentWorld();
        const maps = await getMapsList(currentWorld);
        
        if (maps.length === 0) {
            showNoMaps(currentWorld);
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
        const response = await fetch(`maps/world${world}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching maps:', error);
        return [];
    }
}

// Display loading state
function showLoading() {
    const container = getMapsContainer();
    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <p>Loading maps...</p>
        </div>
    `;
}

// Display no maps available message
function showNoMaps(currentWorld) {
    const container = getMapsContainer();
    if (!container) return;

    const worldNumber = currentWorld;
    container.innerHTML = `
        <div class="loading">
            <p>No maps available for World ${worldNumber} yet. Check back later!</p>
        </div>
    `;
}

// Display error state
function showError() {
    const container = getMapsContainer();
    if (!container) return;

    container.innerHTML = `
        <div class="loading">
            <p>Error loading maps. Please try again later.</p>
        </div>
    `;
}

// Display the maps in a grid
function displayMaps(maps) {
    const container = getMapsContainer();
    if (!container) return;

    container.innerHTML = maps.map(map => `
        <div class="map-item">
            <img src="${map.url}" alt="${map.name}" onclick="openModal('${map.url}', '${map.name}')">
            <div class="map-info">
                <h3>${map.name}</h3>
                <p>Updated: ${map.date}</p>
            </div>
        </div>
    `).join('');
}

// Modal functionality
function openModal(imageUrl, imageName) {
    const modal = document.getElementById('imageModal');
    if (!modal) {
        createModal();
    }
    
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    modalImg.src = imageUrl;
    modalTitle.textContent = imageName;
    
    document.getElementById('imageModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function createModal() {
    const modalHTML = `
        <div id="imageModal" class="modal" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 id="modalTitle"></h2>
                    <span class="close" onclick="closeModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <img id="modalImage" src="" alt="">
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Set current world based on page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename.startsWith('world')) {
        const worldNumber = filename.replace('world', '').replace('.html', '');
        window.currentWorld = worldNumber;
        loadMaps();
    }
});
