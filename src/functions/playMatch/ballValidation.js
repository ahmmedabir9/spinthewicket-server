const ballValidation = (matchData) => {
  if (matchData.now) {
    if (
      matchData.now.batsman.striker &&
      matchData.now.batsman.nonStriker &&
      matchData.now.bowler &&
      matchData.now.balls !== 6 &&
      !matchData.now.spinning
    ) {
      if (matchData.now.inning === 1) {
        if (
          matchData.now.balls !== 0 &&
          matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
            .status === "run" &&
          (matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1].run ===
            1 ||
            matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
            .batsman === matchData.now.batsman.striker.name
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.now.inning === 2) {
        if (
          matchData.now.balls !== 0 &&
          matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .status === "run" &&
          (matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .run === 1 ||
            matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .batsman === matchData.now.batsman.striker.name
        ) {
          return false;
        } else if (
          matchData.now.need + matchData.now.runs !== matchData.now.target ||
          matchData.overs * 6 - (matchData.now.overs * 6 + matchData.now.balls) !==
            matchData.now.from
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.now.inning === 3) {
        if (
          matchData.now.balls !== 0 &&
          matchData.innings.super_1.ballByBall[matchData.innings.super_1.ballByBall.length - 1]
            .status === "run" &&
          (matchData.innings.super_1.ballByBall[matchData.innings.super_1.ballByBall.length - 1]
            .run === 1 ||
            matchData.innings.super_1.ballByBall[matchData.innings.super_1.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.super_1.ballByBall[matchData.innings.super_1.ballByBall.length - 1]
            .batsman === matchData.now.batsman.striker.name
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.now.inning === 4) {
        if (
          matchData.now.balls !== 0 &&
          matchData.innings.super_2.ballByBall[matchData.innings.super_2.ballByBall.length - 1]
            .status === "run" &&
          (matchData.innings.super_2.ballByBall[matchData.innings.super_2.ballByBall.length - 1]
            .run === 1 ||
            matchData.innings.super_2.ballByBall[matchData.innings.super_2.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.super_2.ballByBall[matchData.innings.super_2.ballByBall.length - 1]
            .batsman === matchData.now.batsman.striker.name
        ) {
          return false;
        } else if (matchData.now.need + matchData.now.runs !== matchData.now.target) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }
};

module.exports = { ballValidation };
