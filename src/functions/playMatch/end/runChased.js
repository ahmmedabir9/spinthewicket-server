const firebase = require('firebase-admin');
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const { UpdateQuickMatch } = require('../../../services/firebase');
const endOfMatch = require('./endOfMatch');

const runChased = async (matchData, inning) => {
  if (matchData.liveData.runs >= matchData.liveData.target) {
    const striker = {
      status: 'not out',
      ...matchData.liveData.batsman.striker,
    };
    const nonStriker = {
      status: 'not out',
      ...matchData.liveData.batsman.nonStriker,
    };

    let dataToUpdate = {
      'liveData.bowler': null,
      'liveData.batsman.striker': null,
      'liveData.batsman.nonStriker': null,
      'liveData.balls': 0,
      'liveData.overs': 0,
      'liveData.runs': 0,
      'liveData.wickets': 0,
      'liveData.thisOver': [],
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
        striker,
        nonStriker,
      ),

      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion({
        runs: matchData.liveData.partnership.runs,
        balls: matchData.liveData.partnership.balls,
        batsman1: matchData.liveData.partnership.batsman1,
        batsman2: matchData.liveData.partnership.batsman2,
      }),
      status: 'completed',
    };

    if (matchData.liveData.bowler) {
      dataToUpdate = {
        ...dataToUpdate,
        [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(
          matchData.liveData.bowler,
        ),
      };
    }

    const updateMatch = await UpdateQuickMatch(matchData?.id, dataToUpdate);

    await endOfMatch(updateMatch, inning);
  }
};
module.exports = runChased;
