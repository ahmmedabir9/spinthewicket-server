import { _IMatch_ } from '../../models/_ModelTypes_';

const getBatsmanStats = (
  matchData: Partial<_IMatch_>,
  run: number,
  ball: number,
  out?: string,
  nonStriker?: boolean,
) => {
  let stats = matchData.liveData.batsman[nonStriker ? 'nonStriker' : 'striker'];

  stats.balls = stats.balls + ball;
  stats.runs = stats.runs + run;
  stats.fours = stats.fours + (run === 4 ? 1 : 0);
  stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
  stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
  stats.strikeRate = getStrikeRate(matchData, run, ball);

  if (out) {
    stats.status = 'out';
    stats.out = {
      bowler: matchData.liveData.bowler.id,
      wicketType: out,
    };

    if (out === 'CATCH' || out === 'RUN_OUT') {
      const index = Math.floor(Math.random() * 100) % 11;
      const team = matchData.liveData.bowlingTeam === matchData.teams.teamA ? 'teamA' : 'teamB';
      stats.fielder = matchData.squad[team].playingXI[index];
    }
  }

  return stats;
};

const getBowlerStats = (
  matchData: Partial<_IMatch_>,
  run: number,
  ball: number,
  wicket?: number,
) => {
  let stats = matchData.liveData.bowler;

  stats.balls = stats.balls + ball;
  stats.runs = stats.runs + run;
  stats.wickets = stats.wickets + (wicket || 0);
  stats.fours = stats.fours + (run === 4 ? 1 : 0);
  stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
  stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
  stats.economy = getEconomy(matchData, run, ball);

  return stats;
};

const updateBowlingOrder = (matchData: Partial<_IMatch_>, endOfOver?: boolean) => {
  let bowlingOrder = matchData.innings[matchData.liveData.inning].bowlingOrder || [];
  bowlingOrder = bowlingOrder.filter((b) => b.id?.toString() !== matchData.liveData.bowler.id);

  if (!matchData.liveData.bowler.runs) matchData.liveData.bowler.maidens++;
  if (endOfOver) {
    matchData.liveData.bowler.overs++;
    matchData.liveData.bowler.balls = 0;
  }

  bowlingOrder.push(matchData.liveData.bowler);

  return bowlingOrder;
};

const updateOverHistory = (matchData: Partial<_IMatch_>) => {
  let overHistory = matchData.innings[matchData.liveData.inning].overHistory || [];

  overHistory.push(matchData.liveData.thisOver);

  return overHistory;
};

const getStrikeRate = (matchData: Partial<_IMatch_>, run: number, ball: number) => {
  return (
    ((matchData.liveData.batsman.striker.runs + run) /
      (matchData.liveData.batsman.striker.balls + ball)) *
    100
  );
};

const getEconomy = (matchData: Partial<_IMatch_>, run: number, ball: number) => {
  return (
    (matchData.liveData.bowler.runs + run) /
    ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + ball)) / 6)
  );
};

const getRunRate = (matchData: Partial<_IMatch_>, run: number, ball: number) => {
  return (
    (matchData.liveData.runs + run) /
    ((matchData.liveData.overs * 6 + (matchData.liveData.balls + ball)) / 6)
  );
};

const getPartnarship = (matchData: Partial<_IMatch_>, run: number, ball: number) => {
  return {
    runs: (matchData.liveData.partnership.runs || 0) + run,
    balls: (matchData.liveData.partnership.balls || 0) + ball,
    batsman1: matchData.liveData.batsman.striker.id,
    batsman2: matchData.liveData.batsman.nonStriker.id,
  };
};

const getFallOfWicket = (matchData: Partial<_IMatch_>, player: any, ball: number) => {
  return {
    runs: matchData.liveData.runs,
    balls: matchData.liveData.balls + ball,
    player: player,
    overs: matchData.liveData.overs,
  };
};

const getTargetUpdate = (matchData: Partial<_IMatch_>, run: number, ball: number) => {
  return {
    'liveData.need': matchData.liveData.need - run,
    'liveData.from': matchData.liveData.from - ball,
    'liveData.reqRR': (matchData.liveData.need - run) / ((matchData.liveData.from - ball) / 6),
  };
};

export {
  getStrikeRate,
  getEconomy,
  getRunRate,
  getPartnarship,
  getBatsmanStats,
  getBowlerStats,
  updateBowlingOrder,
  updateOverHistory,
  getTargetUpdate,
  getFallOfWicket,
};
