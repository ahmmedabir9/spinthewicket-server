import { _IMatch_ } from '../../models/_ModelTypes_';

const getBatsmanStats = (
  matchData: Partial<_IMatch_>,
  run: number,
  ball: number,
  out?: string,
  nonStriker?: boolean,
  battingTeam?: string,
  bowlingTeam?: string,
) => {
  const stats = matchData.liveData?.[`${battingTeam}`]?.batsman[nonStriker ? 'nonStriker' : 'striker'];

  stats.balls = stats.balls + ball;
  stats.runs = stats.runs + run;
  stats.fours = stats.fours + (run === 4 ? 1 : 0);
  stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
  stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
  stats.strikeRate = getStrikeRate(matchData, run, ball);

  if (out) {
    stats.status = 'out';
    stats.out = {
      bowler: matchData.liveData?.[bowlingTeam]?.bowler.id,
      wicketType: out,
    };

    if (out === 'CATCH' || out === 'RUN_OUT') {
      const index = Math.floor(Math.random() * 100) % 11;
      stats.fielder = matchData.squad[bowlingTeam].playingXI[index];
    }
  }

  return stats;
};

const getBowlerStats = (matchData: Partial<_IMatch_>, run: number, ball: number, wicket?: number, battingTeam?: string, bowlingTeam?: string) => {
  const stats = matchData.liveData?.[bowlingTeam]?.bowler;

  stats.balls = stats.balls + ball;
  stats.runs = stats.runs + run;
  stats.wickets = stats.wickets + (wicket || 0);
  stats.fours = stats.fours + (run === 4 ? 1 : 0);
  stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
  stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
  stats.economy = getEconomy(matchData, run, ball);

  return stats;
};

const updateBowlingOrder = (matchData: Partial<_IMatch_>, endOfOver?: boolean, battingTeam?: string, bowlingTeam?: string) => {
  let bowlingOrder = matchData.innings[matchData.liveData.inning].bowlingOrder || [];
  bowlingOrder = bowlingOrder.filter((b) => b.id?.toString() !== matchData.liveData?.[bowlingTeam]?.bowler.id);

  if (!matchData.liveData?.[bowlingTeam]?.bowler.runs) matchData.liveData[bowlingTeam].bowler.maidens++;
  if (endOfOver) {
    matchData.liveData[bowlingTeam].bowler.overs++;
    matchData.liveData[bowlingTeam].bowler.balls = 0;
  }

  bowlingOrder.push(matchData.liveData[bowlingTeam]?.bowler);

  return bowlingOrder;
};

const updateOverHistory = (matchData: Partial<_IMatch_>, battingTeam?: string) => {
  const overHistory = matchData.innings[matchData.liveData.inning].overHistory || [];

  overHistory.push(matchData.liveData[battingTeam]?.thisOver);

  return overHistory;
};

const getStrikeRate = (matchData: Partial<_IMatch_>, run: number, ball: number, battingTeam?: string) => {
  return ((matchData.liveData[battingTeam]?.batsman.striker.runs + run) / (matchData.liveData[battingTeam]?.batsman.striker.balls + ball)) * 100;
};

const getEconomy = (matchData: Partial<_IMatch_>, run: number, ball: number, bowlingTeam?: string) => {
  return (
    (matchData.liveData[bowlingTeam].bowler.runs + run) /
    ((matchData.liveData[bowlingTeam].bowler.overs * 6 + (matchData.liveData[bowlingTeam].bowler.balls + ball)) / 6)
  );
};

const getRunRate = (matchData: Partial<_IMatch_>, run: number, ball: number, battingTeam?: string) => {
  return (
    (matchData.liveData[battingTeam].runs + run) / ((matchData.liveData[battingTeam].overs * 6 + (matchData.liveData[battingTeam].balls + ball)) / 6)
  );
};

const getPartnarship = (matchData: Partial<_IMatch_>, run: number, ball: number, battingTeam?: string) => {
  return {
    runs: (matchData.liveData[battingTeam].partnership.runs || 0) + run,
    balls: (matchData.liveData[battingTeam].partnership.balls || 0) + ball,
    batsman1: matchData.liveData[battingTeam].batsman.striker.id,
    batsman2: matchData.liveData[battingTeam].batsman.nonStriker.id,
  };
};

const getFallOfWicket = (matchData: Partial<_IMatch_>, player: any, ball: number, battingTeam?: string) => {
  return {
    runs: matchData.liveData[battingTeam].runs,
    balls: matchData.liveData[battingTeam].balls + ball,
    player: player,
    overs: matchData.liveData[battingTeam].overs,
  };
};

const getTargetUpdate = (matchData: Partial<_IMatch_>, run: number, ball: number, battingTeam?: string) => {
  return {
    'liveData.need': matchData.liveData[battingTeam].need - run,
    'liveData.from': matchData.liveData[battingTeam].from - ball,
    'liveData.reqRR': (matchData.liveData[battingTeam].need - run) / ((matchData.liveData[battingTeam].from - ball) / 6),
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
