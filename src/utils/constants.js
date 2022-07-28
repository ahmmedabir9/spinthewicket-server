const initialPlayerData = {
  trophies: [],
  achivements: [],
  battingStats: {
    average: 0,
    balls: 0,
    centuries: 0,
    fours: 0,
    halfCenturies: 0,
    innings: 0,
    matches: 0,
    points: 0,
    runs: 0,
    sixes: 0,
    strikeRate: 0,
    dotBall: 0,
    duck: 0,
    notOut: 0,
    catch: 0,
    runOut: 0,
  },
  bwlingStats: {
    average: 0,
    balls: 0,
    economy: 0,
    fiveWickets: 0,
    innings: 0,
    matches: 0,
    points: 0,
    runs: 0,
    threeWickets: 0,
    wickets: 0,
    dotBalls: 0,
    maidens: 0,
  },
};

const initialTeamData = {
  points: 0,
  trophies: [],
  achivements: [],
  matches: {
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    points: 0,
  },
  netRunRate: {
    against: {
      balls: 0,
      overs: 0,
      runs: 0,
    },
    for: {
      balls: 0,
      overs: 0,
      runs: 0,
    },
    nRR: 0,
  },
};

module.exports = {
  initialPlayerData,
  initialTeamData,
};
