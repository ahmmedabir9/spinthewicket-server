const firebase = require('firebase-admin')
// const collectIdsAndDocs = require('../../../../utils/collectIdsAndDocs')
const { UpdateQuickMatch } = require('../../../services/firebase')
const endOfMatch = require('./endOfMatch')

const runChased = async (matchData, inning) => {
  if (matchData.now.runs >= matchData.now.target) {
    const striker = {
      status: 'not out',
      ...matchData.now.batsman.striker,
    }
    const nonStriker = {
      status: 'not out',
      ...matchData.now.batsman.nonStriker,
    }

    let dataToUpdate = {
      'now.bowler': null,
      'now.batsman.striker': null,
      'now.batsman.nonStriker': null,
      'now.balls': 0,
      'now.overs': 0,
      'now.runs': 0,
      'now.wickets': 0,
      'now.thisOver': [],
      [`innings.${inning}.battingOrder`]: firebase.firestore.FieldValue.arrayUnion(
        striker,
        nonStriker,
      ),

      [`innings.${inning}.partnerships`]: firebase.firestore.FieldValue.arrayUnion(
        {
          runs: matchData.now.partnership.runs,
          balls: matchData.now.partnership.balls,
          batsman1: matchData.now.partnership.batsman1,
          batsman2: matchData.now.partnership.batsman2,
        },
      ),
      status: 'completed',
    }

    if (matchData.now.bowler) {
      dataToUpdate = {
        ...dataToUpdate,
        [`innings.${inning}.bowlingOrder`]: firebase.firestore.FieldValue.arrayUnion(
          matchData.now.bowler,
        ),
      }
    }

    const updateMatch = await UpdateQuickMatch(matchData?.id, dataToUpdate)

    await endOfMatch(updateMatch, inning)
  }
}
module.exports = runChased
