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
