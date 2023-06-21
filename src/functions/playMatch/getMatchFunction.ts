import { _IMatch_ } from '../../models/_ModelTypes_';
import dotBall from './runs/dotBall';
import fourRuns from './runs/fourRuns';
import noBall from './runs/noBall';
import oneRun from './runs/oneRun';
import sixRuns from './runs/sixRuns';
import threeRuns from './runs/threeRuns';
import twoRuns from './runs/twoRuns';
import wideBall from './runs/wideBall';

const getMatchFunction = (
  ballAction: string | boolean,
  matchData: Partial<_IMatch_>,
  ballData: any,
) => {
  if (ballAction === 'DOT') return dotBall(matchData, ballData);
  else if (ballAction === 'ONE') return oneRun(matchData, ballData);
  else if (ballAction === 'TWO') return twoRuns(matchData, ballData);
  else if (ballAction === 'THREE') return threeRuns(matchData, ballData);
  else if (ballAction === 'FOUR') return fourRuns(matchData, ballData);
  else if (ballAction === 'SIX') return sixRuns(matchData, ballData);
  else if (ballAction === 'WIDE') return wideBall(matchData, ballData);
  else if (ballAction === 'NO_BALL') return noBall(matchData, ballData);
  //   else if (ballAction === 'BOWLED') {
  //     if (matchData?.liveData?.freeHit) {
  //       return dotBall(matchData, ballData);
  //     } else {
  //       return bowled(matchData, ballData);
  //     }
  //   } else if (ballAction === 'LBW') {
  //     if (matchData?.liveData?.freeHit) {
  //       return dotBall(matchData, ballData);
  //     } else {
  //       return lbw(matchData, ballData);
  //     }
  //   } else if (ballAction === 'CATCH') {
  //     if (matchData?.liveData?.freeHit) {
  //       return dotBall(matchData, ballData);
  //     } else {
  //       return catchOut(matchData, ballData);
  //     }
  //   } else if (ballAction === 'RUN_OUT') return runOut(matchData, ballData);
};

export { getMatchFunction };
