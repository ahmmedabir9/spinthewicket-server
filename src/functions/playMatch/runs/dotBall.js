const firebase = require('firebase-admin')
const { UpdateQuickMatch } = require('../../../services/firebase')
const endOfOver = require('../end/endOfOver')
// const endOfOver = require('../end/endOfOver')

const dotBall = async (matchData, ballData, inning) => {
  // const ball = {
  //   wickets: matchData.now.wickets,
  //   totalRuns: matchData.now.runs,
  //   run: 0,
  //   bowler: matchData.now.bowler.name,
  //   batsman: matchData.now.batsman.striker.name,
  //   status: "dot",
  //   ballNO: matchData.now.balls + 1,
  //   overNO: matchData.now.overs,
  // };

  try {
    let dataToUpdate = {
      'now.batsman.striker.balls': firebase.firestore.FieldValue.increment(1),
      'now.batsman.striker.strikeRate':
        (matchData.now.batsman.striker.runs /
          (matchData.now.batsman.striker.balls + 1)) *
        100,
      'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'now.bowler.economy':
        matchData.now.bowler.runs /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
          6),
      'now.balls': firebase.firestore.FieldValue.increment(1),
      'now.runs': firebase.firestore.FieldValue.increment(0),
      'now.runRate':
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      'now.partnership': {
        runs: matchData.now.partnership.runs,
        balls: matchData.now.partnership.balls + 1,
        batsman1: matchData.now.batsman.striker.id,
        batsman2: matchData.now.batsman.nonStriker.id,
      },
      'now.freeHit': false,
      [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(0),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ballData,
      ),
      [`innings.${inning}.runRate`]:
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    }

    if (matchData.now.inning === 2 || matchData.now.inning === 4) {
      dataToUpdate = {
        ...dataToUpdate,
        'now.from': matchData.now.from - 1,
        'now.reqRR': matchData.now.need / ((matchData.now.from - 1) / 6),
      }
    }

    const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate)

    // await docRef.update()

    if (updateMatch.now.balls === 6) {
      await endOfOver(updateMatch, inning)
    }

    return 'OK'
  } catch (error) {
    return error
  }
}

module.exports = dotBall
