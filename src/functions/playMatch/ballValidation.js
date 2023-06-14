const ballValidation = (matchData) => {
  if (matchData.liveData) {
    if (
      matchData.liveData.batsman.striker &&
      matchData.liveData.batsman.nonStriker &&
      matchData.liveData.bowler &&
      matchData.liveData.balls !== 6 &&
      !matchData.liveData.spinning
    ) {
      if (matchData.liveData.inning === 1) {
        if (
          matchData.liveData.balls !== 0 &&
          matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
            .status === 'run' &&
          (matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1].run ===
            1 ||
            matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.first.ballByBall[matchData.innings.first.ballByBall.length - 1]
            .batsman === matchData.liveData.batsman.striker.name
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.liveData.inning === 2) {
        if (
          matchData.liveData.balls !== 0 &&
          matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .status === 'run' &&
          (matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .run === 1 ||
            matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
              .run === 3) &&
          matchData.innings.second.ballByBall[matchData.innings.second.ballByBall.length - 1]
            .batsman === matchData.liveData.batsman.striker.name
        ) {
          return false;
        } else if (
          matchData.liveData.need + matchData.liveData.runs !== matchData.liveData.target ||
          matchData.overs * 6 - (matchData.liveData.overs * 6 + matchData.liveData.balls) !==
            matchData.liveData.from
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.liveData.inning === 3) {
        if (
          matchData.liveData.balls !== 0 &&
          matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].status === 'run' &&
          (matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].run === 1 ||
            matchData.innings.firstSuper.ballByBall[
              matchData.innings.firstSuper.ballByBall.length - 1
            ].run === 3) &&
          matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].batsman === matchData.liveData.batsman.striker.name
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.liveData.inning === 4) {
        if (
          matchData.liveData.balls !== 0 &&
          matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].status === 'run' &&
          (matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].run === 1 ||
            matchData.innings.secondSuper.ballByBall[
              matchData.innings.secondSuper.ballByBall.length - 1
            ].run === 3) &&
          matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].batsman === matchData.liveData.batsman.striker.name
        ) {
          return false;
        } else if (
          matchData.liveData.need + matchData.liveData.runs !==
          matchData.liveData.target
        ) {
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
