const firebase = require("firebase-admin");
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const endOfMatch = require("./endOfMatch");

const endOfInnings = async (matchData, docRef, inning) => {
  var batsman = [];
  if (matchData.now.batsman.striker) {
    const striker = {
      balls: matchData.now.batsman.striker.balls,
      fours: matchData.now.batsman.striker.fours,
      id: matchData.now.batsman.striker.id,
      inAt: matchData.now.batsman.striker.inAt,
      name: matchData.now.batsman.striker.name,
      photoURL: matchData.now.batsman.striker.photoURL,
      runs: matchData.now.batsman.striker.runs,
      sixes: matchData.now.batsman.striker.sixes,
      strikeRate: (matchData.now.batsman.striker.runs / matchData.now.batsman.striker.balls) * 100,
      status: "not out",
    };
    batsman = [...batsman, striker];
  }
  if (matchData.now.batsman.nonStriker) {
    const nonStriker = {
      balls: matchData.now.batsman.nonStriker.balls,
      fours: matchData.now.batsman.nonStriker.fours,
      id: matchData.now.batsman.nonStriker.id,
      inAt: matchData.now.batsman.nonStriker.inAt,
      name: matchData.now.batsman.nonStriker.name,
      photoURL: matchData.now.batsman.nonStriker.photoURL,
      runs: matchData.now.batsman.nonStriker.runs,
      sixes: matchData.now.batsman.nonStriker.sixes,
      strikeRate:
        (matchData.now.batsman.nonStriker.runs / matchData.now.batsman.nonStriker.balls) * 100,
      status: "not out",
    };
    batsman = [...batsman, nonStriker];
  }

  if (batsman.length === 1) {
    docRef
      .update({
        "now.bowler": null,
        "now.extra": 0,
        "now.runRate": 0,
        "now.batsman.striker": null,
        "now.batsman.nonStriker": null,
        "now.balls": 0,
        "now.overs": 0,
        "now.freeHit": null,
        "now.battingTeam": matchData.now.bowlingTeam,
        "now.bowlingTeam": matchData.now.battingTeam,
        "now.battingScorer": matchData.now.bowlingScorer,
        "now.bowlingScorer": matchData.now.battingScorer,
        "now.runs": 0,
        "now.target": matchData.now.runs + 1,
        "now.inning": firebase.firestore.FieldValue.increment(1),
        "now.wickets": 0,
        "now.need": matchData.now.runs + 1,
        "now.partnership": {
          runs: 0,
          balls: 0,
          batsman1: "",
          batsman2: "",
        },
        "now.from": matchData.overs * 6,
        "now.reqRR": (matchData.now.runs + 1) / matchData.overs,
        [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(batsman[0]),
        [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls,
          batsman1: matchData.now.partnership.batsman1,
          batsman2: matchData.now.partnership.batsman2,
        }),
      })
      .then(() => {
        if (inning === "second") {
          if (matchData.innings.first.runs === matchData.innings.second.runs) {
            const innings = {
              super_1: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
              super_2: {
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
            };

            docRef.update({
              "now.battingTeam": matchData.now.battingTeam,
              "now.bowlingTeam": matchData.now.bowlingTeam,
              "now.battingScorer": matchData.now.battingScorer,
              "now.bowlingScorer": matchData.now.bowlingScorer,
              "now.target": null,
              "now.need": null,
              "now.from": null,
              "now.reqRR": null,
              "innings.super_1": innings.super_1,
              "innings.super_2": innings.super_2,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        } else if (inning === "super_2") {
          if (matchData.innings.super_1.runs === matchData.innings.super_2.runs) {
            const innings = {
              super_1: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
              super_2: {
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
            };

            docRef.update({
              "now.battingTeam": matchData.now.battingTeam,
              "now.bowlingTeam": matchData.now.bowlingTeam,
              "now.battingScorer": matchData.now.battingScorer,
              "now.bowlingScorer": matchData.now.bowlingScorer,
              "now.target": null,
              "now.need": null,
              "now.from": null,
              "now.reqRR": null,
              "innings.super_1": innings.super_1,
              "innings.super_2": innings.super_2,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        }
      });
  } else {
    docRef
      .update({
        "now.bowler": null,
        "now.extra": 0,
        "now.runRate": 0,
        "now.batsman.striker": null,
        "now.batsman.nonStriker": null,
        "now.balls": 0,
        "now.overs": 0,
        "now.freeHit": null,
        "now.battingTeam": matchData.now.bowlingTeam,
        "now.bowlingTeam": matchData.now.battingTeam,
        "now.battingScorer": matchData.now.bowlingScorer,
        "now.bowlingScorer": matchData.now.battingScorer,
        "now.runs": 0,
        "now.partnership": {
          runs: 0,
          balls: 0,
          batsman1: "",
          batsman2: "",
        },
        "now.target": matchData.now.runs + 1,
        "now.inning": firebase.firestore.FieldValue.increment(1),
        "now.wickets": 0,
        "now.need": matchData.now.runs + 1,
        "now.from": matchData.overs * 6,
        "now.reqRR": (matchData.now.runs + 1) / matchData.overs,
        [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
          batsman[0],
          batsman[1],
        ),
        [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls,
          batsman1: matchData.now.partnership.batsman1,
          batsman2: matchData.now.partnership.batsman2,
        }),
      })
      .then(() => {
        if (inning === "second") {
          if (matchData.innings.first.runs === matchData.innings.second.runs) {
            const innings = {
              super_1: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
              super_2: {
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
            };

            docRef.update({
              "now.battingTeam": matchData.now.battingTeam,
              "now.bowlingTeam": matchData.now.bowlingTeam,
              "now.battingScorer": matchData.now.battingScorer,
              "now.bowlingScorer": matchData.now.bowlingScorer,
              "now.target": null,
              "now.inning": 3,
              "now.need": null,
              "now.from": null,
              "now.reqRR": null,
              "innings.super_1": innings.super_1,
              "innings.super_2": innings.super_2,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        } else if (inning === "super_2") {
          if (matchData.innings.super_1.runs === matchData.innings.super_2.runs) {
            const innings = {
              super_1: {
                battingTeam: matchData.innings.second.battingTeam,
                bowlingTeam: matchData.innings.first.battingTeam,
                battingScorer: matchData.innings.second.battingScorer,
                bowlingScorer: matchData.innings.second.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
              super_2: {
                battingTeam: matchData.innings.first.battingTeam,
                bowlingTeam: matchData.innings.second.battingTeam,
                battingScorer: matchData.innings.first.battingScorer,
                bowlingScorer: matchData.innings.first.bowlingScorer,
                battingOrder: [],
                bowlingOrder: [],
                partnerships: [],
                fallOfWickets: [],
                ballByBall: [],
                overs: 0,
                balls: 0,
                runs: 0,
                wickets: 0,
                runRate: 0,
                extra: 0,
              },
            };

            docRef.update({
              "now.battingTeam": matchData.now.battingTeam,
              "now.bowlingTeam": matchData.now.bowlingTeam,
              "now.battingScorer": matchData.now.battingScorer,
              "now.bowlingScorer": matchData.now.bowlingScorer,
              "now.target": null,
              "now.inning": 3,
              "now.need": null,
              "now.from": null,
              "now.reqRR": null,
              "innings.super_1": innings.super_1,
              "innings.super_2": innings.super_2,
              superOver: true,
            });
          } else {
            endOfMatch(matchData, docRef, inning);
          }
        }
      });
  }
};
module.exports = endOfInnings;
