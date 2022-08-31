const firebase = require('firebase-admin')
const { UpdateQuickMatch } = require('../../../services/firebase')
const endOfOver = require('../end/endOfOver')
const runChased = require('../end/runChased')

const fourRuns = async (matchData, ballData, inning) => {
  let dataToUpdate = {
    'now.batsman.striker.runs': firebase.firestore.FieldValue.increment(4),
    'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
      ball: ballData.ballNO,
      status: ballData.status,
      run: ballData.run,
    }),

    'now.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
    'now.batsman.striker.fours': firebase.firestore.FieldValue.increment(1),
    'now.partnership': {
      runs: matchData.now.partnership.runs + 4,
      balls: matchData.now.partnership.balls + 1,
      batsman1: matchData.now.batsman.striker.name,
      batsman2: matchData.now.batsman.nonStriker.name,
    },
    'now.batsman.striker.strikeRate':
      ((matchData.now.batsman.striker.runs + 4) /
        (matchData.now.batsman.striker.balls + 1)) *
      100,
    [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
      ballData,
    ),
    'now.bowler.runs': firebase.firestore.FieldValue.increment(4),
    'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
    'now.balls': firebase.firestore.FieldValue.increment(1),
    'now.runs': firebase.firestore.FieldValue.increment(4),
    'now.freeHit': false,
    'now.runRate':
      (matchData.now.runs + 4) /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(4),
    'now.bowler.economy':
      (matchData.now.bowler.runs + 4) /
      ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) / 6),
    [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
    [`innings.${inning}.runRate`]:
      (matchData.now.runs + 4) /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
  }

  if (matchData.now.inning === 2 || matchData.now.inning === 4) {
    dataToUpdate = {
      ...dataToUpdate,
      'now.need': matchData.now.need - 4,
      'now.from': matchData.now.from - 1,
      'now.reqRR': (matchData.now.need - 4) / ((matchData.now.from - 1) / 6),
    }
  }

  const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate)

  if (updateMatch.now.balls === 6) {
    await endOfOver(updateMatch, inning)
  }

  if (updateMatch.now.need <= 0) {
    await runChased(updateMatch, inning)
  }
}

module.exports = fourRuns
