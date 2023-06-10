const firebase = require("firebase-admin");
const { UpdateQuickMatch } = require("../../../services/firebase");
const endOfInnings = require("./endOfInnings");

const endOfOver = async (matchData, inning) => {
  const bowler = {
    balls: 0,
    runs: matchData.now.bowler.runs,
    id: matchData.now.bowler.id,
    maidens: matchData.now.bowler.maidens,
    economy: matchData.now.bowler.economy,
    overs: matchData.now.bowler.overs + 1,
    wickets: matchData.now.bowler.wickets,
  };

  try {
    let updateData = {
      "now.bowler": null,
      "now.batsman.striker": matchData.now.batsman.nonStriker,
      "now.batsman.nonStriker": matchData.now.batsman.striker,
      "now.balls": 0,
      "now.thisOver": [],
      "now.overs": firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.overs`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.balls`]: 0,
      [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(bowler),
    };

    const updateMatch = await UpdateQuickMatch(matchData.id, updateData);

    // await docRef.update()

    if (updateMatch.now.overs === updateMatch.overs || updateMatch.superOver) {
      await endOfInnings(updateMatch, inning);
    }

    return "OK";
  } catch (error) {
    return error;
  }
};
module.exports = endOfOver;
