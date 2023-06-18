import {
  _IBattingStat_,
  _IBowlingStat_,
  _IDreamPlayer_,
  _IDreamTeam_,
  _IInning_,
} from '../models/_ModelTypes_';

const initialPlayerData: Partial<_IDreamPlayer_> = {
  trophies: [],
  achievements: [],
};

const initialBattingStat: Partial<_IBattingStat_> = {
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
};

const initialBowlingStat: Partial<_IBowlingStat_> = {
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
};

const initialTeamData: Partial<_IDreamTeam_> = {
  points: 0,
  trophies: [],
  achievements: [],
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

const initialInningData: Partial<_IInning_> = {
  battingOrder: [],
  bowlingOrder: [],
  partnerships: [],
  fallOfWickets: [],
  ballByBall: [],
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  runRate: 0,
  extra: 0,
};

const initialLiveData: any = {
  batsman: {
    striker: null,
    nonStriker: null,
  },
  bowler: null,
  overs: 0,
  balls: 0,
  runs: 0,
  wickets: 0,
  runRate: 0,
  extra: 0,
  partnership: {
    balls: 0,
    runs: 0,
    batsman1: null,
    batsman2: null,
  },
  freeHit: false,
  history: [],
  spinning: false,
  lastSpinPosition: 0,
};

const initialMatchBatsmanData = {
  balls: 0,
  fours: 0,
  runs: 0,
  sixes: 0,
  dotBalls: 0,
};

const initialMatchBowlerData = {
  balls: 0,
  economy: 0,
  maidens: 0,
  dotBalls: 0,
  overs: 0,
  runs: 0,
  wickets: 0,
};

export {
  initialPlayerData,
  initialTeamData,
  initialBattingStat,
  initialBowlingStat,
  initialInningData,
  initialLiveData,
  initialMatchBatsmanData,
  initialMatchBowlerData,
};
