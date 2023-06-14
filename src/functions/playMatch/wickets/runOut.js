const firebase = require('firebase-admin');
const { UpdateQuickMatch } = require('../../../services/firebase');
const allOut = require('../end/allOut');
const endOfOver = require('../end/endOfOver');

const runOut = async (matchData, ballData, inning) => {
  const index = Math.floor(Math.random() * 100) % 11;
  let fielder = matchData.playingXI[matchData.liveData.bowlingTeam][index];

  const batsman = {
    balls: matchData.liveData.batsman.striker.balls + 1,
    fours: matchData.liveData.batsman.striker.fours,
    id: matchData.liveData.batsman.striker.id,
    inAt: matchData.liveData.batsman.striker.inAt,
    runs: matchData.liveData.batsman.striker.runs,
    sixes: matchData.liveData.batsman.striker.sixes,
    strikeRate:
      (matchData.liveData.batsman.striker.runs / (matchData.liveData.batsman.striker.balls + 1)) *
      100,
    status: 'out',
    out: {
      type: 'catch',
      bowler: matchData.liveData.bowler.id,
      fielder: fielder,
    },
  };

  let dataToUpdate = {};

  const outBatsman = Math.floor(Math.random() * 100) % 2;

  if (outBatsman === 0) {
    const batsman = {
      balls: matchData.liveData.batsman.striker.balls + 1,
      fours: matchData.liveData.batsman.striker.fours,
      id: matchData.liveData.batsman.striker.id,
      inAt: matchData.liveData.batsman.striker.inAt,
      runs: matchData.liveData.batsman.striker.runs,
      sixes: matchData.liveData.batsman.striker.sixes,
      strikeRate:
        (matchData.liveData.batsman.striker.runs / (matchData.liveData.batsman.striker.balls + 1)) *
        100,
      status: 'out',
      out: {
        type: 'run out',
        fielder: fielder,
      },
    };

    dataToUpdate = {
      'liveData.batsman.striker': null,
      'liveData.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.wickets': firebase.firestore.FieldValue.increment(1),
      'liveData.freeHit': false,
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(batsman),
      'liveData.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(1),
      'liveData.partnership': {
        runs: null,
        balls: null,
        batsman1: null,
        batsman2: null,
      },
      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
        runs: matchData.liveData.partnership.runs,
        balls: matchData.liveData.partnership.balls + 1,
        batsman1: matchData.liveData.partnership.batsman1,
        batsman2: matchData.liveData.partnership.batsman2,
      }),
      [`innings.${inning}.fallOfWickets`]: firebase.firestore.FieldValue.arrayUnion({
        runs: matchData.liveData.runs,
        overs: matchData.liveData.overs,
        balls: matchData.liveData.balls,
        player: matchData.liveData.batsman.striker.name,
      }),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      'liveData.bowler.economy':
        matchData.liveData.bowler.runs /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + 1)) / 6),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      'liveData.runRate':
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
      [`innings.${inning}.runRate`]:
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
    };
  } else {
    const batsman = {
      balls: matchData.liveData.batsman.nonStriker.balls + 1,
      fours: matchData.liveData.batsman.nonStriker.fours,
      id: matchData.liveData.batsman.nonStriker.id,
      inAt: matchData.liveData.batsman.nonStriker.inAt,
      runs: matchData.liveData.batsman.nonStriker.runs,
      sixes: matchData.liveData.batsman.nonStriker.sixes,
      strikeRate:
        (matchData.liveData.batsman.nonStriker.runs /
          (matchData.liveData.batsman.nonStriker.balls + 1)) *
        100,
      status: 'out',
      out: {
        type: 'run out',
        fielder: fielder,
      },
    };

    dataToUpdate = {
      'liveData.batsman.nonStriker': null,
      'liveData.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.bowler.balls': firebase.firestore.FieldValue.increment(1),
      'liveData.wickets': firebase.firestore.FieldValue.increment(1),
      'liveData.freeHit': false,
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(batsman),
      'liveData.thisOver': firebase.firestore.FieldValue.arrayUnion({
        ball: ballData.ballNO,
        status: ballData.status,
        run: ballData.run,
      }),

      [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(1),
      'liveData.partnership': {
        runs: null,
        balls: null,
        batsman1: null,
        batsman2: null,
      },
      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
        runs: matchData.liveData.partnership.runs,
        balls: matchData.liveData.partnership.balls + 1,
        batsman1: matchData.liveData.partnership.batsman1,
        batsman2: matchData.liveData.partnership.batsman2,
      }),
      [`innings.${inning}.fallOfWickets`]: firebase.firestore.FieldValue.arrayUnion({
        runs: matchData.liveData.runs,
        overs: matchData.liveData.overs,
        balls: matchData.liveData.balls,
        player: matchData.liveData.batsman.nonStriker.name,
      }),
      [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(ballData),
      'liveData.bowler.economy':
        matchData.liveData.bowler.runs /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + 1)) / 6),
      [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
      'liveData.runRate':
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
      [`innings.${inning}.runRate`]:
        matchData.liveData.runs /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + 1)) / 6),
    };
  }

  if (matchData.liveData.inning === 2 || matchData.liveData.inning === 4) {
    dataToUpdate = {
      ...dataToUpdate,
      'liveData.from': matchData.liveData.from - 1,
      'liveData.reqRR': matchData.liveData.need / ((matchData.liveData.from - 1) / 6),
    };
  }

  const updateMatch = await UpdateQuickMatch(matchData.id, dataToUpdate);

  if (
    updateMatch.liveData.wickets === 10 ||
    (updateMatch.superOver && updateMatch.liveData.wickets === 1)
  ) {
    await allOut(updateMatch, inning);
  }

  if (updateMatch.liveData.balls === 6) {
    await endOfOver(updateMatch, inning);
  }
};
module.exports = runOut;
