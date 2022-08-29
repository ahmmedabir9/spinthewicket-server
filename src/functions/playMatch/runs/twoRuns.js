const firebase = require('firebase-admin')
const { UpdateQuickMatch } = require('../../../services/firebase')
const endOfOver = require('../end/endOfOver')
const runChased = require('../end/runChased')

const twoRuns = async (matchData, ballData, inning) => {
  let dataToUpdate = {
    'now.batsman.striker.runs': firebase.firestore.FieldValue.increment(2),
    'now.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
    'now.batsman.striker.strikeRate':
      ((matchData.now.batsman.striker.runs + 2) /
        (matchData.now.batsman.striker.balls + 1)) *
      100,
    [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
      ballData,
    ),
    'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
      ball: ball.ballNO,
      status: ball.status,
      run: ball.run,
    }),

    'now.partnership': {
      runs: matchData.now.partnership.runs + 2,
      balls: matchData.now.partnership.balls + 1,
      batsman1: matchData.now.batsman.striker.name,
      batsman2: matchData.now.batsman.nonStriker.name,
    },
    'now.bowler.runs': firebase.firestore.FieldValue.increment(2),
    'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
    'now.bowler.economy':
      (matchData.now.bowler.runs + 2) /
      ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) / 6),
    'now.balls': firebase.firestore.FieldValue.increment(1),
    'now.runs': firebase.firestore.FieldValue.increment(2),
    'now.freeHit': false,
    'now.runRate':
      (matchData.now.runs + 2) /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(2),
    [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
    [`innings.${inning}.runRate`]:
      (matchData.now.runs + 2) /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
  }

  if (matchData.now.inning === 2 || matchData.now.inning === 4) {
    dataToUpdate = {
      'now.need': matchData.now.need - 2,
      'now.from': matchData.now.from - 1,
      'now.reqRR': (matchData.now.need - 2) / ((matchData.now.from - 1) / 6),
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

module.exports = twoRuns
