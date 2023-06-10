const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../../utils/collectIdsAndDocs");
const endOfMatch = require("./endOfMatch");

const endOfInnings = (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);
    if (newData.now.overs === newData.overs || newData.superOver) {
      var batsman = [];
      if (newData.now.batsman.striker) {
        const striker = {
          balls: newData.now.batsman.striker.balls,
          fours: newData.now.batsman.striker.fours,
          id: newData.now.batsman.striker.id,
          inAt: newData.now.batsman.striker.inAt,
          name: newData.now.batsman.striker.name,
          photoURL: newData.now.batsman.striker.photoURL,
          runs: newData.now.batsman.striker.runs,
          sixes: newData.now.batsman.striker.sixes,
          strikeRate: (newData.now.batsman.striker.runs / newData.now.batsman.striker.balls) * 100,
          status: "not out",
        };
        batsman = [...batsman, striker];
      }
      if (newData.now.batsman.nonStriker) {
        const nonStriker = {
          balls: newData.now.batsman.nonStriker.balls,
          fours: newData.now.batsman.nonStriker.fours,
          id: newData.now.batsman.nonStriker.id,
          inAt: newData.now.batsman.nonStriker.inAt,
          name: newData.now.batsman.nonStriker.name,
          photoURL: newData.now.batsman.nonStriker.photoURL,
          runs: newData.now.batsman.nonStriker.runs,
          sixes: newData.now.batsman.nonStriker.sixes,
          strikeRate:
            (newData.now.batsman.nonStriker.runs / newData.now.batsman.nonStriker.balls) * 100,
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
            "now.battingTeam": newData.now.bowlingTeam,
            "now.bowlingTeam": newData.now.battingTeam,
            "now.battingScorer": newData.now.bowlingScorer,
            "now.bowlingScorer": newData.now.battingScorer,
            "now.runs": 0,
            "now.target": newData.now.runs + 1,
            "now.inning": firebase.firestore.FieldValue.increment(1),
            "now.wickets": 0,
            "now.need": newData.now.runs + 1,
            "now.partnership": {
              runs: 0,
              balls: 0,
              batsman1: "",
              batsman2: "",
            },
            "now.from": newData.overs * 6,
            "now.reqRR": (newData.now.runs + 1) / newData.overs,
            [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
              batsman[0],
            ),
            [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
              runs: newData.now.partnership.runs,
              balls: newData.now.partnership.balls,
              batsman1: newData.now.partnership.batsman1,
              batsman2: newData.now.partnership.batsman2,
            }),
          })
          .then(() => {
            if (inning === "second") {
              if (newData.innings.first.runs === newData.innings.second.runs) {
                const innings = {
                  firstSuper: {
                    battingTeam: newData.innings.second.battingTeam,
                    bowlingTeam: newData.innings.first.battingTeam,
                    battingScorer: newData.innings.second.battingScorer,
                    bowlingScorer: newData.innings.second.bowlingScorer,
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
                  secondSuper: {
                    battingTeam: newData.innings.first.battingTeam,
                    bowlingTeam: newData.innings.second.battingTeam,
                    battingScorer: newData.innings.first.battingScorer,
                    bowlingScorer: newData.innings.first.bowlingScorer,
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
                  "now.battingTeam": newData.now.battingTeam,
                  "now.bowlingTeam": newData.now.bowlingTeam,
                  "now.battingScorer": newData.now.battingScorer,
                  "now.bowlingScorer": newData.now.bowlingScorer,
                  "now.target": null,
                  "now.need": null,
                  "now.from": null,
                  "now.reqRR": null,
                  "innings.firstSuper": innings.firstSuper,
                  "innings.secondSuper": innings.secondSuper,
                  superOver: true,
                });
              } else {
                endOfMatch(newData, docRef, inning);
              }
            } else if (inning === "secondSuper") {
              if (newData.innings.firstSuper.runs === newData.innings.secondSuper.runs) {
                const innings = {
                  firstSuper: {
                    battingTeam: newData.innings.second.battingTeam,
                    bowlingTeam: newData.innings.first.battingTeam,
                    battingScorer: newData.innings.second.battingScorer,
                    bowlingScorer: newData.innings.second.bowlingScorer,
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
                  secondSuper: {
                    battingTeam: newData.innings.first.battingTeam,
                    bowlingTeam: newData.innings.second.battingTeam,
                    battingScorer: newData.innings.first.battingScorer,
                    bowlingScorer: newData.innings.first.bowlingScorer,
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
                  "now.battingTeam": newData.now.battingTeam,
                  "now.bowlingTeam": newData.now.bowlingTeam,
                  "now.battingScorer": newData.now.battingScorer,
                  "now.bowlingScorer": newData.now.bowlingScorer,
                  "now.target": null,
                  "now.need": null,
                  "now.from": null,
                  "now.reqRR": null,
                  "innings.firstSuper": innings.firstSuper,
                  "innings.secondSuper": innings.secondSuper,
                  superOver: true,
                });
              } else {
                endOfMatch(newData, docRef, inning);
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
            "now.battingTeam": newData.now.bowlingTeam,
            "now.bowlingTeam": newData.now.battingTeam,
            "now.battingScorer": newData.now.bowlingScorer,
            "now.bowlingScorer": newData.now.battingScorer,
            "now.runs": 0,
            "now.partnership": {
              runs: 0,
              balls: 0,
              batsman1: "",
              batsman2: "",
            },
            "now.target": newData.now.runs + 1,
            "now.inning": firebase.firestore.FieldValue.increment(1),
            "now.wickets": 0,
            "now.need": newData.now.runs + 1,
            "now.from": newData.overs * 6,
            "now.reqRR": (newData.now.runs + 1) / newData.overs,
            [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
              batsman[0],
              batsman[1],
            ),
            [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
              runs: newData.now.partnership.runs,
              balls: newData.now.partnership.balls,
              batsman1: newData.now.partnership.batsman1,
              batsman2: newData.now.partnership.batsman2,
            }),
          })
          .then(() => {
            if (inning === "second") {
              if (newData.innings.first.runs === newData.innings.second.runs) {
                const innings = {
                  firstSuper: {
                    battingTeam: newData.innings.second.battingTeam,
                    bowlingTeam: newData.innings.first.battingTeam,
                    battingScorer: newData.innings.second.battingScorer,
                    bowlingScorer: newData.innings.second.bowlingScorer,
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
                  secondSuper: {
                    battingTeam: newData.innings.first.battingTeam,
                    bowlingTeam: newData.innings.second.battingTeam,
                    battingScorer: newData.innings.first.battingScorer,
                    bowlingScorer: newData.innings.first.bowlingScorer,
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
                  "now.battingTeam": newData.now.battingTeam,
                  "now.bowlingTeam": newData.now.bowlingTeam,
                  "now.battingScorer": newData.now.battingScorer,
                  "now.bowlingScorer": newData.now.bowlingScorer,
                  "now.target": null,
                  "now.inning": 3,
                  "now.need": null,
                  "now.from": null,
                  "now.reqRR": null,
                  "innings.firstSuper": innings.firstSuper,
                  "innings.secondSuper": innings.secondSuper,
                  superOver: true,
                });
              } else {
                endOfMatch(newData, docRef, inning);
              }
            } else if (inning === "secondSuper") {
              if (newData.innings.firstSuper.runs === newData.innings.secondSuper.runs) {
                const innings = {
                  firstSuper: {
                    battingTeam: newData.innings.second.battingTeam,
                    bowlingTeam: newData.innings.first.battingTeam,
                    battingScorer: newData.innings.second.battingScorer,
                    bowlingScorer: newData.innings.second.bowlingScorer,
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
                  secondSuper: {
                    battingTeam: newData.innings.first.battingTeam,
                    bowlingTeam: newData.innings.second.battingTeam,
                    battingScorer: newData.innings.first.battingScorer,
                    bowlingScorer: newData.innings.first.bowlingScorer,
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
                  "now.battingTeam": newData.now.battingTeam,
                  "now.bowlingTeam": newData.now.bowlingTeam,
                  "now.battingScorer": newData.now.battingScorer,
                  "now.bowlingScorer": newData.now.bowlingScorer,
                  "now.target": null,
                  "now.inning": 3,
                  "now.need": null,
                  "now.from": null,
                  "now.reqRR": null,
                  "innings.firstSuper": innings.firstSuper,
                  "innings.secondSuper": innings.secondSuper,
                  superOver: true,
                });
              } else {
                endOfMatch(newData, docRef, inning);
              }
            }
          });
      }
    }
  });
};
module.exports = endOfInnings;
