import { Document, Types } from 'mongoose';

// * USER INTERFACES
interface _IAchievement_ {
  achievement: Types.ObjectId;
  date: Date;
}

interface _IUser_ extends Document {
  _id?: Types.ObjectId;
  name: string;
  username?: string;
  nationality?: Types.ObjectId;
  email?: string;
  uid?: string;
  phone?: string;
  photo?: string;
  achievements: _IAchievement_[];
  xp: number;
  level: number;
  balance: number;
}

// * ACHIVEMENT
interface _IAchievement_ extends Document {
  title: string;
  description?: string;
  achievementType: 'batting' | 'bowling' | 'allround' | 'team';
  level: number;
  previousAchievement?: Types.ObjectId;
}

// * Batting Stats
interface _IBattingStat_ extends Document {
  average: number;
  balls: number;
  best?: {
    runs: number;
    balls: number;
    match: Types.ObjectId;
  };
  centuries: number;
  fours: number;
  halfCenturies: number;
  innings: number;
  matches: number;
  points: number;
  runs: number;
  sixes: number;
  strikeRate: number;
  dotBall: number;
  duck: number;
  notOut: number;
  catch: number;
  runOut: number;
}

interface _IBowlingStat_ extends Document {
  average: number;
  balls: number;
  best: {
    runs: number;
    wickets: number;
    match: Types.ObjectId;
  };
  economy: number;
  fiveWickets: number;
  innings: number;
  matches: number;
  points: number;
  runs: number;
  threeWickets: number;
  wickets: number;
  dotBalls: number;
  maidens: number;
}

interface _ICountry_ extends Document {
  name: string;
  code?: string;
}

interface _IInning_ {
  ballByBall: {
    ballNo: number;
    overNo: number;
    run: number;
    status: string;
    totalRuns: number;
    wickets: number;
    batsman: Types.ObjectId;
    bowler: Types.ObjectId;
  }[];
  balls: number;
  battingOrder: {
    balls: number;
    fours: number;
    runs: number;
    sixes: number;
    inAt: number;
    dotBalls: number;
    batsman: Types.ObjectId;
    out: {
      bowler: Types.ObjectId;
      fielder: Types.ObjectId;
      wicketType: string;
      status: string;
      strikeRate: number;
    };
  }[];
  battingTeam: Types.ObjectId;
  bowlingOrder: {
    balls: number;
    economy: number;
    maidens: number;
    dotBalls: number;
    overs: number;
    runs: number;
    wickets: number;
    bowler: Types.ObjectId;
  }[];
  bowlingTeam: Types.ObjectId;
  extra: number;
  fallOfWickets: {
    balls: number;
    overs: number;
    player: Types.ObjectId;
    runs: number;
  }[];
  overs: number;
  partnerships: {
    balls: number;
    bastman1: Types.ObjectId;
    batsman2: Types.ObjectId;
    runs: number;
  }[];
  runRate: number;
  runs: number;
  wickets: number;
}

interface _IPerformance_ {
  player: Types.ObjectId;
  points: number;
  team: Types.ObjectId;
}

interface _IResult_ {
  winner: Types.ObjectId;
  wonBy: string;
  runs: number;
  wickets: number;
}

interface _ISquad_ {
  playingXI: Types.ObjectId[];
  team: Types.ObjectId;
}

interface _IPlayerInfo_ {
  _id?: Types.ObjectId;
  name: string;
  nationality: Types.ObjectId;
  slug: string;
  activePlayer: boolean;
  teams: Types.ObjectId[];
  role: string;
  photo: string;
  battingStyle: string;
  bowlingStyle: string;
  battingLevel: number;
  bowlingLevel: number;
}

interface _IMatch_ extends Document {
  title: string;
  slug: string;
  users: Types.ObjectId[] | _IUser_[];
  innings: {
    first: _IInning_;
    second: _IInning_;
    firstSuper: _IInning_;
    secondSuper: _IInning_;
  };
  overs: number;
  performances: _IPerformance_[];
  result: _IResult_;
  teams: {
    teamA: Types.ObjectId;
    teamB: Types.ObjectId;
  };
  squad: {
    teamA: _ISquad_;
    teamB: _ISquad_;
  };
  status: string;
  toss: {
    team: Types.ObjectId;
    selectedTo?: string;
  };
  matchType: string;
  tournament: Types.ObjectId;
  league: Types.ObjectId;
  liveData: {
    inning: number;
    battingTeam: Types.ObjectId;
    bowlingTeam: Types.ObjectId;
    battingScorer: Types.ObjectId;
    bowlingScorer: Types.ObjectId;
    batsman: any;
    bowler: any;
    overs: number;
    balls: number;
    runs: number;
    wickets: number;
    runRate: number;
    extra: number;
    partnership: {
      balls: number;
      runs: number;
      batsman1: any;
      batsman2: any;
    };
    freeHit: boolean;
    history: any[];
    spinning: boolean;
    lastSpinPosition: number;
    need: number;
    target: number;
    from: number;
  };
}

interface _IDefaultTeam_ extends Document {
  title: string;
  code: string;
  isActive?: boolean;
  logo?: string;
  league: Types.ObjectId;
}

interface _IDefaultLeague_ extends Document {
  title: string;
  code: string;
  logo?: string;
}

interface _IDreamPlayer_ extends Document {
  playerInfo: any | Types.ObjectId;
  activePlayer: boolean;
  battingStat: Types.ObjectId;
  bowlingStat: Types.ObjectId;
  team: Types.ObjectId;
  trophies: {
    trophy: Types.ObjectId;
    date: Date;
  }[];
  achievements: {
    achievement: Types.ObjectId;
    date: Date;
  }[];
  isBot: boolean;
}

interface _IDreamTeam_ extends Document {
  title: string;
  teamId: string;
  code: string;
  isActive?: boolean;
  theme?: Types.ObjectId;
  captain?: Types.ObjectId;
  manager?: Types.ObjectId | Partial<_IUser_>;
  points: number;
  trophies: { trophy: Types.ObjectId; date: Date }[];
  playingXI: Types.ObjectId[];
  rating: number;
  achievements: { achievement: Types.ObjectId; date: Date }[];
  matches: {
    played: number;
    won: number;
    lost: number;
    tied: number;
    points: number;
  };
  netRunRate: {
    against: { balls: number; overs: number; runs: number };
    for: { balls: number; overs: number; runs: number };
    nRR: number;
  };
  isBot: boolean;
}

interface _IGlobalLeague_ extends Document {
  title: string;
  shortName?: string;
  country: Types.ObjectId;
  slug: string;
  logo?: string;
}

interface _IGlobalTeam_ extends Document {
  title: string;
  slug: string;
  shortName: string;
  logo?: string;
  captain: Types.ObjectId;
}
interface _ILeague_ extends Document {
  title: string;
  shortName: string;
  country: Types.ObjectId;
  slug: string;
  managers: Types.ObjectId[];
  logo?: string;
  coverPhoto?: string;
  xp: number;
  level: number;
}

interface _ILeagueInvitation_ extends Document {
  invitedBy: Types.ObjectId;
  invitedTo: Types.ObjectId;
}

interface _ILeaguePlayer_ extends Document {
  playerID: number;
  playerInfo: Types.ObjectId;
  league: Types.ObjectId;
  activePlayer: boolean;
  battingStat: Types.ObjectId;
  bowlingStat: Types.ObjectId;
  team: Types.ObjectId;
  trophies: {
    trophy: Types.ObjectId;
    date: Date;
  }[];
  achievements: {
    achievement: Types.ObjectId;
    date: Date;
  }[];
}

interface _ILeagueTeam_ extends Document {
  title: string;
  slug: string;
  shortName: string;
  isActive?: boolean;
  logo?: string;
  league: Types.ObjectId;
  captain: Types.ObjectId;
  manager: Types.ObjectId;
  points: number;
  balance: number;
  trophies: {
    trophy: Types.ObjectId;
    date: Date;
  }[];
  achievements: {
    achievement: Types.ObjectId;
    date: Date;
  }[];
  matches: {
    played: number;
    won: number;
    lost: number;
    tied: number;
    points: number;
  };
  netRunRate: {
    against: {
      balls: number;
      overs: number;
      runs: number;
    };
    for: {
      balls: number;
      overs: number;
      runs: number;
    };
    nRR: number;
  };
  xp: number;
  level: number;
}

interface _ILeagueTournamentPlayerStat_ {
  player: Types.ObjectId;
  team: Types.ObjectId;
  sixes: number;
  fours: number;
  runs: number;
  wickets: number;
  performance: number;
}

interface _ILeagueTournamentPointTable_ {
  team: Types.ObjectId;
  played: number;
  won: number;
  lost: number;
  tied: number;
  wickets: number;
  points: number;
  netRunRate: {
    against: {
      balls: number;
      overs: number;
      runs: number;
    };
    for: {
      balls: number;
      overs: number;
      runs: number;
    };
    nRR: number;
  };
}

interface _ILeagueTournamentResult_ {
  champion: Types.ObjectId;
  runnerUp: Types.ObjectId;
  manOfTheSeries: Types.ObjectId;
  mostRuns: Types.ObjectId;
  mostWickets: Types.ObjectId;
}

interface _ILeagueTournament_ extends Document {
  title: string;
  slug: string;
  poster?: string;
  league: Types.ObjectId;
  status: string;
  tournamentType: string;
  rounds: number;
  finalMatch?: boolean;
  overs: number;
  sixes: number;
  fours: number;
  playersStat: _ILeagueTournamentPlayerStat_[];
  pointTable: _ILeagueTournamentPointTable_[];
  result: _ILeagueTournamentResult_;
}

interface _ITheme_ {
  logo: string;
  color: string;
  themeType: string;
}

interface _ITrophy_ {
  title: string;
  description?: string;
  trophyType: 'champion' | 'runnerup' | 'motm' | 'mots' | 'mostruns' | 'mostwickets' | 'others';
  tournament?: Types.ObjectId;
  match?: Types.ObjectId;
  league?: Types.ObjectId;
}

export {
  _IBowlingStat_,
  _IBattingStat_,
  _IInning_,
  _IMatch_,
  _IUser_,
  _IAchievement_,
  _ICountry_,
  _IDefaultTeam_,
  _IDefaultLeague_,
  _IDreamPlayer_,
  _IDreamTeam_,
  _IGlobalLeague_,
  _IGlobalTeam_,
  _ILeague_,
  _ILeagueInvitation_,
  _ILeaguePlayer_,
  _ILeagueTeam_,
  _ILeagueTournament_,
  _ILeagueTournamentResult_,
  _ILeagueTournamentPointTable_,
  _ILeagueTournamentPlayerStat_,
  _IResult_,
  _IPerformance_,
  _ISquad_,
  _IPlayerInfo_,
  _ITheme_,
  _ITrophy_,
};
