const firebase = require("firebase-admin");
const runChased = require("../end/runChased");

const wideBall =async (matchData, docRef, inning) => {
  const ball = {
    wickets: matchData.now.wickets,
    totalRuns: matchData.now.runs + 1,
    run: 1,
    bowler: matchData.now.bowler.name,
    batsman: matchData.now.batsman.striker.name,
    status: "wide",
    ballNO: matchData.now.balls,
    overNO: matchData.now.overs,
  };

 await docRef
    .update({
      "now.bowler.runs": firebase.firestore.FieldValue.increment(1),
      "now.runs": firebase.firestore.FieldValue.increment(1),
      "now.extra": firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.extra`]: firebase.firestore.FieldValue.increment(1),
      "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
        ball: ball.ballNO,
        status: ball.status,
        run: ball.run,
      }),

      "now.runRate":
        (matchData.now.runs + 1) /
        ((matchData.now.overs * 6 + matchData.now.balls) / 6),
      "now.bowler.economy":
        (matchData.now.bowler.runs + 1) /
        ((matchData.now.bowler.overs * 6 + matchData.now.bowler.balls) / 6),
      "now.partnership": {
        runs: matchData.now.partnership.runs + 1,
        balls: matchData.now.partnership.balls,
        batsman1: matchData.now.batsman.striker.name,
        batsman2: matchData.now.batsman.nonStriker.name,
      },
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ball
      ),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.now.runs + 1) /
        ((matchData.now.overs * 6 + matchData.now.balls) / 6),
    })
    .then(() => {
      if (matchData.now.inning === 2 || matchData.now.inning === 4) {
        docRef
          .update({
            "now.need": matchData.now.need - 1,
            "now.reqRR": (matchData.now.need - 1) / (matchData.now.from / 6),
          })
          .then(() => {
            if (matchData.now.need <= 1) {
              runChased(matchData, docRef, inning);
            }
          });
      }
    });
};

module.exports = wideBall;
