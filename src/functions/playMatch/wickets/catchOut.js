const firebase = require("firebase-admin");
const allOut = require("../end/allOut");
const endOfOver = require("../end/endOfOver");

const catchOut = async (matchData, docRef, inning) => {
  if (!matchData.now.freeHit || matchData.now.freeHit !== true) {
    const ball = {
      wickets: matchData.now.wickets + 1,
      totalRuns: matchData.now.runs,
      run: 0,
      bowler: matchData.now.bowler.name,
      batsman: matchData.now.batsman.striker.name,
      status: "catch",
      ballNO: matchData.now.balls + 1,
      overNO: matchData.now.overs,
    };
    const index = Math.floor(Math.random() * 100) % 11;
    var fielder;
    if (matchData.now.inning === 1) {
      if (
        matchData.innings.first.bowlingTeam.id === matchData.squad.teamA.teamID
      ) {
        fielder = matchData.squad.teamA.playingXI[index].name;
      } else {
        fielder = matchData.squad.teamB.playingXI[index].name;
      }
    } else {
      if (
        matchData.innings.second.bowlingTeam.id === matchData.squad.teamA.teamID
      ) {
        fielder = matchData.squad.teamA.playingXI[index].name;
      } else {
        fielder = matchData.squad.teamB.playingXI[index].name;
      }
    }

    const batsman = {
      balls: matchData.now.batsman.striker.balls + 1,
      fours: matchData.now.batsman.striker.fours,
      id: matchData.now.batsman.striker.id,
      inAt: matchData.now.batsman.striker.inAt,
      name: matchData.now.batsman.striker.name,
      photoURL: matchData.now.batsman.striker.photoURL,
      runs: matchData.now.batsman.striker.runs,
      sixes: matchData.now.batsman.striker.sixes,
      strikeRate:
        (matchData.now.batsman.striker.runs /
          (matchData.now.batsman.striker.balls + 1)) *
        100,
      status: "out",
      out: {
        type: "catch",
        bowler: matchData.now.bowler.name,
        fielder: fielder,
      },
    };
   await docRef
      .update({
        "now.batsman.striker": null,
        "now.bowler.wickets": firebase.firestore.FieldValue.increment(1),
        "now.bowler.balls": firebase.firestore.FieldValue.increment(1),
        "now.balls": firebase.firestore.FieldValue.increment(1),
        "now.wickets": firebase.firestore.FieldValue.increment(1),
        [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
          ball
        ),
        "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
          ball: ball.ballNO,
          status: ball.status,
          run: ball.run,
        }),

        "now.partnership": {
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
          }
        ),
        [`innings.${inning}.fallOfWickets`]: firebase.firestore.FieldValue.arrayUnion(
          {
            runs: matchData.now.runs,
            overs: matchData.now.overs,
            balls: matchData.now.balls,
            player: matchData.now.batsman.striker.name,
          }
        ),
        "now.bowler.economy":
          matchData.now.bowler.runs /
          ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
            6),
        "now.freeHit": false,
        [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
          batsman
        ),
        [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
        [`innings.${inning}.wickets`]: firebase.firestore.FieldValue.increment(
          1
        ),
        "now.runRate":
          matchData.now.runs /
          ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
        [`innings.${inning}.runRate`]:
          matchData.now.runs /
          ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      })
      .then(() => {
        if (matchData.now.wickets >= 9) {
          allOut(matchData, docRef, inning);
        } else if (matchData.superOver && matchData.now.wickets >= 1) {
          allOut(matchData, docRef, inning);
        } else {
          if (matchData.now.inning === 2) {
            docRef.update({
              "now.from": matchData.now.from - 1,
              "now.reqRR": matchData.now.need / ((matchData.now.from - 1) / 6),
            });
          }
          if (matchData.now.balls >= 5) {
            endOfOver(matchData, docRef, inning);
          }
        }
      });
  } else if (matchData.now.freeHit === true) {
    const ball = {
      wickets: matchData.now.wickets,
      totalRuns: matchData.now.runs,
      run: 0,
      bowler: matchData.now.bowler.name,
      batsman: matchData.now.batsman.striker.name,
      status: "dot",
      ballNO: matchData.now.balls + 1,
      overNO: matchData.now.overs,
    };

    docRef
      .update({
        "now.batsman.striker.balls": firebase.firestore.FieldValue.increment(1),
        "now.batsman.striker.strikeRate":
          (matchData.now.batsman.striker.runs /
            (matchData.now.batsman.striker.balls + 1)) *
          100,
        "now.bowler.balls": firebase.firestore.FieldValue.increment(1),
        "now.bowler.economy":
          matchData.now.bowler.runs /
          ((matchData.now.bowler.overs * 6 + (matchData.now.bowler.balls + 1)) /
            6),
        "now.balls": firebase.firestore.FieldValue.increment(1),
        "now.runs": firebase.firestore.FieldValue.increment(0),
        "now.thisOver": firebase.firestore.FieldValue.arrayUnion({
          ball: ball.ballNO,
          status: ball.status,
          run: ball.run,
        }),

        "now.runRate":
          matchData.now.runs /
          ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
        "now.partnership": {
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls + 1,
          batsman1: matchData.now.batsman.striker.name,
          batsman2: matchData.now.batsman.nonStriker.name,
        },
        "now.freeHit": false,
        [`innings.${inning}.runs`]: firebase.firestore.FieldValue.increment(0),
        [`innings.${inning}.balls`]: firebase.firestore.FieldValue.increment(1),
        [`innings.${inning}.ballByBall`]: firebase.firestore.FieldValue.arrayUnion(
          ball
        ),
        [`innings.${inning}.runRate`]:
          matchData.now.runs /
          ((matchData.now.overs * 6 + (matchData.now.balls + 1)) / 6),
      })
      .then(() => {
        if (matchData.now.inning === 2) {
          docRef.update({
            "now.from": matchData.now.from - 1,
            "now.reqRR": matchData.now.need / ((matchData.now.from - 1) / 6),
          });
        }
        if (matchData.now.balls >= 5) {
          endOfOver(matchData, docRef, inning);
        }
      });
  }
};
module.exports = catchOut;
