// Configuration for Tribal Wars maps
// This defines the standard map types that exist for every world

const MAP_TYPES = [
    { id: 'topPlayers', name: 'Top Players', filename: 'topPlayers.png' },
    { id: 'topTribes', name: 'Top Tribes', filename: 'topTribes.png' },
    { id: 'topConqTribes', name: 'Tribe Conquers', filename: 'topConqTribes.png' },
    { id: 'topLossTribes', name: 'Tribe Losses', filename: 'topLossTribes.png' },
    { id: 'topODTribes', name: 'Top OD Tribes', filename: 'topODTribes.png' },
    { id: 'topODATribes', name: 'Top ODA Tribes', filename: 'topODATribes.png' },
    { id: 'topODDTribes', name: 'Top ODD Tribes', filename: 'topODDTribes.png' },
    { id: 'topConqPlayers', name: 'Player Conquers', filename: 'topConqPlayers.png' },
    { id: 'topLossPlayers', name: 'Player Losses', filename: 'topLossPlayers.png' },
    { id: 'topODPlayers', name: 'Top OD Players', filename: 'topODPlayers.png' },
    { id: 'topODAPlayers', name: 'Top ODA Players', filename: 'topODAPlayers.png' },
    { id: 'topODDPlayers', name: 'Top ODD Players', filename: 'topODDPlayers.png' },
    { id: 'topODSPlayers', name: 'Top ODS Players', filename: 'topODSPlayers.png' },
    { id: 'barbarians', name: 'Barbarians', filename: 'barbarians.png' },
    { id: 'topDominancePlayers', name: 'Player Dominance', filename: 'topDominancePlayers.png' },
    { id: 'topDominanceTribes', name: 'Tribe Dominance', filename: 'topDominanceTribes.png' },
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_TYPES };
}
