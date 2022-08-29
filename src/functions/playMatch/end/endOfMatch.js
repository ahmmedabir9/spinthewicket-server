const { UpdateQuickMatch } = require('../../../services/firebase')
const saveMatch = require('../../saveMatch/saveMatch')

const endOfMatch = async (matchData, inning) => {
  var result
  if (matchData.innings.first.runs > matchData.innings.second.runs) {
    result = {
      winner: matchData.innings.first.battingTeam.name,
      wonBy: 'Runs',
      runs: matchData.innings.first.runs - matchData.innings.second.runs,
    }
  } else if (matchData.innings.first.runs < matchData.innings.second.runs) {
    result = {
      winner: matchData.innings.second.battingTeam.name,
      wonBy: 'Wickets',
      wickets: 10 - matchData.innings.second.wickets,
    }
  } else if (matchData.superOver) {
    if (matchData.innings.super_1.runs > matchData.innings.super_2.runs) {
      result = {
        winner: matchData.innings.super_1.battingTeam.name,
        wonBy: 'Super Over',
      }
    } else if (
      matchData.innings.super_1.runs < matchData.innings.super_2.runs
    ) {
      result = {
        winner: matchData.innings.super_2.battingTeam.name,
        wonBy: 'Super Over',
      }
    }
  } else if (matchData.innings.first.runs === matchData.innings.second.runs) {
    result = {
      status: 'Tied',
    }
  }

  let dataToUpdate = {
    result: result,
    status: 'completed',
    endedAt: new Date(),
  }

  const updateMatch = await UpdateQuickMatch(matchData?.id, dataToUpdate)
  // saveMatch(updateMatch)
}
module.exports = endOfMatch
