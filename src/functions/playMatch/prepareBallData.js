const prepareBallData = (matchData, ballAction) => {
  let ball = {
    bowler: matchData.now.bowler?.id,
    batsman: matchData.now.batsman.striker?.id,
    status: ballAction,
    overNO: matchData.now.overs,
    wickets: matchData.now.wickets,
    totalRuns: matchData.now.runs,
    run: 0,
    ballNO: matchData.now.balls + 1,
  };

  if (ballAction === "ONE") {
    ball.run = 1;
    ball.totalRuns = matchData?.now?.runs + 1;
  } else if (ballAction === "BOWLED") {
    ball.wickets = matchData?.now?.wickets + (!matchData.now.freeHit ? 1 : 0);
  } else if (ballAction === "SIX") {
    ball.run = 6;
    ball.totalRuns = matchData?.now?.runs + 6;
  } else if (ballAction === "WIDE") {
    ball.run = 1;
    ball.totalRuns = matchData?.now?.runs + 1;
    ball.ballNO = matchData?.now?.balls;
  } else if (ballAction === "RUN_OUT") {
    ball.wickets = matchData?.now?.wickets + 1;
  } else if (ballAction === "TWO") {
    ball.run = 2;
    ball.totalRuns = matchData?.now?.runs + 2;
  } else if (ballAction === "THREE") {
    ball.run = 3;
    ball.totalRuns = matchData?.now?.runs + 3;
  } else if (ballAction === "LBW") {
    ball.wickets = matchData?.now?.wickets + (!matchData.now.freeHit ? 1 : 0);
  } else if (ballAction === "NO_BALL") {
    ball.run = 1;
    ball.totalRuns = matchData?.now?.runs + 1;
    ball.ballNO = matchData?.now?.balls;
  } else if (ballAction === "FOUR") {
    ball.run = 4;
    ball.totalRuns = matchData?.now?.runs + 4;
  } else if (ballAction === "CATCH") {
    ball.wickets = matchData?.now?.wickets + (!matchData.now.freeHit ? 1 : 0);
  }

  return ball;
};

module.exports = prepareBallData;
