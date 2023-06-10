import { _IMatch_ } from "../models/_ModelTypes_";

const ballValidation = (matchData: _IMatch_) => {
  if (matchData.now) {
    if (
      matchData.now.batsman.striker &&
      matchData.now.batsman.nonStriker &&
      matchData.now.bowler &&
      matchData.now.balls !== 6
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
          (matchData.now.inning % 2 === 0 &&
            matchData.now.need + matchData.now.runs !== matchData.now.target) ||
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
          matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].status === "run" &&
          (matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].run === 1 ||
            matchData.innings.firstSuper.ballByBall[
              matchData.innings.firstSuper.ballByBall.length - 1
            ].run === 3) &&
          matchData.innings.firstSuper.ballByBall[
            matchData.innings.firstSuper.ballByBall.length - 1
          ].batsman === matchData.now.batsman.striker.name
        ) {
          return false;
        } else {
          return true;
        }
      } else if (matchData.now.inning === 4) {
        if (
          matchData.now.balls !== 0 &&
          matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].status === "run" &&
          (matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].run === 1 ||
            matchData.innings.secondSuper.ballByBall[
              matchData.innings.secondSuper.ballByBall.length - 1
            ].run === 3) &&
          matchData.innings.secondSuper.ballByBall[
            matchData.innings.secondSuper.ballByBall.length - 1
          ].batsman === matchData.now.batsman.striker.name
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

module.exports = ballValidation;