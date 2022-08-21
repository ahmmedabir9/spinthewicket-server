const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");
const endOfMatch = require("./endOfMatch");

const allOut = (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);
    if (
      newData.now.wickets === 10 ||
      (newData.superOver && newData.now.wickets >= 2)
    ) {
      var bowler = {
        name: newData.now.bowler.name,
        balls: newData.now.bowler.balls,
        runs: newData.now.bowler.runs,
        id: newData.now.bowler.id,
        photoURL: newData.now.bowler.photoURL,
        maidens: newData.now.bowler.maidens,
        role: newData.now.bowler.role,
        economy: newData.now.bowler.economy,
        overs: newData.now.bowler.overs,
        wickets: newData.now.bowler.wickets,
      };

      if (newData.now.balls === 6) {
        bowler = {
          name: newData.now.bowler.name,
          balls: 0,
          runs: newData.now.bowler.runs,
          id: newData.now.bowler.id,
          photoURL: newData.now.bowler.photoURL,
          maidens: newData.now.bowler.maidens,
          role: newData.now.bowler.role,
          economy: newData.now.bowler.economy,
          overs: newData.now.bowler.overs + 1,
          wickets: newData.now.bowler.wickets,
        };
      }

      var notOut;

      if (newData.now.batsman.nonStriker) {
        notOut = {
          balls: newData.now.batsman.nonStriker.balls,
          fours: newData.now.batsman.nonStriker.fours,
          id: newData.now.batsman.nonStriker.id,
          inAt: newData.now.batsman.nonStriker.inAt,
          name: newData.now.batsman.nonStriker.name,
          photoURL: newData.now.batsman.nonStriker.photoURL,
          runs: newData.now.batsman.nonStriker.runs,
          sixes: newData.now.batsman.nonStriker.sixes,
          strikeRate:
            (newData.now.batsman.nonStriker.runs /
              newData.now.batsman.nonStriker.balls) *
            100,
          status: "not out",
        };
      } else if (newData.now.batsman.striker) {
        notOut = {
          balls: newData.now.batsman.striker.balls,
          fours: newData.now.batsman.striker.fours,
          id: newData.now.batsman.striker.id,
          inAt: newData.now.batsman.striker.inAt,
          name: newData.now.batsman.striker.name,
          photoURL: newData.now.batsman.striker.photoURL,
          runs: newData.now.batsman.striker.runs,
          sixes: newData.now.batsman.striker.sixes,
          strikeRate:
            (newData.now.batsman.striker.runs /
              newData.now.batsman.striker.balls) *
            100,
          status: "not out",
        };
      }

      docRef
        .update({
          "now.bowler": null,
          "now.batsman.striker": null,
          "now.batsman.nonStriker": null,
          "now.balls": 0,
          "now.overs": 0,
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
          "now.thisOver": [],
          "now.need": newData.now.runs + 1,
          "now.from": newData.overs * 6,
          "now.reqRR": (newData.now.runs + 1) / newData.overs,
          [`innings.${inning}.battingOrder`]:
            firebase.firestore.FieldValue.arrayUnion(notOut),
          [`innings.${inning}.bowlingOrder`]:
            firebase.firestore.FieldValue.arrayUnion(bowler),
        })
        .then(() => {
          if (inning === "second") {
            if (newData.innings.first.runs === newData.innings.second.runs) {
              const innings = {
                super_1: {
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
                super_2: {
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
                "innings.super_1": innings.super_1,
                "innings.super_2": innings.super_2,
                superOver: true,
              });
            } else {
              endOfMatch(newData, docRef, inning);
            }
          } else if (inning === "super_2") {
            if (newData.innings.super_1.runs === newData.innings.super_2.runs) {
              const innings = {
                super_1: {
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
                super_2: {
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
                "innings.super_1": innings.super_1,
                "innings.super_2": innings.super_2,
                superOver: true,
              });
            } else {
              endOfMatch(newData, docRef, inning);
            }
          }
        });
    }
  });
};
module.exports = allOut;
