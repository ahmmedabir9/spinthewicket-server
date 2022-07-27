const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../../utils/collectIdsAndDocs");
const endOfOver = require("../end/endOfOver");
const runChased = require("../end/runChased");

const threeRuns = async (matchData, docRef, inning) => {
  const ball = {
    wickets: matchData.now.wickets,
    totalRuns: matchData.now.runs + 1,
    run: 3,
    bowler: matchData.now.bowler.name,
    batsman: matchData.now.batsman.striker.name,
    status: "run",
    ballNO: matchData.now.balls + 1,
    overNO: matchData.now.overs,
  };

 await docRef
    .update({
      "now.batsman.striker.runs": firebase.firestore.FieldValue.increment(3),
      "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
        ball: ball.ballNO,
        status: ball.status,
        run: ball.run,
      }),

      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ball
      ),
      "now.batsman.striker.balls": firebase.firestore.FieldValue.increment(1),
      "now.batsman.striker.strikeRate":
        ((matchData.now.batsman.striker.runs + 3) /
          (matchData.now.batsman.striker.balls + 1)) *
        100,
      "now.bowler.economy":
        (matchData.now.bowler.runs + 3) /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
          6),
      "now.partnership": {
        runs: matchData.now.partnership.runs + 3,
        balls: matchData.now.partnership.balls + 1,
        batsman1: matchData.now.batsman.striker.name,
        batsman2: matchData.now.batsman.nonStriker.name,
      },
      "now.bowler.runs": firebase.firestore.FieldValue.increment(3),
      "now.bowler.balls": firebase.firestore.FieldValue.increment(1),
      "now.runs": firebase.firestore.FieldValue.increment(3),
      "now.balls": firebase.firestore.FieldValue.increment(1),
      "now.freeHit": false,
      "now.runRate":
        (matchData.now.runs + 3) /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(3),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.now.runs + 3) /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    })
    .then(() => {
      docRef.get().then((doc) => {
        const newData = collectIdsAndDocs(doc);
        docRef
          .update({
            "now.batsman.striker": newData.now.batsman.nonStriker,
            "now.batsman.nonStriker": newData.now.batsman.striker,
          })
          .then(() => {
            if (newData.now.inning === 2 || newData.now.inning === 4) {
              docRef
                .update({
                  "now.need": newData.now.need - 3,
                  "now.from": newData.now.from - 1,
                  "now.reqRR":
                    (newData.now.need - 3) / ((newData.now.from - 1) / 6),
                })
                .then(() => {
                  if (newData.now.need <= 3) {
                    runChased(matchData, docRef, inning);
                  }
                });
            }
            if (matchData.now.balls >= 5) {
              endOfOver(matchData, docRef, inning);
            }
          });
      });
    });
};

module.exports = threeRuns;
