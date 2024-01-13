import { _IMatch_ } from '../../models/_ModelTypes_';
import dotBall from './runs/dotBall';
import fourRuns from './runs/fourRuns';
import noBall from './runs/noBall';
import oneRun from './runs/oneRun';
import sixRuns from './runs/sixRuns';
import threeRuns from './runs/threeRuns';
import twoRuns from './runs/twoRuns';
import wideBall from './runs/wideBall';
import bowled from './wickets/bowled';
import catchOut from './wickets/catchOut';
import lbw from './wickets/lbw';
import runOut from './wickets/runOut';

const getMatchFunction = (
  ballAction: string | boolean,
  matchData: Partial<_IMatch_>,
  ballData: any,
  battingTeam: string,
  bowlingTeam: string,
  inning: string,
) => {
  if (ballAction === 'DOT') return dotBall(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'ONE') return oneRun(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'TWO') return twoRuns(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'THREE') return threeRuns(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'FOUR') return fourRuns(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'SIX') return sixRuns(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'WIDE') return wideBall(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'NO_BALL') return noBall(matchData, ballData, battingTeam, bowlingTeam, inning);
  else if (ballAction === 'BOWLED') {
    if (matchData?.liveData?.[`${battingTeam}`]?.freeHit) {
      return dotBall(matchData, ballData, battingTeam, bowlingTeam, inning);
    } else {
      return bowled(matchData, ballData, battingTeam, bowlingTeam, inning);
    }
  } else if (ballAction === 'LBW') {
    if (matchData?.liveData?.[`${battingTeam}`]?.freeHit) {
      return dotBall(matchData, ballData, battingTeam, bowlingTeam, inning);
    } else {
      return lbw(matchData, ballData, battingTeam, bowlingTeam, inning);
    }
  } else if (ballAction === 'CATCH') {
    if (matchData?.liveData?.[`${battingTeam}`]?.freeHit) {
      return dotBall(matchData, ballData, battingTeam, bowlingTeam, inning);
    } else {
      return catchOut(matchData, ballData, battingTeam, bowlingTeam, inning);
    }
  } else if (ballAction === 'RUN_OUT') return runOut(matchData, ballData, battingTeam, bowlingTeam, inning);
};

export { getMatchFunction };
