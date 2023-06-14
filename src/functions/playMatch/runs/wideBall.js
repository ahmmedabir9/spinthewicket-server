const firebase = require('firebase-admin');
const { UpdateQuickMatch } = require('../../../services/firebase');
const runChased = require('../end/runChased');

const wideBall = async (matchData, ballData, inning) => {
  try {
    let dataToUpdate = {
      'liveData.bowler.runs': firebase.firestore.FieldValue.increment(1),
      'liveData.runs': firebase.firestore.FieldValue.increment(1),
      'liveData.extra': firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.extra`]: firebase.firestore.FieldValue.increment(1),
      'liveData.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      'liveData.runRate':
        (matchData.liveData.runs + 1) /
        ((matchData.liveData.overs * 6 + matchData.liveData.balls) / 6),
      'liveData.bowler.economy':
        (matchData.liveData.bowler.runs + 1) /
        ((matchData.liveData.bowler.overs * 6 + matchData.liveData.bowler.balls) / 6),
      'liveData.partnership': {
        runs: matchData.liveData.partnership.runs + 1,
        balls: matchData.liveData.partnership.balls,
        batsman1: matchData.liveData.batsman.striker.id,
        batsman2: matchData.liveData.batsman.nonStriker.id,
      },
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.runRate`]:
        (matchData.liveData.runs + 1) /
        ((matchData.liveData.overs * 6 + matchData.liveData.balls) / 6),
    };

    if (matchData.liveData.inning === 2 || matchData.liveData.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        'liveData.need': matchData.liveData.need - 1,
        'liveData.reqRR': (matchData.liveData.need - 1) / (matchData.liveData.from / 6),
      };
    }

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate);

    if (updateMatch.liveData.need <= 0) {
      await runChased(updateMatch, inning);
    }

    return 'OK';
  } catch (error) {
    return error;
  }
};

module.exports = wideBall;
