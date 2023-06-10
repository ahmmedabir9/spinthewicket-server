const firebase = require("firebase-admin");
const { UpdateQuickMatch } = require("../../../services/firebase");
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const endOfOver = require("../end/endOfOver");
const runChased = require("../end/runChased");

const threeRuns = async (matchData, ballData, inning) => {
  let striker = matchData?.now?.batsman?.striker;
  let nonStriker = matchData?.now?.batsman?.nonStriker;

  try {
    striker.runs += 3;
    striker.balls += 1;
    striker.strikeRate =
      ((matchData.now.batsman.striker.runs + 3) / (matchData.now.batsman.striker.balls + 1)) * 100;

    let dataToUpdate = {
      "now.batsman.striker": nonStriker,
      "now.batsman.nonStriker": striker,
      // 'now.batsman.striker.runs': firebase.firestore.FieldValue.increment(1),
      "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      // 'now.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
      // 'now.batsman.striker.strikeRate':
      //   ((matchData.now.batsman.striker.runs + 1) /
      //     (matchData.now.batsman.striker.balls + 1)) *
      //   100,
      "now.bowler.economy":
        (matchData.now.bowler.runs + 1) /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) / 6),
      "now.partnership": {
        runs: matchData.now.partnership.runs + 1,
        balls: matchData.now.partnership.balls + 1,
        batsman1: matchData.now.batsman.striker.id,
        batsman2: matchData.now.batsman.nonStriker.id,
      },
      "now.bowler.runs": firebase.firestore.FieldValue.increment(3),
      "now.bowler.balls": firebase.firestore.FieldValue.increment(1),
      "now.runs": firebase.firestore.FieldValue.increment(3),
      "now.balls": firebase.firestore.FieldValue.increment(1),
      "now.freeHit": false,
      "now.runRate":
        (matchData.now.runs + 3) / ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(3),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.now.runs + 3) / ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    };

    if (matchData.now.inning === 2 || matchData.now.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        "now.need": matchData.now.need - 3,
        "now.from": matchData.now.from - 1,
        "now.reqRR": (matchData.now.need - 3) / ((matchData.now.from - 1) / 6),
      };
    }

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate);

    // await docRef.update()

    if (updateMatch.now.balls === 6) {
      await endOfOver(updateMatch, inning);
    }

    if (updateMatch.now.need <= 0) {
      await runChased(updateMatch, inning);
    }

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

module.exports = threeRuns;
