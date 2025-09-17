// Configuration for Tribal Wars maps
// This defines the standard map types that exist for every world

const MAP_TYPES = [
    { id: 'barbarians', name: 'Barbarians', filename: 'barbarians.png' },
    { id: 'topDominanceTribes', name: 'Top Dominance Tribes', filename: 'topDominanceTribes.png' },
    { id: 'topLossTribes', name: 'Top Loss Tribes', filename: 'topLossTribes.png' },
    { id: 'topConqTribes', name: 'Top Conquer Tribes', filename: 'topConqTribes.png' },
    { id: 'topODDTribes', name: 'Top ODD Tribes', filename: 'topODDTribes.png' },
    { id: 'topODATribes', name: 'Top ODA Tribes', filename: 'topODATribes.png' },
    { id: 'topODTribes', name: 'Top OD Tribes', filename: 'topODTribes.png' },
    { id: 'topTribes', name: 'Top Tribes', filename: 'topTribes.png' },
    { id: 'topDominancePlayers', name: 'Top Dominance Players', filename: 'topDominancePlayers.png' },
    { id: 'topLossPlayers', name: 'Top Loss Players', filename: 'topLossPlayers.png' },
    { id: 'topConqPlayers', name: 'Top Conquer Players', filename: 'topConqPlayers.png' },
    { id: 'topODDPlayers', name: 'Top ODD Players', filename: 'topODDPlayers.png' },
    { id: 'topODAPlayers', name: 'Top ODA Players', filename: 'topODAPlayers.png' },
    { id: 'topODPlayers', name: 'Top OD Players', filename: 'topODPlayers.png' },
    { id: 'topPlayers', name: 'Top Players', filename: 'topPlayers.png' }
];

// List of active worlds - add new worlds here
const WORLDS = ['world144', 'world147', 'world148', 'world149'];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_TYPES, WORLDS };
}
