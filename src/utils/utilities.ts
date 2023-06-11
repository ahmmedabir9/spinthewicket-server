import { DreamPlayer } from '../models/DreamPlayer.model';
import { PlayerInfo } from '../models/PlayerInfo.model';
import { _IDreamPlayer_ } from '../models/_ModelTypes_';
import { initialPlayerData } from './constants';

const shufflePlayers = (players: any) => {
  let currentIndex = players.length,
    randomIndex: number;

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

export { shufflePlayers };
