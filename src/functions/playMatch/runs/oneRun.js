const firebase = require('firebase-admin');
const { UpdateQuickMatch } = require('../../../services/firebase');
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const endOfOver = require('../end/endOfOver');
const runChased = require('../end/runChased');

const oneRun = async (matchData, ballData, inning) => {
  let striker = matchData?.liveData?.batsman?.striker;
  let nonStriker = matchData?.liveData?.batsman?.nonStriker;

  try {
    striker.runs += 1;
    striker.balls += 1;
    striker.strikeRate =
      ((matchData.liveData.batsman.striker.runs + 1) /
        (matchData.liveData.batsman.striker.balls + 1)) *
      100;

    let dataToUpdate = {
      'liveData.batsman.striker': nonStriker,
      'liveData.batsman.nonStriker': striker,
      // 'liveData.batsman.striker.runs': firebase.firestore.FieldValue.increment(1),
      'liveData.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      // 'liveData.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
      // 'liveData.batsman.striker.strikeRate':
      //   ((matchData.liveData.batsman.striker.runs + 1) /
      //     (matchData.liveData.batsman.striker.balls + 1)) *
      //   100,
      'liveData.bowler.economy':
        (matchData.liveData.bowler.runs + 1) /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + 1)) / 6),
      'liveData.partnership': {
        runs: matchData.liveData.partnership.runs + 1,
        balls: matchData.liveData.partnership.balls + 1,
        batsman1: matchData.liveData.batsman.striker?.id,
        batsman2: matchData.liveData.batsman.nonStriker?.id,
      },
      'liveData.bowler.runs': firebase.firestore.FieldValue.increment(1),
      'liveData.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.runs': firebase.firestore.FieldValue.increment(1),
      'liveData.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.freeHit': false,
      'liveData.runRate':
        (matchData.liveData.runs + 1) /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.liveData.runs + 1) /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
    };

    if (matchData.liveData.inning === 2 || matchData.liveData.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        'liveData.need': matchData.liveData.need - 1,
        'liveData.from': matchData.liveData.from - 1,
        'liveData.reqRR': (matchData.liveData.need - 1) / ((matchData.liveData.from - 1) / 6),
      };
    }

    // console.log('====================================')
    // console.log(dataToUpdate)
    // console.log(matchData.id)
    // console.log('====================================')

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate);

    // await docRef.update()

    if (updateMatch.liveData.balls === 6) {
      await endOfOver(updateMatch, inning);
    }

    if (updateMatch.liveData.need <= 0) {
      await runChased(updateMatch, inning);
    }

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

module.exports = oneRun;
