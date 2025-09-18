// Configuration for Tribal Wars maps
// This defines the standard map types that exist for every world

const MAP_TYPES = [
    { id: 'topPlayers', name: 'Top Players', filename: 'topPlayers.png' },
    { id: 'topTribes', name: 'Top Tribes', filename: 'topTribes.png' },
    { id: 'topConqTribes', name: 'Tribe Conquers', filename: 'topConqTribes.png' },
    { id: 'topODTribes', name: 'Top OD Tribes', filename: 'topODTribes.png' },
    { id: 'topODATribes', name: 'Top ODA Tribes', filename: 'topODATribes.png' },
    { id: 'topODDTribes', name: 'Top ODD Tribes', filename: 'topODDTribes.png' },
    { id: 'topConqPlayers', name: 'Player Conquers', filename: 'topConqPlayers.png' },
    { id: 'topODPlayers', name: 'Top OD Players', filename: 'topODPlayers.png' },
    { id: 'topODAPlayers', name: 'Top ODA Players', filename: 'topODAPlayers.png' },
    { id: 'topODDPlayers', name: 'Top ODD Players', filename: 'topODDPlayers.png' },
    { id: 'barbarians', name: 'Barbarians', filename: 'barbarians.png' },
    { id: 'topDominancePlayers', name: 'Player Dominance', filename: 'topDominancePlayers.png' },
    { id: 'topDominanceTribes', name: 'Tribe Dominance', filename: 'topDominanceTribes.png' },
];

// World mapping: internal name -> display name
const WORLD_MAPPING = {
    'en144': 'World 144',
    'en146': 'World 146', 
    'en147': 'World 147',
    'en148': 'World 148',
    'en149': 'World 149'
};

// List of active worlds (internal names) - add new worlds here
const WORLDS = ['en144', 'en146', 'en147', 'en148', 'en149'];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_TYPES, WORLDS, WORLD_MAPPING };
}
