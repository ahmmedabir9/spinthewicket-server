const firebase = require('firebase-admin')
const allOut = require('../end/allOut')
const endOfOver = require('../end/endOfOver')

const catchOut = async (matchData, ballData, inning) => {
  const index = Math.floor(Math.random() * 100) % 11
  let fielder
  if (matchData.now.inning === 1) {
    if (
      matchData.innings.first.bowlingTeam.id === matchData.squad.teamA.teamID
    ) {
      fielder = matchData.squad.teamA.playingXI[index].name
    } else {
      fielder = matchData.squad.teamB.playingXI[index].name
    }
  } else {
    if (
      matchData.innings.second.bowlingTeam.id === matchData.squad.teamA.teamID
    ) {
      fielder = matchData.squad.teamA.playingXI[index].name
    } else {
      fielder = matchData.squad.teamB.playingXI[index].name
    }
  }

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

  let dataToUpdate = {
    'now.batsman.striker': null,
    'now.bowler.wickets': firebase.firestore.FieldValue.increment(1),
    'now.bowler.balls': firebase.firestore.FieldValue.increment(1),
    'now.balls': firebase.firestore.FieldValue.increment(1),
    'now.wickets': firebase.firestore.FieldValue.increment(1),
    [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
      ballData,
    ),
    'now.thisOver': firebase.firestore.FieldValue.arrayUnion({
      ball: ballData.ballNO,
      status: ballData.status,
      run: ballData.run,
    }),

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
    'now.bowler.economy':
      matchData.now.bowler.runs /
      ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) / 6),
    'now.freeHit': false,
    [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
      batsman,
    ),
    [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
    [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(1),
    'now.runRate':
      matchData.now.runs /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
    [`innings.${inning}.runRate`]:
      matchData.now.runs /
      ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
  }

  if (matchData.now.inning === 2 || matchData.now.inning === 4) {
    dataToUpdate = {
      'now.from': matchData.now.from - 1,
      'now.reqRR': matchData.now.need / ((matchData.now.from - 1) / 6),
    }
  }

  const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate)

  if (updateMatch.now.wickets === 10) {
    await allOut(updateMatch, inning)
  } else if (updateMatch.superOver && updateMatch.now.wickets === 1) {
    await allOut(updateMatch, inning)
  }

  if (updateMatch.now.balls === 6) {
    await endOfOver(updateMatch, inning)
  }
}
module.exports = catchOut
