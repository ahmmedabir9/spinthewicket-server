const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../../utils/collectIdsAndDocs");
const endOfMatch = require("./endOfMatch");

const runChased = (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);
    if (newData.now.runs >= newData.now.target) {
      const striker = {
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
          (newData.now.batsman.nonStriker.runs /
            newData.now.batsman.nonStriker.balls) *
          100,
        status: "not out",
      };
      if (newData.now.bowler && newData.now.bowler.balls < 6) {
        const bowler = {
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
        docRef
          .update({
            "now.bowler": null,
            "now.batsman.striker": null,
            "now.batsman.nonStriker": null,
            "now.balls": 0,
            "now.overs": 0,
            "now.runs": 0,
            "now.wickets": 0,
            "now.thisOver": [],
            [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
              striker,
              nonStriker
            ),
            [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(
              bowler
            ),
            [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion(
              {
                runs: newData.now.partnership.runs,
                balls: newData.now.partnership.balls,
                batsman1: newData.now.partnership.batsman1,
                batsman2: newData.now.partnership.batsman2,
              }
            ),
            status: "completed",
          })
          .then(() => {
            endOfMatch(newData, docRef, inning);
          });
      } else {
        docRef
          .update({
            "now.bowler": null,
            "now.batsman.striker": null,
            "now.batsman.nonStriker": null,
            "now.balls": 0,
            "now.overs": 0,
            "now.runs": 0,
            "now.wickets": 0,
            "now.thisOver": [],
            [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
              striker,
              nonStriker
            ),

            [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion(
              {
                runs: newData.now.partnership.runs,
                balls: newData.now.partnership.balls,
                batsman1: newData.now.partnership.batsman1,
                batsman2: newData.now.partnership.batsman2,
              }
            ),
            status: "completed",
          })
          .then(() => {
            endOfMatch(newData, docRef, inning);
          });
      }
    }
  });
};
module.exports = runChased;
