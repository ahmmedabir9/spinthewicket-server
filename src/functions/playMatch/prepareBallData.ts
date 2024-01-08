import { _IMatch_ } from '../../models/_ModelTypes_';

const prepareBallData = (matchData: Partial<_IMatch_>, ballAction: string | boolean, battingTeam: string, bowlingTeam: string) => {
  const ball = {
    bowler: matchData.liveData[bowlingTeam].bowler.id,
    batsman: matchData.liveData[battingTeam].batsman.striker.id,
    status: ballAction,
    overNo: matchData.liveData[battingTeam].overs,
    wickets: matchData.liveData[battingTeam].wickets,
    totalRuns: matchData.liveData[battingTeam].runs,
    run: 0,
    ballNo: matchData.liveData[battingTeam].balls + 1,
  };

  if (ballAction === 'ONE') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 1;
  } else if (ballAction === 'BOWLED') {
    ball.wickets = matchData?.liveData[battingTeam]?.wickets + (!matchData.liveData[battingTeam].freeHit ? 1 : 0);
  } else if (ballAction === 'SIX') {
    ball.run = 6;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 6;
  } else if (ballAction === 'WIDE') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 1;
    ball.ballNo = matchData?.liveData[battingTeam]?.balls;
  } else if (ballAction === 'RUN_OUT') {
    ball.wickets = matchData?.liveData[battingTeam]?.wickets + 1;
  } else if (ballAction === 'TWO') {
    ball.run = 2;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 2;
  } else if (ballAction === 'THREE') {
    ball.run = 3;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 3;
  } else if (ballAction === 'LBW') {
    ball.wickets = matchData?.liveData[battingTeam]?.wickets + (!matchData.liveData[battingTeam].freeHit ? 1 : 0);
  } else if (ballAction === 'NO_BALL') {
    ball.run = 1;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 1;
    ball.ballNo = matchData?.liveData[battingTeam]?.balls;
  } else if (ballAction === 'FOUR') {
    ball.run = 4;
    ball.totalRuns = matchData?.liveData[battingTeam]?.runs + 4;
  } else if (ballAction === 'CATCH') {
    ball.wickets = matchData?.liveData[battingTeam]?.wickets + (!matchData.liveData[battingTeam].freeHit ? 1 : 0);
  }

  return ball;
};

export { prepareBallData };
