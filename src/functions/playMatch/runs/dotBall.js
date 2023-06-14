const firebase = require('firebase-admin');
const { UpdateQuickMatch } = require('../../../services/firebase');
const endOfOver = require('../end/endOfOver');
// const endOfOver = require('../end/endOfOver')

const dotBall = async (matchData, ballData, inning) => {
  try {
    let dataToUpdate = {
      'liveData.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.batsman.striker.strikeRate':
        (matchData.liveData.batsman.striker.runs / (matchData.liveData.batsman.striker.balls + 1)) *
        100,
      'liveData.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.bowler.economy':
        matchData.liveData.bowler.runs /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + 1)) / 6),
      'liveData.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.runs': firebase.firestore.FieldValue.increment(0),
      'liveData.runRate':
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
      'liveData.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      'liveData.partnership': {
        runs: matchData.liveData.partnership.runs,
        balls: matchData.liveData.partnership.balls + 1,
        batsman1: matchData.liveData.batsman.striker.id,
        batsman2: matchData.liveData.batsman.nonStriker.id,
      },
      'liveData.freeHit': false,
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(0),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      [`innings.${inning}.runRate`]:
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
    };

    if (matchData.liveData.inning === 2 || matchData.liveData.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        'liveData.from': matchData.liveData.from - 1,
        'liveData.reqRR': matchData.liveData.need / ((matchData.liveData.from - 1) / 6),
      };
    }

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate);

    // await docRef.update()

    if (updateMatch.liveData.balls === 6) {
      await endOfOver(updateMatch, inning);
    }

    return 'OK';
  } catch (error) {
    return error;
  }
};

module.exports = dotBall;
