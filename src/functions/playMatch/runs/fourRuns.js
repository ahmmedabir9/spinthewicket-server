const firebase = require("firebase-admin");
const endOfOver = require("../end/endOfOver");
const runChased = require("../end/runChased");

const fourRuns = async (matchData, docRef, inning) => {
  const ball = {
    wickets: matchData.now.wickets,
    totalRuns: matchData.now.runs + 4,
    run: 4,
    bowler: matchData.now.bowler.name,
    batsman: matchData.now.batsman.striker.name,
    status: "four",
    ballNO: matchData.now.balls + 1,
    overNO: matchData.now.overs,
  };

  await docRef
    .update({
      "now.batsman.striker.runs": firebase.firestore.FieldValue.increment(4),
      "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
        ball: ball.ballNO,
        status: ball.status,
        run: ball.run,
      }),

      "now.batsman.striker.balls": firebase.firestore.FieldValue.increment(1),
      "now.batsman.striker.fours": firebase.firestore.FieldValue.increment(1),
      "now.partnership": {
        runs: matchData.now.partnership.runs + 4,
        balls: matchData.now.partnership.balls + 1,
        batsman1: matchData.now.batsman.striker.name,
        batsman2: matchData.now.batsman.nonStriker.name,
      },
      "now.batsman.striker.strikeRate":
        ((matchData.now.batsman.striker.runs + 4) /
          (matchData.now.batsman.striker.balls + 1)) *
        100,
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ball
      ),
      "now.bowler.runs": firebase.firestore.FieldValue.increment(4),
      "now.bowler.balls": firebase.firestore.FieldValue.increment(1),
      "now.balls": firebase.firestore.FieldValue.increment(1),
      "now.runs": firebase.firestore.FieldValue.increment(4),
      "now.freeHit": false,
      "now.runRate":
        (matchData.now.runs + 4) /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(4),
      "now.bowler.economy":
        (matchData.now.bowler.runs + 4) /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
          6),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.now.runs + 4) /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    })
    .then(() => {
      if (matchData.now.inning === 2 || matchData.now.inning === 4) {
         docRef
          .update({
            "now.need": matchData.now.need - 4,
            "now.from": matchData.now.from - 1,
            "now.reqRR":
              (matchData.now.need - 4) / ((matchData.now.from - 1) / 6),
          })
          .then(() => {
            if (matchData.now.need <= 4) {
              runChased(matchData, docRef, inning);
            }
          });
      }
      if (matchData.now.balls >= 5) {
        endOfOver(matchData, docRef, inning);
      }
    });
};

module.exports = fourRuns;
