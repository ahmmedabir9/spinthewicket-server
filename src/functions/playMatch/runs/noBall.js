const firebase = require('firebase-admin')
const { UpdateQuickMatch } = require('../../../services/firebase')
const runChased = require('../end/runChased')

const noBall = async (matchData, ballData, inning) => {
  try {
    let dataToUpdate = {
      'now.bowler.runs': firebase.firestore.FieldValue.increment(1),
      'now.runs': firebase.firestore.FieldValue.increment(1),
      'now.partnership': {
        runs: matchData.now.partnership.runs + 1,
        balls: matchData.now.partnership.balls,
        batsman1: matchData.now.batsman.striker.name,
        batsman2: matchData.now.batsman.nonStriker.name,
      },
      'now.freeHit': true,
      'now.runRate':
        (matchData.now.runs + 1) /
        ((matchData.now.overs * 6 + matchData.now.balls) / 6),
      'now.bowler.economy':
        (matchData.now.bowler.runs + 1) /
        ((matchData.now.bowler.overs * 6 + matchData.now.bowler.balls) / 6),
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(1),
      'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),
      [`innings.${inning}.runRate`]:
        (matchData.now.runs + 1) /
        ((matchData.now.overs * 6 + matchData.now.balls) / 6),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ballData,
      ),
      'now.extra': firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.extra`]: firebase.firestore.FieldValue.increment(1),
    }

    if (matchData.now.inning === 2 || matchData.now.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        'now.need': matchData.now.need - 1,
        'now.reqRR': (matchData.now.need - 1) / (matchData.now.from / 6),
      }
    }

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate)

    if (updateMatch.now.need <= 0) {
      await runChased(updateMatch, inning)
    }

    return 'OK'
  } catch (error) {
    return error
  }
}

module.exports = noBall
