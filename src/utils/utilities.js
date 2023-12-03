"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shufflePlayers = void 0;
const shufflePlayers = (players) => {
    let currentIndex = players.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]];
    }
    return players;
};
exports.shufflePlayers = shufflePlayers;
