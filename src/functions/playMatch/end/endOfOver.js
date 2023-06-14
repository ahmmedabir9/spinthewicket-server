const firebase = require('firebase-admin');
const { UpdateQuickMatch } = require('../../../services/firebase');
const endOfInnings = require('./endOfInnings');

const endOfOver = async (matchData, inning) => {
  const bowler = {
    balls: 0,
    runs: matchData.liveData.bowler.runs,
    id: matchData.liveData.bowler.id,
    maidens: matchData.liveData.bowler.maidens,
    economy: matchData.liveData.bowler.economy,
    overs: matchData.liveData.bowler.overs + 1,
    wickets: matchData.liveData.bowler.wickets,
  };

  try {
    let updateData = {
      'liveData.bowler': null,
      'liveData.batsman.striker': matchData.liveData.batsman.nonStriker,
      'liveData.batsman.nonStriker': matchData.liveData.batsman.striker,
      'liveData.balls': 0,
      'liveData.thisOver': [],
      'liveData.overs': firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.overs`]: firebase.firestore.FieldValue.increment(1),
      [`innings.${inning}.balls`]: 0,
      [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(bowler),
    };

    const updateMatch = await UpdateQuickMatch(matchData.id, updateData);

    // await docRef.update()

    if (updateMatch.liveData.overs === updateMatch.overs || updateMatch.superOver) {
      await endOfInnings(updateMatch, inning);
    }

    return 'OK';
  } catch (error) {
    return error;
  }
};
module.exports = endOfOver;
