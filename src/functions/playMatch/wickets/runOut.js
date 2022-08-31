const firebase = require('firebase-admin')
const { UpdateQuickMatch } = require('../../../services/firebase')
const allOut = require('../end/allOut')
const endOfOver = require('../end/endOfOver')

const runOut = async (matchData, ballData, inning) => {
  const index = Math.floor(Math.random() * 100) % 11
  let fielder = matchData.playingXI[matchData.now.bowlingTeam][index]

  const batsman = {
    balls: matchData.now.batsman.striker.balls + 1,
    fours: matchData.now.batsman.striker.fours,
    id: matchData.now.batsman.striker.id,
    inAt: matchData.now.batsman.striker.inAt,
    runs: matchData.now.batsman.striker.runs,
    sixes: matchData.now.batsman.striker.sixes,
    strikeRate:
      (matchData.now.batsman.striker.runs /
        (matchData.now.batsman.striker.balls + 1)) *
      100,
    status: 'out',
    out: {
      type: 'catch',
      bowler: matchData.now.bowler.id,
      fielder: fielder,
    },
  }

  let dataToUpdate = {}

  const outBatsman = Math.floor(Math.random() * 100) % 2

  if (outBatsman === 0) {
    const batsman = {
      balls: matchData.now.batsman.striker.balls + 1,
      fours: matchData.now.batsman.striker.fours,
      id: matchData.now.batsman.striker.id,
      inAt: matchData.now.batsman.striker.inAt,
      runs: matchData.now.batsman.striker.runs,
      sixes: matchData.now.batsman.striker.sixes,
      strikeRate:
        (matchData.now.batsman.striker.runs /
          (matchData.now.batsman.striker.balls + 1)) *
        100,
      status: 'out',
      out: {
        type: 'run out',
        fielder: fielder,
      },
    }

    dataToUpdate = {
      'now.batsman.striker': null,
      'now.balls': firebase.firestore.FieldValue.increment(1),
      'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'now.wickets': firebase.firestore.FieldValue.increment(1),
      'now.freeHit': false,
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
        batsman,
      ),
      'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(1),
      'now.partnership': {
        runs: null,
        balls: null,
        batsman1: null,
        batsman2: null,
      },
      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion(
        {
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls + 1,
          batsman1: matchData.now.partnership.batsman1,
          batsman2: matchData.now.partnership.batsman2,
        },
      ),
      [`innings.${inning}.fallOfWickets`]: firebase.firestore.FieldValue.arrayUnion(
        {
          runs: matchData.now.runs,
          overs: matchData.now.overs,
          balls: matchData.now.balls,
          player: matchData.now.batsman.striker.name,
        },
      ),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ballData,
      ),
      'now.bowler.economy':
        matchData.now.bowler.runs /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
          6),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      'now.runRate':
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      [`innings.${inning}.runRate`]:
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    }
  } else {
    const batsman = {
      balls: matchData.now.batsman.nonStriker.balls + 1,
      fours: matchData.now.batsman.nonStriker.fours,
      id: matchData.now.batsman.nonStriker.id,
      inAt: matchData.now.batsman.nonStriker.inAt,
      runs: matchData.now.batsman.nonStriker.runs,
      sixes: matchData.now.batsman.nonStriker.sixes,
      strikeRate:
        (matchData.now.batsman.nonStriker.runs /
          (matchData.now.batsman.nonStriker.balls + 1)) *
        100,
      status: 'out',
      out: {
        type: 'run out',
        fielder: fielder,
      },
    }

    dataToUpdate = {
      'now.batsman.nonStriker': null,
      'now.balls': firebase.firestore.FieldValue.increment(1),
      'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'now.wickets': firebase.firestore.FieldValue.increment(1),
      'now.freeHit': false,
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
        batsman,
      ),
      'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(1),
      'now.partnership': {
        runs: null,
        balls: null,
        batsman1: null,
        batsman2: null,
      },
      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion(
        {
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls + 1,
          batsman1: matchData.now.partnership.batsman1,
          batsman2: matchData.now.partnership.batsman2,
        },
      ),
      [`innings.${inning}.fallOfWickets`]: firebase.firestore.FieldValue.arrayUnion(
        {
          runs: matchData.now.runs,
          overs: matchData.now.overs,
          balls: matchData.now.balls,
          player: matchData.now.batsman.nonStriker.name,
        },
      ),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
        ballData,
      ),
      'now.bowler.economy':
        matchData.now.bowler.runs /
        ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
          6),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      'now.runRate':
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      [`innings.${inning}.runRate`]:
        matchData.now.runs /
        ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    }
  }

  if (matchData.now.inning === 2 || matchData.now.inning === 4) {
    dataToUpdate = {
      ...dataToUpdate,
      'now.from': matchData.now.from - 1,
      'now.reqRR': matchData.now.need / ((matchData.now.from - 1) / 6),
    }
  }

  const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate)

  if (
    updateMatch.now.wickets === 10 ||
    (updateMatch.superOver && updateMatch.now.wickets === 1)
  ) {
    await allOut(updateMatch, inning)
  }

  if (updateMatch.now.balls === 6) {
    await endOfOver(updateMatch, inning)
  }
}
module.exports = runOut
