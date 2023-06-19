import { _IMatch_ } from '../../models/_ModelTypes_';

const prepareBallData = (matchData: Partial<_IMatch_>, ballAction: string | boolean) => {
  let ball = {
    bowler: matchData.liveData.bowler.id,
    batsman: matchData.liveData.batsman.striker.id,
    status: ballAction,
    overNO: matchData.liveData.overs,
    wickets: matchData.liveData.wickets,
    totalRuns: matchData.liveData.runs,
    run: 0,
    ballNO: matchData.liveData.balls + 1,
  };

  if (ballAction === 'ONE') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData?.runs + 1;
  } else if (ballAction === 'BOWLED') {
    ball.wickets = matchData?.liveData?.wickets + (!matchData.liveData.freeHit ? 1 : 0);
  } else if (ballAction === 'SIX') {
    ball.run = 6;
    ball.totalRuns = matchData?.liveData?.runs + 6;
  } else if (ballAction === 'WIDE') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData?.runs + 1;
    ball.ballNO = matchData?.liveData?.balls;
  } else if (ballAction === 'RUN_OUT') {
    ball.wickets = matchData?.liveData?.wickets + 1;
  } else if (ballAction === 'TWO') {
    ball.run = 2;
    ball.totalRuns = matchData?.liveData?.runs + 2;
  } else if (ballAction === 'THREE') {
    ball.run = 3;
    ball.totalRuns = matchData?.liveData?.runs + 3;
  } else if (ballAction === 'LBW') {
    ball.wickets = matchData?.liveData?.wickets + (!matchData.liveData.freeHit ? 1 : 0);
  } else if (ballAction === 'NO_BALL') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData?.runs + 1;
    ball.ballNO = matchData?.liveData?.balls;
  } else if (ballAction === 'FOUR') {
    ball.run = 4;
    ball.totalRuns = matchData?.liveData?.runs + 4;
  } else if (ballAction === 'CATCH') {
    ball.wickets = matchData?.liveData?.wickets + (!matchData.liveData.freeHit ? 1 : 0);
  }

  return ball;
};

export { prepareBallData };
