const firebase = require("firebase-admin");
const collectIdsAndDocs = require("../../../../utils/collectIdsAndDocs");
const endOfInnings = require("./endOfInnings");

const endOfOver = (matchData, docRef, inning) => {
  docRef.get().then((doc) => {
    const newData = collectIdsAndDocs(doc);
    if (newData.now.balls === 6) {
      const bowler = {
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

      docRef
        .update({
          "now.bowler": null,
          "now.batsman.striker": newData.now.batsman.nonStriker,
          "now.batsman.nonStriker": newData.now.batsman.striker,
          "now.balls": 0,
          "now.thisOver": [],
          "now.overs": firebase.firestore.FieldValue.increment(1),
          [`innings.${inning}.overs`]: firebase.firestore.FieldValue.increment(
            1
          ),
          [`innings.${inning}.balls`]: 0,
          [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(
            bowler
          ),
        })
        .then(() => {
          if (
            matchData.now.overs >= matchData.overs - 1 ||
            matchData.superOver
          ) {
            endOfInnings(newData, docRef, inning);
          }
        });
    }
  });
};
module.exports = endOfOver;
